<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { VToolbarSecondary, VDataIteratorListData } from "@/components/app";
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
const attrs = useAttrs();
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => routeData.value?.gid);
const gname = computed(() => routeData.value?.gname);

// ##schemas
// ##utils
const { assetsConfigured } = useTopics();
// ##icons
// ##refs ##flags ##models
const chSelection = ref();
const ps = useProcessMonitor();
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
  assets: channels,
  length: sizeChannelsOnly,
  reload,
  channelsCGConfig,
} = useQueryManageAssetsComms(
  // --all-assets-IDs
  undefined,
  // --sites-managed-OWN
  undefined,
  // --graphql-options-None
  undefined,
  // --vars-additional
  () => ({
    // --this-group's-parent-assets:channels
    aids_subs_only: gid.value ? [gid.value] : undefined,
    // --this-group
    aids_subs_type: PEOPLE_GROUP_TEAM,
  })
);

// ##computed
const noSelectionCH = computed(() => isEmpty(chSelection.value));
const configurationCGUnassign = computed(() =>
  gid.value && !noSelectionCH.value
    ? {
        [`${map(chSelection.value, (c: IAsset) => `-${c.id}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
    : undefined
);
// ##forms ##handlers ##helpers
const itemTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));
const itemTitle = (c: IAsset) => startCase(c.name);
const itemToCH = (c: IAsset) => ({ name: "veza-cid", params: { cid: c.id } });
const clearCHSelection = () => {
  chSelection.value = undefined;
};
const cgConfigureUnassign = async () => {
  const cg = configurationCGUnassign.value;
  if (isEmpty(cg)) return;
  try {
    if (get(await channelsCGConfig(cg), "data.channelsCGConfig.error"))
      throw "channelsCGConfig:unassign:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      nextTick(clearCHSelection);
    });
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Kanali" });
// ##provide
// ##io
watchEffect(() => useIOEvent(() => assetsConfigured(gid.value), reload));

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-kanal">
    <VToolbarSecondary
      :route-back-to="itemTo"
      text="Kanali"
      :props-title="{ class: 'text-start text-body-1 ms-3' }"
    >
      <template #actions>
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-kanali-dodaj', params: { gid } }"
          icon
          variant="text"
        >
          <Iconx icon="$plus" />
          <VTooltip text="Pridruži kanal" />
        </VBtn>
        <VBtn
          @click="cgConfigureUnassign"
          :disabled="noSelectionCH"
          icon
          variant="text"
        >
          <Iconx icon="$minus" />
          <VTooltip text="Izbaci kanale" />
        </VBtn>
        <VBtn @click="reload" icon variant="plain" density="comfortable">
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
      <template #title="{ text }">
        <span class="d-flex items-center gap-4">
          <Iconx icon="headset" size="1.33rem" />
          <VBadge
            :model-value="0 < sizeChannelsOnly"
            inline
            :content="sizeChannelsOnly"
            color="primary-darken-1"
          >
            <span class="me-1">{{ text }}</span>
          </VBadge>
        </span>
      </template>
    </VToolbarSecondary>
    <VDataIteratorListData
      v-model="chSelection"
      :items="channels"
      :item-title="itemTitle"
      :item-to="itemToCH"
      disabled-skeleton-loader
      :props-list="{ density: 'compact', class: 'py-0' }"
      :props-list-item="{ class: '*ps-4 ms-0' }"
      :props-list-item-title="{ class: 'ps-0 ms-2' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
