<script setup lang="ts">
// ##imports
import type { IAssetsAttachments } from "@/types";
import { Dump } from "@/components/dev";
import { VToolbarPrimary } from "@/components/app";

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
const wopenDataUrl = useWindowOpenDataUrl();
// ##icons
// ##refs ##flags ##models
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name);
const attachments = ref<IAssetsAttachments[]>();

// ##data ##auth ##state
const {
  files: ccFiles,
  size: ccSize,
  commit,
  keys: cckeys,
  remove: ccremove,
  attachmentMake,
} = useCacheRedisAssetsAttachments(gid);

// ##computed
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));

// ##forms ##handlers ##helpers
const item_ = (key: any) => ccFiles.value[key];
const previewDataUrl = (key: any) => {
  const item = item_(key);
  return wopenDataUrl(item.dataurl, item.type);
};

// ##watch
watch(attachments, async (attachments) => {
  await commit(
    transform(
      attachments,
      (res: any, node: IAssetsAttachments) => {
        res[node.key] = node;
      },
      <any>{}
    )
  );
});

// ##hooks ##lifecycle
onChangeAttachments(async (files) => {
  if (!isEmpty(files)) {
    attachments.value = await Promise.all(map(files, attachmentMake));
  }
});

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
        elevation="1"
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
          <VBtn @click="openAttachmentsAdd()" size="small" icon variant="text">
            <Iconx size="1.33rem" icon="upload" />
          </VBtn>
        </template>
      </VToolbarPrimary>
    </div>
    <VDataIterator :items="cckeys" :items-per-page="-1">
      <template #default="{ items }">
        <VList
          density="comfortable"
          v-if="!isEmpty(cckeys)"
          class="__spacer px-2"
        >
          <VListItem
            v-for="(item, i) in items"
            :key="item.raw"
            link
            target="_blank"
            @click.stop="previewDataUrl(item.raw)"
          >
            <template #append>
              <VBtn
                icon
                variant="plain"
                size="small"
                color="error"
                @click.stop="ccremove(item.raw)"
              >
                <Iconx size="1.22rem" icon="trash" />
              </VBtn>
            </template>
            <VListItemTitle>
              <span> {{ i + 1 }}&rpar; {{ item_(item.raw)?.name }} </span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </template>
    </VDataIterator>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
