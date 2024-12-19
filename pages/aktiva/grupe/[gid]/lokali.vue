<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import { renderIcon } from "@/components/icons";
import {
  VDataIteratorListData,
  VFabMain,
  VSnackbarMain,
} from "@/components/app";
// ##config:const
const DEFAULT_SEARCH_SITES_LIMIT = 20;
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { SEARCH_DEBOUNCE_DELAY_longer, DEFAULT_NO_IMAGE_AVAILABLE },
  db: {
    Assets: {
      type: { PHYSICAL_STORE },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const {
  sites: { logo: siteLogo },
} = useCategoryAssets();

const { smAndUp } = useDisplay();

const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g"));
const gid = computed(() => g.value?.id);
const ps = useProcessMonitor();

// ##icons
const iconCheckOn = renderIcon("check-on", {});
const iconCheckOff = renderIcon("check-off", {});
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
  undefined,
  undefined,
  { enabled: false }
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
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleSitesSGConfigSuccess.isActive.value"
    >
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarMain>
    <div class="__spacer mt-2 px-5">
      <VTextField
        v-model="searchText"
        variant="underlined"
        placeholder="Traži lokal..."
        clearable
        autofocus
      >
        <template #append-inner>
          <Iconx size="1.22rem" icon="link" class="mt-1 opacity-20" />
        </template>
        <template #prepend-inner>
          <Iconx
            size="1.22rem"
            class="opacity-20 translate-y-px me-1"
            icon="search"
          /> </template
      ></VTextField>
    </div>
    <VSpacer class="mt-3" />
    <VDataIteratorListData
      v-model="sitesSelected"
      :items="sitesMatched"
      :item-title="itemTitle"
      :item-to="itemTo"
      :disabled-skeleton-loader="!searchq"
      :props-list="{ density: 'compact', class: 'py-0' }"
      :props-list-item-title="{ class: 'ms-3' }"
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
