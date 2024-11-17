<script setup lang="ts">
// ##imports
import { VToolbarSecondary, VDataIteratorListData } from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const channel = computed(() => get(attrs, "route-data.channel"));
const cid = computed(() => channel.value?.id);
const ckey = computed(() => channel.value?.key);

// ##schemas
// ##utils
const { assetsAttachmentsFolder } = useTopics();
const { open, onChange } = useFileDialog({ multiple: true });
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { attachments, uploadAll, reload, size, rm } =
  useFirebaseStorageAttachments({
    ID: ckey,
    KEY: assetsAttachmentsFolder,
  });
// ##computed
// ##forms ##handlers ##helpers
const itemTitle = (url: string, i: number) => `${i + 1}) ${urlFilename(url)}`;
const attachmentDrop = async (url: any) => {
  try {
    if (!url) throw "fbsUpload:channelAttachements:failed";
    await rm(urlFilename(url));
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(reload);
};
// ##watch
// ##hooks ##lifecycle
onChange(async (files) => {
  if (isEmpty(files)) return;
  try {
    ps.begin();
    if (isEmpty(await uploadAll(Array.from(files!))))
      throw "attachments:upload:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(reload);
});
onMounted(() => nextTick(reload));
// ##head ##meta
useHead({ title: "Prilog" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza-cid-prilog">
    <VToolbarSecondary
      :route-back-to="{ name: 'veza-cid', params: { cid } }"
      text="Prilog"
      :props-title="{ class: 'text-start text-body-1 font-italic' }"
      :props-actions="{ class: 'pe-1' }"
    >
      <template #title="{ text }">
        <VBadge
          :model-value="0 < size"
          :content="size"
          color="primary-darken-1"
          location="end"
          inline
        >
          <span class="me-1">{{ text }}</span>
        </VBadge>
      </template>
      <template #actions>
        <VBtn @click="open()" icon variant="text">
          <Iconx icon="upload" size="1.5rem" />
        </VBtn>
        <VBtn @click="reload" icon density="comfortable" variant="plain">
          <Iconx icon="$loading" size="small" />
        </VBtn>
      </template>
    </VToolbarSecondary>
    <VDataIteratorListData
      :items="attachments"
      :item-title="itemTitle"
      :item-url="identity"
      external
      :show-select="false"
      disabled-skeleton-loader
      :props-list="{ density: 'compact', class: 'py-0' }"
    >
      <template #list-item-append="{ item: url_ }">
        <VBtn
          @click.stop="attachmentDrop(url_)"
          icon
          variant="plain"
          density="comfortable"
          color="error"
        >
          <Iconx icon="trash" size="1.122rem" />
        </VBtn>
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
