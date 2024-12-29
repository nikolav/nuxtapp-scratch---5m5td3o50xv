<script setup lang="ts">
// ##imports
import {
  VDataIteratorListData,
  VToolbarSecondary,
  VEmptyStateNoData,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g"));
const gid = computed(() => toIds(g.value));

const {
  db: {
    Assets: {
      type: { DIGITAL_TASKS, PEOPLE_GROUP_TEAM },
    },
  },
} = useAppConfig();

// ##schemas
// ##utils
const { assetsConfigured } = useTopics();
// ##icons
// ##refs ##flags ##models
const ps = useProcessMonitor();
const tSelection = ref();
// ##data ##auth ##state
const qenabled = computed(() => !!gid.value);
const {
  assets: tasks,
  length: sizeTasks,
  reload,
  assetsAGConfig,
} = useQueryManageAssets(
  DIGITAL_TASKS,
  // --all-assets-IDs
  undefined,
  // --sites-managed-OWN
  undefined,
  // --graphql-options-None
  { enabled: qenabled },
  // --vars-additional
  () => ({
    ordered: "date_desc",
    // --this-group's-parent-assets:tasks
    aids_subs_only: filter([gid.value], Boolean),
    // --this-group
    aids_subs_type: PEOPLE_GROUP_TEAM,
  })
);
// ##computed
const noSelection = computed(() => isEmpty(tSelection.value));
const configurationTGUnassign = computed(() =>
  gid.value && !noSelection.value
    ? {
        [`${map(tSelection.value, (t: any) => `-${toIds(t)}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
    : undefined
);
// ##forms ##handlers ##helpers ##small-utils
const clearTSelection = () => {
  tSelection.value = undefined;
};

const itemTitle = (t: any) => t?.name;
const itemTo = (t: any) => ({
  name: "deli-zadaci",
  query: { q: t?.key },
});
const tgConfigureUnassign = async () => {
  const tg = configurationTGUnassign.value;
  if (isEmpty(tg)) return;
  try {
    if (
      get(await assetsAGConfig(tg, DIGITAL_TASKS), "data.assetsAGConfig.error")
    )
      throw "assetsAGConfig:unassign:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(clearTSelection);
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✅ Zadaci" });
// ##provide
// ##io
watchEffect(() => useIOEvent(() => assetsConfigured(gid.value), reload));

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-zadaci">
    <VToolbarSecondary text="✅ Zadaci">
      <template #actions>
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-zadaci-dodaj', params: { gid } }"
          icon
          variant="text"
        >
          <Iconx icon="$plus" />
        </VBtn>
        <VBtn
          @click="tgConfigureUnassign"
          :disabled="noSelection"
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
          :model-value="0 < sizeTasks"
          inline
          :content="sizeTasks"
          color="primary-darken-1"
        >
          <span class="me-1">{{ text }}</span>
        </VBadge>
      </template>
    </VToolbarSecondary>
    <VSpacer class="mt-3" />
    <VDataIteratorListData
      v-model="tSelection"
      :items="tasks"
      :item-title="itemTitle"
      :item-to="itemTo"
      disabled-skeleton-loader
      :props-list="{ class: 'py-0' }"
      :props-list-item="{ class: 'mt-2' }"
      :props-list-item-title="{ class: 'ps-3' }"
      :props-selection-check="{ class: 'scale-[112%]' }"
    >
      <template #no-data>
        <VEmptyStateNoData class="opacity-40" />
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
