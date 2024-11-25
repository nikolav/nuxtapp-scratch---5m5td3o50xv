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

const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g", <any>{}));
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name);

const {
  db: {
    Assets: {
      type: { PEOPLE_GROUP_TEAM },
    },
  },
} = useAppConfig();

// ##schemas
// ##utils
const { assetsConfigured } = useTopics();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const frmSelection = ref();
// ##data ##auth ##state
const qenabled = computed(() => !!gid.value);
// *forms parent to this user's groups
const {
  assets: forms,
  length: sizeForms,
  reload,
  formsFGConfig,
} = useQueryManageAssetsForms(
  // --all-assets-IDs
  undefined,
  // --sites-managed-OWN
  undefined,
  // --graphql-options-None
  { enabled: qenabled },
  // --vars-additional
  () => ({
    // --this-group's-parent-assets:forms
    aids_subs_only: filter([gid.value], Boolean),
    // --this-group
    aids_subs_type: PEOPLE_GROUP_TEAM,
  })
);
// ##computed
const noSelectionFRM = computed(() => isEmpty(frmSelection.value));
const configurationFGUnassign = computed(() =>
  gid.value && !noSelectionFRM.value
    ? {
        [`${map(frmSelection.value, (f: IAsset) => `-${f.id}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
    : undefined
);
// ##forms ##handlers ##helpers ##small-utils
const clearFRMSelection = () => {
  frmSelection.value = undefined;
};

const itemTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));
const itemTitle = (c: IAsset) => startCase(c.name);
const itemToFRM = (f: IAsset) => ({
  name: "aktiva-obrasci-fid",
  params: { fid: f.id },
});
const fgConfigureUnassign = async () => {
  const fg = configurationFGUnassign.value;
  if (isEmpty(fg)) return;
  try {
    if (get(await formsFGConfig(fg), "data.assetsAGConfig.error"))
      throw "assetsAGConfig:unassign:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(clearFRMSelection);
};

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Obrasci" });
// ##provide
// ##io
watchEffect(() => useIOEvent(() => assetsConfigured(gid.value), reload));

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-obrasci">
    <VToolbarSecondary
      :route-back-to="itemTo"
      text="Obrasci"
      :props-title="{ class: 'text-start text-body-1 ms-2' }"
    >
      <template #actions>
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-obrasci-dodaj', params: { gid } }"
          icon
          variant="text"
        >
          <Iconx icon="$plus" />
          <VTooltip text="Pridruži obrazac" />
        </VBtn>
        <VBtn
          @click="fgConfigureUnassign"
          :disabled="noSelectionFRM"
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
        <span class="d-flex items-center gap-2">
          <span>📝</span>
          <VBadge
            :model-value="0 < sizeForms"
            inline
            :content="sizeForms"
            color="primary-darken-1"
          >
            <span class="me-1">{{ text }}</span>
          </VBadge>
        </span>
      </template>
    </VToolbarSecondary>
    <VDataIteratorListData
      v-model="frmSelection"
      :items="forms"
      :item-title="itemTitle"
      :item-to="itemToFRM"
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
