<script setup lang="ts">
// ##imports
import { VToolbarPrimary, VDataIteratorListData } from "@/components/app";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##utils
const attrs = useAttrs();
const { open: openAttachmentsAdd, onChange: onChangeAttachments } =
  useFileDialog({ multiple: true });
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name);
const attachments = ref<File[]>();

// ##data ##auth ##state
const {
  images,
  uploadCollection: fbsUploadCollection,
  reload,
  rm,
} = useFirebaseStorageAssetImages(gid);

// ##computed
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));

// ##forms ##handlers ##helpers
const itemTitle = (url: string, i: number) => `${i + 1}) ${urlFilename(url)}`;
const fileDrop = async (url: string) => {
  try {
    ps.begin();
    await rm(urlFilename(url));
  } catch (error) {
    ps.setError(error);
    // pass
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(reload);
};
// ##watch
watch(attachments, async (attachments) => {
  if (isEmpty(attachments)) return;
  let res;
  try {
    ps.begin();
    res = await fbsUploadCollection(attachments);
  } catch (error) {
    ps.setError(error);
    // pass
  } finally {
    ps.done();
  }
  if (!ps.error.value && !isEmpty(res)) ps.successful(reload);
});

// ##hooks ##lifecycle
onChangeAttachments(async (files) => {
  attachments.value = Array.from(files || []);
});
onMounted(reload);

// ##head ##meta
useHead({ title: `Prilog | ${gname.value}` });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-prilog">
    <div class="__spacer pt-1 px-2">
      <VToolbarPrimary
        text="Prilog"
        rounded="pill"
        color="primary-lighten-1"
        :route-back-to="routeBackTo"
        :props-title="{ class: 'text-body-1 text-start' }"
        :divider-start="false"
      >
        <template #title="{ text }">
          <span class="d-inline-flex items-center gap-x-3 translate-y-[3px]">
            <Iconx class="opacity-50" size="1.22rem" icon="$file" />
            <span>{{ text }}</span>
            <VBadge
              v-if="0 < ccSize"
              color="primary-darken-1"
              inline
              :content="ccSize"
              class="d-inline ms-n1"
            />
          </span>
        </template>
        <template #prepend>
          <VBtn
            :to="routeBackTo"
            icon
            variant="plain"
            size="small"
            density="comfortable"
          >
            <Iconx size="1.5rem" icon="$prev" />
          </VBtn>
        </template>
        <template #actions>
          <VBtn @click="openAttachmentsAdd()" icon variant="text">
            <Iconx size="1.33rem" icon="upload" />
          </VBtn>
          <VBtn @click="reload" size="small" icon variant="plain">
            <Iconx size="1.122rem" icon="$loading" />
          </VBtn>
        </template>
      </VToolbarPrimary>
    </div>
    <VDataIteratorListData
      :show-select="false"
      :items="images"
      :item-title="itemTitle"
      :item-url="identity"
      external
      disabled-skeleton-loader
    >
      <template #list-item-append="{ item: url_ }">
        <VBtn
          @click.stop="fileDrop(url_)"
          color="error"
          icon
          variant="plain"
          size="small"
        >
          <Iconx size="1.122rem" icon="trash" />
        </VBtn>
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
