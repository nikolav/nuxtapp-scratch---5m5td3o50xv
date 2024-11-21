<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import {
  VFabMain,
  VCardDataIterator,
  TopicRatingStatus,
} from "@/components/app";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const {
  sites: { itemCategories: sitesItemGroups, logo: sitesLogo },
} = useCategoryAssets();
const { ratingAssets, likesAssets } = useTopics();
// ##icons
// ##refs ##flags ##models
const sitesSelected = ref();
// ##data ##auth ##state
const {
  assets: sites,
  processing,
  reload: sitesReload,
} = useQueryManageAssetsSites(undefined, true);

// ##computed
// ##forms ##handlers ##helpers
const itemLinkToSite = (item: any) => ({
  name: "aktiva-lokali-sid",
  params: { sid: item.id },
});
const fmtTitle = (s: any) => startCase(s.name);

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Lokali" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali">
    <VCardDataIterator
      v-model="sitesSelected"
      :items="sites"
      :card-props="{ disabled: processing }"
      item-title="name"
      :item-to="itemLinkToSite"
      :item-groups="sitesItemGroups"
      :reload="sitesReload"
      :props-list-item="{ class: 'ms-0 ps-2' }"
      :props-title="{ class: 'ms-2 ps-0' }"
      :props-selection="{ class: '-translate-y-px' }"
      :format-title="fmtTitle"
      :items-per-page="-1"
      hide-pagination
    >
      <template #menu> foo </template>
      <template #list-item-append="{ item: site }">
        <TopicRatingStatus
          :topic="ratingAssets(get(site, 'key'))"
          class="text-warning-darken-1"
          size="1.122rem"
        />
      </template>
      <template #list-item-title="{ item: site }">
        <span class="d-flex items-center gap-4">
          <VAvatar
            :image="sitesLogo(site)"
            size="small"
            density="comfortable"
          />
          <span>{{ fmtTitle(site) }}</span>
        </span>
      </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-lokali-nov' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
