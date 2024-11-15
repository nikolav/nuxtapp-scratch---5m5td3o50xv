<script setup lang="ts">
// ##imports
import { VToolbarPrimary, VDataIteratorListData } from "@/components/app";
import { Dump } from "@/components/dev";
import type { IAsset } from "@/types";
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
// ##schemas
// ##utils
const attrs = useAttrs();
// ##icons
// ##refs ##flags ##models
const routeData = computed(() => get(attrs, "route-data"));
const g = computed(() => get(routeData.value, "g"));
const gid = computed(() => get(routeData.value, "gid"));
const gname = computed(() => get(routeData.value, "gname"));
const selectionSites = ref();
// ##data ##auth ##state
// assetsList(
//   aids           : [ID!],
//   type           : String,
//   own            : Boolean,
//   aids_subs_only : [ID!],
//   aids_subs_type : String):
// [Asset!]!
const {
  assets: sites,
  length: sizeSitesOnly,
  reload,
} = useQueryManageAssetsSites(
  // --all-assets-IDs
  undefined,
  // --sites-managed-OWN
  undefined,
  // --graphql-options-None
  undefined,
  // --vars-additional
  () => ({
    aids_subs_only: gid.value ? [gid.value] : undefined,
    aids_subs_type: PEOPLE_GROUP_TEAM,
  })
);
// ##computed
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));
const noSelection = computed(() => isEmpty(selectionSites.value));
// ##forms ##handlers ##helpers
const itemTitle = (node: IAsset) => node.name;
const itemTo = (node: IAsset) => ({
  name: "aktiva-lokali-sid",
  params: { sid: node.id },
});
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "🏪 Lokali grupe" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-sites">
    <div class="__spacer mt-1 mx-2">
      <VToolbarPrimary
        text="Lokali"
        color="primary-lighten-1"
        rounded="pill"
        :route-back-to="routeBackTo"
        :props-title="{ class: 'text-body-1 text-start ms-3' }"
        :divider-start="false"
      >
        <template #title="{ text: text_ }">
          <span class="d-inline-flex items-center gap-4 pt-1">
            <Iconx size="1.122rem" icon="storefront" class="opacity-40" />

            <VBadge
              :model-value="0 < sizeSitesOnly"
              color="primary-darken-1"
              :content="sizeSitesOnly"
              inline
              location="end"
            >
              <span class="pe-1">{{ text_ }}</span>
            </VBadge>
          </span>
        </template>
        <template #prepend>
          <VBtn :to="routeBackTo" density="comfortable" icon variant="plain">
            <Iconx size="1.55rem" icon="$prev" />
          </VBtn>
        </template>
        <template #actions>
          <VBtn icon variant="text">
            <Iconx icon="$plus" />
            <VTooltip text="Pridruži nov lokal" />
          </VBtn>
          <VBtn :disabled="noSelection" icon variant="text">
            <Iconx icon="$minus" />
            <VTooltip text="Izbaci lokale" />
          </VBtn>
          <VBtn @click="reload" icon density="comfortable" variant="plain">
            <Iconx size="1.122rem" icon="$loading" />
          </VBtn>
        </template>
      </VToolbarPrimary>
    </div>
    <div class="__spacer">
      <VDataIteratorListData
        v-model="selectionSites"
        :items="sites"
        :item-title="itemTitle"
        :item-to="itemTo"
        :props-list="{ density: 'compact', class: 'py-0 pt-1' }"
        :props-list-item-title="{ class: 'ms-2' }"
        disabled-skeleton-loader
      />
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
