// 851eb7d1-e4bd-51e9-a533-ad904e8e7d25
import { signOut } from "firebase/auth";
import { auth as firebaseAuth } from "@/services/firebase";
import type {
  IAuthCreds,
  IAuthLogoutResponse,
  IAuthResponse,
  IAuthWhoResponse,
  OrNoValue,
} from "@/types";
import {
  TOKEN_DEFAULT,
  URL_API_who,
  URL_AUTH_login,
  URL_AUTH_logout,
  URL_AUTH_register,
} from "@/config";
import { schemaAuthCredentials, schemaAuthData, schemaJwt } from "@/schemas";

export const useStoreApiAuth = defineStore("auth", () => {
  const {
    key: { CHAT_NAME: DISPLAY_NAME },
    stores: {
      auth: {
        KEY_ACCESS_TOKEN,
        KEY_USEFETCH_AUTHDATA,
        initial: initialStorage,
        authHeaders,
      },
    },
  } = useAppConfig();
  // jwt
  const token$ = useLocalStorage(KEY_ACCESS_TOKEN, initialStorage, {
    initOnMounted: true,
  });
  const headers$ = computed(() => authHeaders(token$.value));
  // init display name @login
  const displayName = useLocalStorage(DISPLAY_NAME, () => "", {
    initOnMounted: true,
  });

  const {
    data: user$,
    refresh: authDataReload,
    execute: authDataStart,
    // pending,
  } = useFetch<OrNoValue<IAuthWhoResponse>>(URL_API_who, {
    key: KEY_USEFETCH_AUTHDATA,
    method: "GET",
    headers: headers$,
    default: () => null,
    transform: (responseAuth) => {
      try {
        return schemaAuthData.parse(responseAuth);
      } catch (error) {
        console.error({ "useStoreApiAuth:error": error });
      }
      return null;
    },
    // start manually
    lazy: true,
    immediate: false,
  });
  const reload = async () => await authDataReload();

  const uid = computed(() => get(user$.value, "id"));
  const profile = computed(() => get(user$.value, "profile") || {});
  const initialized$ = useOnceMountedOn(true, authDataStart);
  const isAuth$ = computed(() => schemaAuthData.safeParse(user$.value).success);
  const isAdmin$ = computed(
    () => isAuth$.value && true === get(user$.value, "admin")
  );
  const isAuthenticated$ = computed(() => isAuth$.value && !isDefault$.value);
  const isDefault$ = computed(
    () => isAuth$.value && true == get(user$.value, "default")
  );
  const isExternal$ = computed(
    () => isAuth$.value && true == get(user$.value, "external")
  );

  // #@apollo
  // apply auth token to Apollo client
  // ..if GraphQL API expects authentication to be passed via a HTTP header
  const {
    // apollo.nuxtjs.org/getting-started/auth-helpers#onlogin
    onLogin: onLoginApollo,
    // apollo.nuxtjs.org/getting-started/auth-helpers#onlogout-reference
    onLogout: onLogoutApollo,
  } = useApollo();

  // token.apollo --sync
  watchEffect(async () => {
    if (token$.value) await onLoginApollo(token$.value);
  });

  const { calcDisplayName: calcDisplayNameOnNoStorage } = useAuthUtils();
  // sync apollo:auth
  watch(isAuth$, async (isAuth) => {
    if (isAuth) {
      // #cache apollo token
      // await onLoginApollo(token$.value);

      // cache auto `chatName`
      if (!displayName.value) calcDisplayNameOnNoStorage(user$.value);
    } else {
      // #signal logout to apollo
      await onLogoutApollo();
    }
  });

  // track api activity
  const psAuth = useProcessMonitor();
  const { watchProcessing } = useStoreAppProcessing();
  watchProcessing(psAuth.processing);

  // update store @account:update
  const { ioeventAccountUpdated } = useTopics();
  const IO_accountUpdated = computed(() => ioeventAccountUpdated(uid.value));
  watchEffect(() => useIOEvent(IO_accountUpdated.value, reload));

  const authentication$ =
    (authEndpoint: string = URL_AUTH_login) =>
    async (credentials: IAuthCreds) => {
      // # auth only unauthenticated user
      if (isAuthenticated$.value) return;

      let token: OrNoValue<string> = "";
      try {
        psAuth.begin();
        token = get(
          await $fetch<IAuthResponse>(authEndpoint, {
            method: "POST",
            body: schemaAuthCredentials.parse(credentials),
          }),
          "token"
        );
      } catch (error) {
        psAuth.setError(error);
      } finally {
        psAuth.done();
      }
      if (!psAuth.error.value && schemaJwt.safeParse(token).success) {
        token$.value = token;
        psAuth.successful();
      }
    };
  // @register
  const register = authentication$(URL_AUTH_register);
  // @login
  const login = authentication$();
  // @logout
  const logout = async () => {
    if (!isAuth$.value) return;
    try {
      psAuth.begin();
      await $fetch<IAuthLogoutResponse>(URL_AUTH_logout, {
        method: "POST",
        // headers: authHeaders(token$.value),
        headers: headers$.value,
        onResponse: async ({ response }) => {
          if (response.ok) {
            // logout success, cache cleared server side,
            //  set token invalid
            token$.value = "";
            psAuth.successful();

            // clear fb auth
            await signOut(firebaseAuth);
          }
        },
      });
    } catch (error) {
      psAuth.setError(error);
    } finally {
      psAuth.done();
    }
    if (!psAuth.error.value) psAuth.successful();
  };

  // #api
  return {
    token$,
    user$,
    //
    uid,
    profile,
    //
    login,
    register,
    logout,
    reload,
    // alias
    authDataReload: reload,
    //
    initialized$,
    isAuth$,
    isAuthenticated$,
    isAdmin$,
    isDefault$,
    isExternal$,
    // @refs
    displayName,
    // @api/flags
    status: psAuth,
    // hard login
    //  put token:validated
    tokenPut: (t: string) => {
      token$.value = schemaJwt.parse(t);
    },
    tokenPutDefault: () => {
      token$.value = TOKEN_DEFAULT;
    },
  };
});
