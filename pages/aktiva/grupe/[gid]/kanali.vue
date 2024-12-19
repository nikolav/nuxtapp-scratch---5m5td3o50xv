<script setup lang="ts">
// ##imports
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
const g = computed(() => get(attrs, "route-data.g"));
const gid = computed(() => g.value?.id);

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
    <VToolbarSecondary text="🔊 Kanali">
      <template #actions>
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-kanali-dodaj', params: { gid } }"
          icon
          variant="text"
        >
          <Iconx icon="$plus" />
        </VBtn>
        <VBtn
          @click="cgConfigureUnassign"
          :disabled="noSelectionCH"
          icon
          variant="text"
        >
          <Iconx icon="$minus" />
        </VBtn>
        <VBtn @click="reload" icon variant="plain">
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
      <template #title="{ text }">
        <VBadge
          :model-value="0 < sizeChannelsOnly"
          inline
          :content="sizeChannelsOnly"
          color="primary-darken-1"
        >
          <span class="me-1">{{ text }}</span>
        </VBadge>
      </template>
    </VToolbarSecondary>
    <VSpacer class="mt-3" />
    <VDataIteratorListData
      v-model="chSelection"
      :items="channels"
      :item-title="itemTitle"
      :item-to="itemToCH"
      disabled-skeleton-loader
      :props-list="{ class: 'py-0' }"
      :props-list-item="{ class: 'mt-2' }"
      :props-list-item-title="{ class: 'ps-3' }"
      :props-selection-check="{ class: 'scale-[112%]' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
