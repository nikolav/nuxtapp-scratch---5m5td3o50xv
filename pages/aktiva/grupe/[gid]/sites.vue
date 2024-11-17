<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VDataIteratorListData,
  VSnackbarSuccess,
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
} = useAppConfig();
// ##schemas
// ##utils
const attrs = useAttrs();
const ps = useProcessMonitor();
const { assetsConfigured } = useTopics();
// ##icons
// ##refs ##flags ##models
const routeData = computed(() => get(attrs, "route-data"));
const toggleSitesSGConfigSuccess = useToggleFlag();
// const g = computed(() => get(routeData.value, "g"));
const gid = computed(() => get(routeData.value, "gid"));
// const gname = computed(() => get(routeData.value, "gname"));
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
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));
const noSelection = computed(() => isEmpty(selectionSites.value));
const configurationSGUnassign = computed(() =>
  noSelection.value
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
    if (get(await sitesSGConfig(sg), "data.sitesSGConfig.error"))
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
    <VSnackbarSuccess v-model="toggleSitesSGConfigSuccess.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>
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
          <VBtn
            :to="{ name: 'aktiva-grupe-gid-lokali', params: { gid } }"
            icon
            variant="text"
          >
            <Iconx icon="$plus" />
            <VTooltip text="Pridruži nov lokal" />
          </VBtn>
          <VBtn
            @click="sgConfigureUnassign"
            :disabled="noSelection"
            icon
            variant="text"
          >
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
