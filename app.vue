<script setup lang="ts">
// ##imports
import { type MessagePayload } from "firebase/messaging";
import { SpinnerAppProcessing } from "@/components/ui";
import { VNavigationDrawerChatActive, VBtnWScrollTop } from "@/components/app";
// ##config ##const
const {
  app: { LOGOUT_RELOAD_PATH, BODY_ADD_CLASS },
  vars: { FLAG_SHOW_AUTH_BACKGROUND, FLAG_SHOW_AKTIVA_DISTRIBUCIJA_BG },
  re: { ROUTE_NAMES_SKIP_REDIRECT_APP_ON_AUTHENTICATED },
  theme: { DEFAULT: DEFAULT_theme },
} = useAppConfig();
// ##utils
const route = useRoute();
const skipRedirectToAppOnAuthenticated = (routeName: any) =>
  some(ROUTE_NAMES_SKIP_REDIRECT_APP_ON_AUTHENTICATED, (re: RegExp) =>
    String(routeName).match(re)
  );

// ##icons
// ##refs ##flags
const authBgActive = useState(FLAG_SHOW_AUTH_BACKGROUND);
const showBgAktivaDistribucija = useState(FLAG_SHOW_AKTIVA_DISTRIBUCIJA_BG);
// ##data ##auth ##state
const auth = useStoreApiAuth();
// ##computed
const addAppClass = computed(() => get(route.meta, "@page.appClass", ""));
const addBodyClass = computed(() => get(route.meta, "@page.bodyClass", ""));
const addHtmlClass = computed(() => get(route.meta, "@page.htmlClass", ""));
const bodyAttrs = computed(() => ({
  class: `${BODY_ADD_CLASS} ${addBodyClass.value}`,
}));
const htmlAttrs = computed(() => ({
  class: `${addHtmlClass.value}`,
}));

// ##forms ##helpers ##handlers
// ##watch
const { isActive: isYAndUp, scrollTop: wScrollTop } = useWindowScrollYAndUp();

// onAuthStatus
watch(
  () => auth.isAuthenticated$,
  async (isAuthenticated: boolean) => {
    isAuthenticated
      ? skipRedirectToAppOnAuthenticated(route.name)
        ? undefined
        : await navigateTo({ name: "app" })
      : reloadNuxtApp({
          path: LOGOUT_RELOAD_PATH,
          persistState: false,
          ttl: 1,
          // force: true,
        });
  }
);

// ##hooks:lifecycle
// set default guest key @!auth
const onceAuthInitDefault = once(() => {
  auth.tokenPutDefault();
});
watch(
  () => auth.initialized$,
  (initialized: boolean) => {
    if (!initialized) return;
    if (auth.token$) return;
    onceAuthInitDefault();
  }
);
// useOnceOn(
//   () => auth.initialized$ && !auth.isAuth$,
//   () => {
//     nextTick(() => {
//       if (!auth.token$) auth.tokenPutDefault();
//     });
//   }
// );

// ##head ##meta
useHead({
  titleTemplate: (ttl: any) => `${ttl ? ttl + " | " : ""} @frikom.nikolav.rs`,
  bodyAttrs,
  htmlAttrs,
});
useSeoMeta({
  title: "app",
  ogTitle: "app",
  description: "app",
  ogDescription: "app",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});

// ##provide
// provide current user data
const uid = computed(() => auth.uid);
const token = computed(() => auth.token$ || "");
const myDisplayName = computed(() => auth.displayName || "");
const ref_appMain = ref();

provide(key_UID, uid);
provide(key_TOKEN, token);
provide(key_USER_DISPLAY_NAME, myDisplayName);
provide(key_REF_APPMAIN, ref_appMain);

// ##messaging
useFirebaseCloudMessaging({
  onMessage: (payload: MessagePayload) => {
    console.log({ "firebaseCloudMessaging:payload --debug": payload });
  },
});

// TOPIC_CHAT_ACTIVE_main:oYgQb3SHdQiLpHO1Y0cv
// @@eos
</script>
<template>
  <VApp
    class="component--appMain"
    ref="ref_appMain"
    :theme="DEFAULT_theme"
    :class="[
      authBgActive ? 'v-app--authBgActive' : '',
      showBgAktivaDistribucija
        ? 'CLASS--332e1723-3b28-5bc4-b8fe-1630194b3a00'
        : '',
      addAppClass,
    ]"
  >
    <!-- @@overlays -->
    <VNavigationDrawerChatActive />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- @@status -->
    <NuxtLoadingIndicator color="red" />
    <SpinnerAppProcessing :opacity="0.81" />

    <!-- @@scroll-top:btn -->
    <VFadeTransition>
      <VBtnWScrollTop @click="wScrollTop" v-if="isYAndUp" />
    </VFadeTransition>
  </VApp>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.BLUR-enter-active,
.BLUR-leave-active {
  transition: all 0.122s;
}

.BLUR-enter-from,
.BLUR-leave-to {
  opacity: 0;
  filter: blur(0.122rem);
}

.BLUR-leave-active {
  position: absolute;
  z-index: -1;
  width: 100%;
}

.v-app--authBgActive {
  /* background-image: url("~/assets/images/svg/frikom-logo--auth-login.svg") !important; */
  background-image: url("~/assets/images/svg/frikom-logo--teren.svg") !important;
  background-repeat: no-repeat !important;
  background-size: 102% !important;
  background-position: center 9% !important;
}

// center menus @viewport
.CLASS--VMenu-centered-viewport {
  position: fixed;
  justify-content: center;
  .v-overlay__content {
    top: 50%;
    transform: translateY(-50%);
  }
}

.CLASS--VList-item-spacer-none {
  .v-list-item__prepend {
    .v-list-item__spacer {
      width: 0 !important;
    }
  }
}

.CLASS--quill-container {
  p {
    margin-top: 1.5rem;
  }
}
.component--appMain.CLASS--332e1723-3b28-5bc4-b8fe-1630194b3a00 {
  background-image: url("/bg--aktiva-distribucija.png") !important;
  object-fit: cover !important;
  background-position: 0 49% !important;
  background-repeat: no-repeat !important;
}

// dynamic classes, select @pages
.CLASS--f6b8cb17-1a95-5506-a6ac-bc03f09a1a3d {
  background-image: url("/assets/bg--forms-folder.png") !important;
  background-repeat: no-repeat !important;
  object-fit: cover !important;
  background-size: cover !important;
  // background-position: 0 49% !important;
}
.CLASS--1826dd05-b3c4-51a0-b6b6-3589840fab22 {
  background-image: url("/assets/bg--reports-submited.png") !important;
  background-repeat: no-repeat !important;
  object-fit: cover !important;
  background-size: 133% !important;
  background-position: 30% -69% !important;
}
.CLASS--21225bf8-1f99-51ff-8f0f-f5f9c72639a2 {
  background-image: url("/assets/bg-tim.png") !important;
  background-repeat: no-repeat !important;
  // object-fit: cover !important;
  background-size: cover !important;
  background-position: 57% 9% !important;
}
</style>
