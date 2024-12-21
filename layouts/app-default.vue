<script setup lang="ts">
import { useDisplay } from "vuetify";
import { AppNavigationButtons, VBtnTopicChatToggle } from "@/components/app";

const auth = useStoreApiAuth();
const route = useRoute();
const { smAndUp } = useDisplay();
const {
  app: { MODE_DEBUG, DEFAULT_TRANSITION },
  links: {
    external: { DRIVE_ATTACHMENTS_MAIN },
  },
} = useAppConfig();

const { ID_subnav, hasNavSecondary, sidebarMainHeight, appBarTitle } =
  useSidebarMenu();

const openDriveAttachmentsMain = async () =>
  await navigateTo(DRIVE_ATTACHMENTS_MAIN, { open: { target: "_blank" } });

// @@eos
</script>
<template>
  <section class="layout--appDefault">
    <VAppBar elevation="1" density="comfortable">
      <!-- @@logo -->
      <!-- icon="$iconFrikomLogo" -->
      <!-- icon="icons-local:logo-nikolavrs" -->
      <template #prepend>
        <NuxtLink :to="{ name: 'index' }">
          <Iconx
            icon="$iconFrikomLogo"
            class="ms-2 -rotate-1 *text-error-darken-1"
            :class="[smAndUp ? undefined : 'scale-[91%]']"
            size="4.22rem"
          />
        </NuxtLink>
      </template>
      <VAppBarTitle
        v-if="appBarTitle"
        class="ms-2 font-italic font-weight-thin text-body-1 text-primary"
        >{{ appBarTitle }}</VAppBarTitle
      >
      <VSpacer v-if="!smAndUp" />
      <VBtn
        v-if="MODE_DEBUG"
        size="small"
        rounded="pill"
        :to="{ name: 'demo' }"
        variant="plain"
        >demo</VBtn
      >
      <VBtnTopicChatToggle
        v-if="auth.isAuthenticated$ && !auth.isExternal$"
        main
        density="comfortable"
        color="primary-darken-1"
        :props-icon="{
          icon: 'icons-local:megaphone',
          size: '1.66rem',
          class: 'translate-x-[2px]',
        }"
      />
      <VBtn
        :disabled="!auth.isAuthenticated$"
        size="large"
        density="comfortable"
        icon
        variant="plain"
      >
        <Iconx size="1.55rem" icon="dots-v" />
        <VMenu
          :transition="DEFAULT_TRANSITION"
          activator="parent"
          location="bottom end"
        >
          <VList
            variant="plain"
            class="py-0"
            lines="one"
            density="comfortable"
            min-width="192"
            id="ID--clbn7is7M"
          >
            <!-- item:account -->
            <VListItem
              :to="{ name: 'nalog-index' }"
              value="Moj nalog"
              class="ps-3"
            >
              <template #prepend>
                <Iconx size="1.44rem" icon="account" />
              </template>
              <VListItemTitle class="ps-4">Moj nalog</VListItemTitle>
            </VListItem>
            <!-- item:kalendar -->
            <VListItem
              link
              :to="{ name: 'kalendar' }"
              value="Kalendar"
              class="ps-3"
            >
              <template #prepend>
                <Iconx size="1.33rem" icon="$calendar" class="opacity-50" />
              </template>
              <VListItemTitle class="!ps-[18px]">Kalendar</VListItemTitle>
            </VListItem>
            <!-- item:disk:drive -->
            <VListItem
              link
              @click="openDriveAttachmentsMain"
              value="Disk"
              class="ps-3"
            >
              <template #prepend>
                <Iconx
                  size="1.33rem"
                  icon="icons-local:storage"
                  class="opacity-50"
                />
              </template>
              <VListItemTitle class="!ps-[18px]">Disk</VListItemTitle>
            </VListItem>
            <!-- item:settings:admin -->
            <VListItem
              :to="{ name: 'config' }"
              value="Podešavanja"
              class="ps-3"
            >
              <template #prepend>
                <Iconx size="1.44rem" icon="cog" class="opacity-50" />
              </template>
              <VListItemTitle class="ps-4">Podešavanja</VListItemTitle>
            </VListItem>
            <VListItem :to="{ name: 'help' }" value="Pomoć" class="ps-3">
              <template #prepend>
                <Iconx size="1.44rem" icon="help" class="opacity-50" />
              </template>
              <VListItemTitle class="ps-4">Pomoć</VListItemTitle>
            </VListItem>
            <!-- item:about -->
            <!-- <VListItem link value="O aplikaciji" class="ps-3">
              <template #prepend>
                <Iconx size="1.25rem" icon="github" />
              </template>
              <NuxtLink
                href="https://github.com/nikolav/nuxtapp-scratch---5m5td3o50xv/tree/frikom-app"
                target="_blank"
              >
                <VListItemTitle class="ps-4">O aplikaciji</VListItemTitle>
              </NuxtLink>
            </VListItem> -->
            <!-- item:logout -->
            <VDivider opacity="100" class="mt-2" />
            <VListItem @click="auth.logout" value="Kraj" class="ps-3">
              <template #prepend>
                <Iconx size="1.25rem" icon="poweroff" class="opacity-50" />
              </template>
              <VListItemTitle class="!ps-[18px]">Kraj</VListItemTitle>
            </VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </VAppBar>
    <!-- nav primary -->
    <!-- app:links -->
    <VNavigationDrawer
      :id="ID_subnav"
      :location="smAndUp ? 'end' : 'bottom'"
      :floating="hasNavSecondary"
      :border="hasNavSecondary ? 0 : undefined"
      elevation="0"
      rail
      permanent
      :class="[
        smAndUp ? 'pt-2' : undefined,
        smAndUp ? undefined : '*:flex *:justify-evenly',
      ]"
    >
      <AppNavigationButtons />
    </VNavigationDrawer>
    <!-- nav secondary -->
    <VNavigationDrawer
      v-if="hasNavSecondary"
      :location="smAndUp ? 'end' : 'bottom'"
      :style="
        smAndUp ? undefined : `bottom: ${sidebarMainHeight}px !important;`
      "
      elevation="0"
      rail
      permanent
      :class="[
        smAndUp ? 'pt-2' : undefined,
        smAndUp ? undefined : '*:flex *:justify-evenly',
      ]"
    >
      <AppNavigationButtons :key="route.fullPath" subnav />
    </VNavigationDrawer>
    <VMain>
      <slot />
    </VMain>
    <VSpacer class="mt-32" />
  </section>
</template>
<style lang="scss" scoped></style>
<style lang="scss">
#ID--clbn7is7M .v-list-item__prepend .v-list-item__spacer {
  width: 0 !important;
}
</style>
