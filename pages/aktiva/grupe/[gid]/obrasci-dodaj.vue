<script setup lang="ts">
// ##imports
import type { IAsset } from "@/types";
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VFabMain,
  VSnackbarSuccess,
} from "@/components/app";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g", <any>{}));
const gid = computed(() => g.value?.id);
const enabled = computed(() => !!gid.value);

const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
  db: {
    Assets: {
      type: { DIGITAL_FORM },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const toggleFGConfigSuccess = useToggleFlag();
const formsSelected = ref();
const qsearch = useGlobalVariable(
  "qsearch:forms:04f5ab09-bbd7-5eaf-99b2-3436a03a52f8"
);
const searchText = ref();
// ##data ##auth ##state
const { assets: matchedForms } = useQueryAssetsSearch(qsearch, DIGITAL_FORM);
const { formsFGConfig } = useQueryManageAssets(
  undefined,
  () => [gid.value],
  undefined,
  { enabled }
);

// ##computed
const someFormsSelected = computed(() => !isEmpty(formsSelected.value));
const configurationFG = computed(() =>
  someFormsSelected.value && gid.value
    ? {
        [`${map(formsSelected.value, (f: IAsset) => `+${f.id}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
    : undefined
);

// ##forms ##handlers ##helpers ##small-utils
const itemTitle = (frm: IAsset) => startCase(frm.name);
const itemTo = (frm: IAsset) => ({
  name: "aktiva-obrasci-fid",
  params: { fid: frm.id },
});
const fgConfigure = async () => {
  const fg = configurationFG.value;
  if (isEmpty(fg)) return;
  try {
    ps.begin(toggleFGConfigSuccess.off);
    if (get(await formsFGConfig(fg), "data.assetsAGConfig.error"))
      throw "fgConfig:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(toggleFGConfigSuccess.on);
};

// ##watch
watch(
  searchText,
  debounce((searchText: string) => {
    if (searchText) {
      qsearch.value = searchText;
    }
  }, SEARCH_DEBOUNCE_DELAY_longer)
);
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Obrasci" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-obrasci-gid-obrasci-dodaj">
    <VSnackbarSuccess v-model="toggleFGConfigSuccess.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>

    <VToolbarSecondary
      :route-back-to="{ name: 'aktiva-grupe-gid-obrasci', params: { gid } }"
      :props-title="{ class: '*bg-red grow ma-0 pa-s' }"
    >
      <template #title>
        <VTextField
          v-model="searchText"
          variant="underlined"
          density="compact"
          rounded="pill"
          placeholder="Traži obrazac..."
          hide-details
          single-line
          clearable
          autofocus
          class="grow ma-0 pa-0 mb-2 px-2 text-body-2"
        >
          <template #prepend-inner>
            <Iconx
              size="1.122rem"
              class="opacity-20 translate-y-px me-1"
              icon="search"
            /> </template
        ></VTextField>
      </template>
    </VToolbarSecondary>
    <VDataIteratorListData
      v-model="formsSelected"
      :items="matchedForms"
      :item-title="itemTitle"
      :item-to="itemTo"
      :disabled-skeleton-loader="!qsearch"
      :props-list="{ density: 'compact', class: 'py-0 ps-0' }"
      :props-list-item="{ class: 'ms-0 *ps-4' }"
      :props-list-item-title="{ class: 'ps-0 ms-2' }"
    />
    <VFabMain
      v-if="someFormsSelected"
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      @click="fgConfigure"
    >
      <template #icon>
        <Iconx size="1.5rem" icon="link" />
      </template>
    </VFabMain>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
