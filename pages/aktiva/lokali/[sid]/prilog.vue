<script setup lang="ts">
// ##imports
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VEmptyStateNoData,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const attrs = useAttrs();
const site = computed(() => get(attrs, "route-data.site"));
const sid = computed(() => site.value?.id);
const skey = computed(() => site.value?.key);
// ##schemas
// ##utils
const { open, onChange } = useFileDialog({ multiple: true });
const { assetsAttachmentsFolder } = useTopics();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { attachments, size, uploadAll, rm, reload } =
  useFirebaseStorageAttachments({
    ID: skey,
    KEY: assetsAttachmentsFolder,
  });
// ##computed
// ##forms ##handlers ##helpers
const itemTitle = (url: string, i: number) => `${i + 1}) ${urlFilename(url)}`;
const attachmentDrop = async (url: any) => {
  if (!url) return;
  try {
    ps.begin();
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
  let res: any;
  try {
    ps.begin();
    if (isEmpty(await uploadAll(Array.from(files!))))
      throw "assets:attachments:upload:failed";
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
  <section class="page--aktiva-lokali-sid-prilog">
    <VToolbarSecondary
      text="Prilog"
      :props-title="{ class: 'ms-0 ps-2 text-start font-italic' }"
      color="surface"
    >
      <template #title="{ text }">
        <VBadge
          :model-value="0 < size"
          :content="size"
          inline
          color="primary-darken-1"
        >
          <span class="pe-1">{{ text }}</span>
        </VBadge>
      </template>
      <template #actions>
        <VBtn color="primary-darken-1" @click="open()" icon variant="text">
          <Iconx icon="upload" size="1.44rem" />
        </VBtn>
        <VBtn
          color="primary-darken-1"
          @click="reload"
          icon
          variant="plain"
          density="comfortable"
        >
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
    </VToolbarSecondary>
    <VEmptyStateNoData v-if="isEmpty(attachments)" class="opacity-40" />
    <template v-else>
      <VSpacer class="mt-3" />
      <VDataIteratorListData
        :items="attachments"
        :item-url="identity"
        external
        :item-title="itemTitle"
        :show-select="false"
        disabled-skeleton-loader
        :props-list="{ density: 'compact', class: 'py-0' }"
      >
        <template #list-item-append="{ item: url_ }">
          <VBtn
            @click.stop="attachmentDrop(url_)"
            icon
            density="comfortable"
            color="error"
            variant="plain"
          >
            <Iconx size="1.122rem" icon="trash" />
          </VBtn>
        </template>
      </VDataIteratorListData>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
