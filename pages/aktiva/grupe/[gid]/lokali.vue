<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VFabMain,
  VSnackbarSuccess,
} from "@/components/app";
// ##config:const
const DEFAULT_SEARCH_SITES_LIMIT = undefined;
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
  db: {
    Assets: {
      type: { PHYSICAL_STORE },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const attrs = useAttrs();
const gid = computed(() => get(attrs, "route-data.gid"));
// const routeData = computed(() => get(attrs, "route-data", <any>{}));
// const g = computed(() => routeData.value?.g);
// const gid = computed(() => routeData.value?.gid);
// const gname = computed(() => routeData.value?.gname);
const enabled = computed(() => !!gid.value);
const ps = useProcessMonitor();

// ##icons
// ##refs ##flags ##models
const sitesSelected = ref();
const searchq = useGlobalVariable(
  "searchq:977f5c50-dba7-58c4-9fa1-257dceb8637f"
);
const searchText = ref();
const toggleSitesSGConfigSuccess = useToggleFlag();
// ##data ##auth ##state
const { assets: sitesMatched, loading: qloading } = useQueryAssetsSearch(
  searchq,
  PHYSICAL_STORE,
  DEFAULT_SEARCH_SITES_LIMIT
);
const { sitesSGConfig } = useQueryManageAssets(
  undefined,
  () => [gid.value],
  undefined,
  { enabled }
);
// ##computed
const someSitesSelected = computed(() => !isEmpty(sitesSelected.value));
const configurationSG = computed(() =>
  someSitesSelected.value
    ? {
        [`${map(sitesSelected.value, (s: IAsset) => `+${s.id}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
    : undefined
);
// ##forms ##handlers ##helpers
const itemTitle = (node: any) => node.name;
const itemTo = (node: any) => ({
  name: "aktiva-lokali-sid",
  params: { sid: node.id },
});
const selectionDeselectAll = () => {
  sitesSelected.value = undefined;
};
const sgConfigure = async () => {
  const sg = configurationSG.value;
  if (isEmpty(sg)) return;
  try {
    ps.begin();
    if (get(await sitesSGConfig(sg), "data.assetsAGConfig.error"))
      throw "--sgConfig-error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(toggleSitesSGConfigSuccess.on);
};
// ##watch
watch(
  searchText,
  debounce((searchText: string) => {
    if (searchText) {
      searchq.value = searchText;
    }
  }, SEARCH_DEBOUNCE_DELAY_longer)
);
watch([qloading, sitesMatched], selectionDeselectAll);
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Veži lokale" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-lokali">
    <VSnackbarSuccess v-model="toggleSitesSGConfigSuccess.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>
    <VToolbarSecondary
      :route-back-to="{ name: 'aktiva-grupe-gid-sites', params: { gid } }"
      :props-title="{ class: 'ms-0' }"
    >
      <template #title>
        <VTextField
          v-model="searchText"
          variant="underlined"
          density="compact"
          rounded="pill"
          placeholder="Traži lokal..."
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
      v-model="sitesSelected"
      :items="sitesMatched"
      :item-title="itemTitle"
      :item-to="itemTo"
      :disabled-skeleton-loader="!searchq"
      :props-list="{ density: 'compact', class: 'py-0' }"
      :props-list-item-title="{ class: 'ms-3' }"
    />
    <VFabMain
      v-if="someSitesSelected"
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      @click="sgConfigure"
    >
      <template #icon>
        <Iconx size="1.5rem" icon="link" />
      </template>
    </VFabMain>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.page--aktiva-grupe-gid-lokali .v-field__input {
  @include placeholder-with-prefix {
    font-style: italic;
    font-size: 0.95rem;
    opacity: 0.33;
  }
}
</style>
