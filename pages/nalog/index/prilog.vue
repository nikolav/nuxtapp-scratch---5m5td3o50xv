<script setup lang="ts">
// ##imports
import { VToolbarPrimary, VDataIteratorListData } from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const attrs = useAttrs();
const { open: accountAttachmentsOpen, onChange: attachmentsOnChange } =
  useFileDialog({ multiple: true });
const { accountAttachments } = useTopics();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const attachmentsCommit = ref();
// ##data ##auth ##state
const auth = useStoreApiAuth();
const {
  attachments: files$,
  uploadAll,
  reload,
  rm,
} = useFirebaseStorageAttachments({
  ID: () => auth.uid,
  KEY: accountAttachments,
});
// ##computed
const displayName$ = computed(() => get(attrs, "route-data.displayName"));
// ##forms ##handlers ##helpers
attachmentsOnChange((files) => {
  attachmentsCommit.value = Array.from(files || []);
});
const itemTitle = (url: any, i: number) => `${i + 1}) ${urlFilename(url)}`;
const itemUrl = identity;
const attachmentRemove = async (url?: any) => {
  if (url) {
    try {
      ps.begin();
      await rm(urlFilename(url));
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value) ps.successful(reload);
  }
};
// ##watch
watch(attachmentsCommit, async (attachments: File[]) => {
  let res: any;
  if (!isEmpty(attachments)) {
    try {
      ps.begin();
      res = await uploadAll(attachments);
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value && !isEmpty(res)) ps.successful(reload);
  }
});
// ##hooks ##lifecycle
onMounted(() => {
  nextTick(reload);
});
// ##head ##meta
useHead({ title: () => `Prilog | ${displayName$.value}` });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--nalog-prilog">
    <div class="__spacer ma-1">
      <VToolbarPrimary
        color="primary-lighten-1"
        text="Prilog"
        rounded="pill"
        :props-title="{ class: 'text-body-1 font-italic' }"
        :divider-start="false"
        route-back-name="nalog-index"
      >
        <template #prepend>
          <VBtn
            :to="{ name: 'nalog-index' }"
            icon
            density="comfortable"
            variant="plain"
          >
            <Iconx size="1.55rem" icon="$prev" />
          </VBtn>
        </template>
        <template #actions>
          <VBtn icon @click="accountAttachmentsOpen()">
            <Iconx icon="upload" size="1.33rem" />
          </VBtn>
          <VBtn icon @click="reload" size="small" variant="plain">
            <Iconx icon="$loading" size="1.122rem" />
          </VBtn>
        </template>
      </VToolbarPrimary>
    </div>

    <!-- attachments:list -->
    <VDataIteratorListData
      :item-title="itemTitle"
      :item-url="itemUrl"
      :show-select="false"
      :items="files$"
      external
      disabled-skeleton-loader
      :props-list="{ class: 'ms-2 py-0 mt-1', density: 'compact' }"
    >
      <template #list-item-append="{ item: url_ }">
        <VBtn
          @click.stop="attachmentRemove(url_)"
          icon
          color="error"
          variant="plain"
          density="comfortable"
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
