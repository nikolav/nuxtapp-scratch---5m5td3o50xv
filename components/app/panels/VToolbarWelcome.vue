<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VBtnDotsMenuList,
  VSnackbarSuccess,
} from "@/components/app";
// ##config:const
// ##config ##props
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
  <section>
    <VSnackbarSuccess v-model="toggleUploadSuccess.isActive.value">
      <p>👍🏻&nbsp; Prilog je uspešno sačuvan.</p>
    </VSnackbarSuccess>
    <VToolbarPrimary
      elevation="1"
      color="transparent"
      class="component--VToolbarWelcome position-fixed top-0 inset-x-0 !z-[122] ps-1 backdrop-blur-md"
      :divider-start="false"
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
          <a class="link--prominent"><small> admin@nikolav.rs </small></a>
        </NuxtLink>
      </template>
      <template #append>
        <VBtnDotsMenuList :props-list="{ class: 'py-0' }">
          <template #list-items>
            <VListItem @click="open()" id="ID--Zq0wYdLyo5Oq" link>
              <template #prepend>
                <Iconx icon="$file" />
              </template>
              <VListItemTitle class="ms-0 ps-0">Prilog</VListItemTitle>
            </VListItem>
            <VListItem disabled link>
              <template #prepend>
                <Iconx icon="$close" />
              </template>
              <VListItemTitle>Zatvori</VListItemTitle>
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
#ID--Zq0wYdLyo5Oq .v-list-item__prepend .v-list-item__spacer {
  // width: 1rem !important;
}
</style>
