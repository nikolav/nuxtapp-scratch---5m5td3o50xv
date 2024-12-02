<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  // VBtnGroupTopicLikeDislike,
  VCardTitleSectionStart,
  ProvideAssetsChildren,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  db: {
    Assets: {
      type: { PEOPLE_GROUP_TEAM },
    },
  },
} = useAppConfig();

const attrs = useAttrs();
const form = computed(() => get(attrs, "route-data.form"));
// ##schemas
// ##utils
const { ICONS_ASSETS_FORMS_type } = useIconsConfig();
// const { likesAssets } = useTopics();
const { calcDisplayName } = useAuthUtils();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const authorDisplayName = computed(() =>
  calcDisplayName(get(form.value, "author", ""))
);
// const topicLikesAssetsForm_ = computed(() => likesAssets(form.value?.id));
const fields = computed(() => get(form.value, "data.fields"));
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📝 Obrasci" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-obrasci-fid-index">
    <VToolbarPrimary
      route-back-name="aktiva-obrasci"
      :text="form?.name"
      :props-title="{ class: 'text-body-1 text-start font-italic' }"
    >
      <template #title="{ text }">
        <span>{{ startCase(text) }}</span>
      </template>
      <template #prepend>
        <Iconx
          icon="$iconAppCogFill"
          size="1.122rem"
          class="opacity-20 mx-1 translate-x-[2px]"
        />
      </template>
    </VToolbarPrimary>

    <VCardText class="__spacer pa-5 space-y-12">
      <div class="__spacer d-flex items-center justify-between">
        <VChip
          v-if="authorDisplayName"
          :to="{ name: 'tim-uid', params: { uid: form.author.id } }"
          color="primary"
          variant="tonal"
          elevation="1"
        >
          <span class="d-flex items-center gap-1">
            <strong>🤴🏻</strong>
            <span>{{ authorDisplayName }}</span>
          </span>
          <VTooltip text="Autor" />
        </VChip>
        <!-- <VBtnGroupTopicLikeDislike light :topic="topicLikesAssetsForm_" /> -->
      </div>
      <div class="__spacer d-flex items-center gap-2">
        <ProvideAssetsChildren
          :asset="form"
          :type="PEOPLE_GROUP_TEAM"
          v-slot="{ assets: groups }"
        >
          <VChip
            v-for="g in groups"
            :key="g.key"
            :text="startCase(g.name)"
            color="info"
            elevation="1"
            size="small"
            :to="{ name: 'aktiva-grupe-gid', params: { gid: g.id } }"
          />
        </ProvideAssetsChildren>
      </div>
      <VTextField
        :model-value="form?.name"
        label="Naziv upitnika"
        readonly
        variant="underlined"
        hide-details
      >
        <template #prepend-inner>
          <Iconx
            icon="tag"
            size="1rem"
            class="me-1 opacity-20 translate-y-[2px]"
          />
        </template>
      </VTextField>
      <VTextarea
        v-if="form?.notes"
        :model-value="form?.notes"
        label="Opis"
        readonly
        variant="underlined"
        rows="3"
        hide-details
      >
        <template #prepend-inner>
          <Iconx
            icon="$info"
            size="1.122rem"
            class="me-1 opacity-20 translate-y-[2px]"
          />
        </template>
      </VTextarea>
      <VSheet v-if="!isEmpty(fields)" class="__spacer pa-1">
        <VCardTitleSectionStart
          class="pa-0 ma-0 text-body-1 text-medium-emphasis font-italic"
          title="Pitanja:"
        />
        <VList id="ID--cp6R6ZxHf" density="comfortable" class="opacity-85">
          <VListItem v-for="(node, i) in fields" :key="node.key" class="ps-1">
            <template #prepend>
              <VBadge :content="1 + i" inline class="opacity-50" />
              <Iconx v-bind="ICONS_ASSETS_FORMS_type[node.type]" />
            </template>
            <VListItemTitle class="*ms-4">
              {{ node.data.question }}
            </VListItemTitle>
          </VListItem>
        </VList>
      </VSheet>
      <VTextField
        :model-value="form?.key"
        label="Ključ"
        disabled
        readonly
        variant="underlined"
        hide-details
        density="compact"
      >
        <template #prepend-inner>
          <Iconx
            icon="hashtag"
            size="1rem"
            class="me-1 opacity-20 translate-y-[2px]"
          />
        </template>
      </VTextField>
    </VCardText>
    <VSpacer class="mt-16" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--cp6R6ZxHf .v-list-item__prepend .v-list-item__spacer {
  width: 1.22rem !important;
}
</style>
