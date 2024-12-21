<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VBtnDotsMenuList,
  VSnackbarMain,
} from "@/components/app";
// ##config:const
const {
  links: {
    external: { URL_DRIVE_PUBLIC },
  },
} = useAppConfig();
// ##config ##props
defineOptions({ inheritAttrs: false });

const { ADMIN_UID } = useAppConfig();
// ##schemas
// ##utils
const { open, onChange } = useFileDialog({ multiple: true });
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const toggleUploadSuccess = useToggleFlag();
// ##data ##auth ##state
const { uploadAll } = useFirebaseStorageAttachments({
  ID: "/dev/media/prilog@frikom:app",
  KEY: identity,
});
const { notificationSend } = useMessagingNotification();
// ##computed
// ##forms ##handlers ##helpers
const openDriveExternal = async () =>
  await navigateTo(URL_DRIVE_PUBLIC, { open: { target: "_blank" } });
// ##watch
// ##hooks ##lifecycle
onChange(async (files) => {
  try {
    ps.begin(toggleUploadSuccess.off);
    if (isEmpty(files)) throw "fbsUpload:prilog:failed";
    if (isEmpty(await uploadAll(Array.from(files!))))
      throw "fbsUpload:prilog:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(async () => {
      toggleUploadSuccess.on();
      await notificationSend([ADMIN_UID], {
        title: "fbsUpload:prilog@frikom:app",
        body: "Materijal dodat u priloge.",
      });
    });
});
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="component--VToolbarWelcome">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleUploadSuccess.isActive.value"
    >
      <p>👍🏻&nbsp; Prilog je uspešno sačuvan.</p>
    </VSnackbarMain>
    <VToolbarPrimary
      elevation="1"
      color="transparent"
      :divider-start="false"
      class="position-fixed top-0 inset-x-0 !z-[122] ps-1 backdrop-blur-md"
      v-bind="$attrs"
    >
      <template #prepend>
        <NuxtLink
          href="mailto:admin@nikolav.rs"
          class="d-flex items-center gap-1 text-primary-darken-2"
        >
          <Iconx
            icon="envelope"
            size="1rem"
            class="translate-y-[2px] opacity-30"
          />
          <a class="link--prominent"><small> admin </small></a>
        </NuxtLink>
      </template>
      <template #append>
        <VBtnDotsMenuList
          :props-list="{ class: 'py-0', id: 'ID--tcSynK2eT1zhkFdg' }"
        >
          <template #list-items>
            <VListItem link @click="openDriveExternal">
              <template #prepend>
                <Iconx
                  icon="icons-local:storage"
                  size="1.22rem"
                  class="translate-x-1 opacity-75"
                />
              </template>
              <VListItemTitle class="*ms-0 !ps-[10px]">Disk</VListItemTitle>
            </VListItem>
            <VListItem @click="open()" link>
              <template #prepend>
                <Iconx icon="$file" />
              </template>
              <VListItemTitle class="*ms-0 ps-1">Prilog</VListItemTitle>
            </VListItem>
          </template>
        </VBtnDotsMenuList>
      </template>
    </VToolbarPrimary>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--tcSynK2eT1zhkFdg .v-list-item__prepend .v-list-item__spacer {
  width: 1.22rem !important;
}
</style>
