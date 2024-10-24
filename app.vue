<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config ##const
const {
  app: { LOGOUT_RELOAD_PATH },
  vars: { FLAG_SHOW_AUTH_BACKGROUND },
  re: { ROUTE_NAMES_SKIP_REDIRECT_APP_ON_AUTHENTICATED },
} = useAppConfig();

// ##utils
const route = useRoute();
const skipRedirectToAppOnAuthenticated = (routeName: any) =>
  some(ROUTE_NAMES_SKIP_REDIRECT_APP_ON_AUTHENTICATED, (re: RegExp) =>
    String(routeName).match(re)
  );

// ##icons
// ##refs ##flags
// ##data ##auth ##state
const auth = useStoreApiAuth();
// ##computed
// ##forms ##helpers ##handlers

// ##watch
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
useOnceOn(
  () => auth.initialized$ && !auth.isAuth$,
  () => {
    nextTick(() => {
      if (!auth.token$) auth.tokenPutDefault();
    });
  }
);

// ##head ##meta
useHead({
  titleTemplate: (ttl: any) => `${ttl ? ttl + " | " : ""} --app`,
});
useSeoMeta({
  title: "NuxtApp",
  ogTitle: "nuxtapp",
  description: "nuxtapp",
  ogDescription: "nuxtapp",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});

// ##provide
// provide current user data
const uid = computed(() => auth.uid);
const token = computed(() => auth.token$ || "");
const myDisplayName = computed(() => auth.displayName || "");

provide(key_UID, uid);
provide(key_TOKEN, token);
provide(key_USER_DISPLAY_NAME, myDisplayName);

// @@eos
</script>
<template>
  <section class="root---app-vue">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- @@status -->
    <NuxtLoadingIndicator color="red" />
    <Dump :data="{ user: auth.user$ }" />
  </section>
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
</style>
