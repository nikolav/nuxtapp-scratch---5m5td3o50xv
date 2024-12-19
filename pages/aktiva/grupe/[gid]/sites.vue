<script setup lang="ts">
// ##imports
import { renderIcon } from "@/components/icons";
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VSnackbarMain,
} from "@/components/app";
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
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();
// ##schemas
// ##utils
const {
  sites: { logo: siteLogo },
} = useCategoryAssets();
const attrs = useAttrs();
const ps = useProcessMonitor();
const { assetsConfigured } = useTopics();
// ##icons
const iconCheckOn = renderIcon("check-on", {});
const iconCheckOff = renderIcon("check-off", {});
// ##refs ##flags ##models
const g = computed(() => get(attrs, "route-data.g"));
const gid = computed(() => g.value?.id);
const toggleSitesSGConfigSuccess = useToggleFlag();
const selectionSites = ref();
// ##data ##auth ##state
// assetsList(
//   aids           : [ID!],
//   type           : String,
//   own            : Boolean,
//   aids_subs_only : [ID!],
//   aids_subs_type : String):
// [Asset!]!
//
// *sites parent to this user's groups
const {
  assets: sites,
  length: sizeSitesOnly,
  reload,
  sitesSGConfig,
} = useQueryManageAssetsSites(
  // --all-assets-IDs
  undefined,
  // --sites-managed-OWN
  undefined,
  // --graphql-options-None
  undefined,
  // --vars-additional
  () => ({
    // --this-group's-parent-assets:sites
    aids_subs_only: gid.value ? [gid.value] : undefined,
    // --this-group
    aids_subs_type: PEOPLE_GROUP_TEAM,
  })
);
// ##computed
const configurationSGUnassign = computed(() =>
  isEmpty(selectionSites.value)
    ? undefined
    : {
        [`${map(selectionSites.value, (s: IAsset) => `-${s.id}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
);
// ##forms ##handlers ##helpers
const itemTitle = (node: IAsset) => node.name;
const itemTo = (node: IAsset) => ({
  name: "aktiva-lokali-sid",
  params: { sid: node.id },
});
const selectionSitesDeselectAll = () => {
  selectionSites.value = undefined;
};
const sgConfigureUnassign = async () => {
  const sg = configurationSGUnassign.value;
  if (isEmpty(sg)) return;
  try {
    ps.begin();
    if (get(await sitesSGConfig(sg), "data.assetsAGConfig.error"))
      throw "sitesSGConfig:unassign:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      toggleSitesSGConfigSuccess.on();
      selectionSitesDeselectAll();
    });
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "🏪 Lokali grupe" });
// ##provide
// ##io
watchEffect(() => useIOEvent(() => assetsConfigured(gid.value), reload));

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-sites">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleSitesSGConfigSuccess.isActive.value"
    >
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarMain>
    <VToolbarSecondary text="🏪 Lokali">
      <template #title="{ text: text_ }">
        <VBadge
          :model-value="0 < sizeSitesOnly"
          color="primary-darken-1"
          :content="sizeSitesOnly"
          inline
          location="end"
        >
          <span class="pe-1">{{ text_ }}</span>
        </VBadge>
      </template>
      <template #actions>
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-lokali', params: { gid } }"
          icon
          variant="text"
        >
          <Iconx icon="$plus" />
        </VBtn>
        <VBtn
          @click="sgConfigureUnassign"
          :disabled="isEmpty(selectionSites)"
          icon
          variant="text"
        >
          <Iconx icon="$minus" />
        </VBtn>
        <VBtn @click="reload" icon variant="plain">
          <Iconx size="1.122rem" icon="$loading" />
        </VBtn>
      </template>
    </VToolbarSecondary>
    <VSpacer class="mt-3" />
    <VDataIteratorListData
      v-model="selectionSites"
      :items="sites"
      :item-title="itemTitle"
      :item-to="itemTo"
      :props-list="{ class: 'py-0' }"
      :props-list-item="{ class: 'mt-2' }"
      :props-list-item-title="{ class: 'ps-2' }"
      disabled-skeleton-loader
    >
      <template #list-item-prepend="{ item: site }">
        <VAvatar :image="siteLogo(site) || DEFAULT_NO_IMAGE_AVAILABLE" />
      </template>
      <template #list-item-append="{ isSelected, toggleSelect }">
        <VCheckboxBtn
          :model-value="isSelected"
          @click.stop="toggleSelect(node)"
          :false-icon="iconCheckOff"
          :true-icon="iconCheckOn"
          density="comfortable"
          color="primary"
          class="scale-[112%]"
        />
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
