<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { FIELDS_ASSETS_SITES as FIELDS } from "@/config/forms";
import type { IAsset } from "@/types";
import {
  VBtnSave,
  VBtnReset,
  VSnackbarSuccess,
  VRatingTopicRating,
  VBtnGroupTopicLikeDislike,
  ProvideAssetsChildren,
  VSheetHeaderBodyFooter,
  VChipAssetAvatar,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const attrs = useAttrs();
const {
  app: { DEFAULT_TRANSITION },
  db: {
    Assets: {
      type: { PEOPLE_GROUP_TEAM },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const site = computed(() => get(attrs, "route-data.site"));
const sid = computed(() => site.value?.id);
const skey = computed(() => site.value?.key);
const { categoryTagByAsset, matchTag } = useCategoryAssets();
FIELDS.category.pull = (s: IAsset) => matchTag(categoryTagByAsset(s));

const ps = useProcessMonitor();
const toggleAssetsSitesUpdateSuccess = useToggleFlag();
const { ratingAssets, likesAssets } = useTopics();
// ##icons
// ##refs ##flags ##models
const ref_PrE6tR70yHDYQxBe1s = ref();
// ##data ##auth ##state
const enabled = computed(() => !!sid.value);
const { commit } = useQueryManageAssetsSites(() => [sid.value], false, {
  enabled,
});
// ##computed
const sname = computed(() => startCase(site.value?.name || ""));
const { width: W_fields } = useElementSize(ref_PrE6tR70yHDYQxBe1s);
const topicRatingSites = computed(() => ratingAssets(skey.value));
const topicLikesSites = computed(() => likesAssets(skey.value));
// ##forms ##handlers ##helpers
const {
  sites: { categories_select_menu },
} = useCategoryAssets();
const form = useFormModel(
  "useFormModel:52001b4f-2135-5a13-8dbe-05783f190fa3",
  FIELDS,
  {
    model: site,
    onSubmit: async () => {
      if (!form.isDirty.value) return;
      if (!sid.value) return;
      try {
        ps.begin();
        if (
          get(
            await commit(form.diff.value, sid.value),
            "data.assetsUpsert.error"
          )
        )
          throw "sites:update:failed";
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value) ps.successful(toggleAssetsSitesUpdateSuccess.on);
    },
  }
);
const itemTo = (g: IAsset) => ({
  name: "aktiva-grupe-gid",
  params: { gid: g.id },
});
// ##watch
// ##hooks ##lifecycle
useOnceMountedOn(site, form.reset);
// ##head ##meta
useHead({ title: sname });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid-index">
    <VSnackbarSuccess v-model="toggleAssetsSitesUpdateSuccess.isActive.value">
      <p>Lokal je uspešno ažuriran.</p>
    </VSnackbarSuccess>
    <!-- @@social -->
    <div class="__spacer pt-3 pe-1 d-flex items-center justify-between">
      <VRatingTopicRating :topic="topicRatingSites" small />
      <VBtnGroupTopicLikeDislike :topic="topicLikesSites" light />
    </div>
    <!-- @@chips:groups -->
    <VSheetHeaderBodyFooter elevation="0" rounded="0" class="pa-2">
      <template #body>
        <ProvideAssetsChildren
          :asset="site"
          :type="PEOPLE_GROUP_TEAM"
          v-slot="{ assets: groups }"
        >
          <VCardText
            v-if="!isEmpty(groups)"
            class="__spacer px-0 ps-1 d-flex items-center flex-wrap gap-2"
          >
            <VChipAssetAvatar
              v-for="g in groups"
              :key="g.key"
              :asset="g"
              :item-to="itemTo(g)"
            />
          </VCardText>
        </ProvideAssetsChildren>
      </template>
    </VSheetHeaderBodyFooter>
    <VSpacer class="mt-3" />
    <VForm @submit.prevent="form.submit" autocomplete="off">
      <VCard variant="text" rounded="0">
        <VCardText>
          <div class="__spacer space-y-4" ref="ref_PrE6tR70yHDYQxBe1s">
            <template v-for="(item, field) in FIELDS" :key="field">
              <VTextField
                v-if="!item.type"
                v-model="form.data[field].value"
                :label="item.label"
                variant="underlined"
                clearable
                v-bind="item.props"
              >
                <template #label="{ label }">
                  <span>{{ label }}</span>
                  <span v-if="item.required" class="text-error"> *</span>
                </template>
                <template #prepend-inner>
                  <Iconx
                    :icon="item.icon?.name"
                    :size="item.icon?.size"
                    v-bind="item.icon?.props"
                  />
                </template>
              </VTextField>
              <VTextarea
                v-if="'textarea' == item.type"
                v-model="form.data[field].value"
                :label="item.label"
                variant="underlined"
                clearable
                v-bind="item.props"
              >
                <template #prepend-inner>
                  <Iconx
                    :icon="item.icon?.name"
                    :size="item.icon?.size"
                    v-bind="item.icon?.props"
                  /> </template
              ></VTextarea>
              <VSelect
                v-if="'select' == item.type"
                v-model="form.data[field].value"
                :label="item.label"
                :items="categories_select_menu"
                variant="solo"
                rounded="pill"
                :menu-props="{
                  location: 'center',
                  transition: DEFAULT_TRANSITION,
                }"
                :list-props="{ width: W_fields, class: 'py-0' }"
                class="mt-6"
              >
                <template #label="{ label }">
                  <Iconx
                    :icon="item.icon?.name"
                    :size="item.icon?.size"
                    v-bind="item.icon?.props"
                  />
                  <span>{{ label }}</span>
                  <span v-if="item.required" class="text-error"> *</span>
                </template>
                <template #prepend-inner>
                  <span class="__spacer ms-2" />
                </template>
              </VSelect>
            </template>
            <VSpacer class="mt-7" />
            <VTextField
              disabled
              readonly
              variant="plain"
              :model-value="skey"
              label="Ključ"
            >
              <template #prepend-inner>
                <Iconx
                  icon="hashtag"
                  size="1rem"
                  class="opacity-50 translate-y-[.122rem] me-[.22rem]"
                />
              </template>
            </VTextField>
          </div>
        </VCardText>
        <VCardActions class="justify-around mt-3 mb-12">
          <VBtnReset @click="form.reset" />
          <VBtnSave :disabled="!enabled || !form.isDirty.value" type="submit" />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
