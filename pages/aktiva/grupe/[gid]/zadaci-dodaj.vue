<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VDataIteratorListData,
  VFabMain,
  VSnackbarMain,
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

const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
  db: {
    Assets: {
      type: { DIGITAL_TASKS },
    },
  },
} = useAppConfig();

const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g", <any>{}));
const gid = computed(() => toIds(g.value));
// const enabled = computed(() => !!gid.value);

// ##schemas
// ##utils
const ps = useProcessMonitor();
const { smAndUp } = useDisplay();
// ##icons
// ##refs ##flags ##models
const toggleTGConfigSuccess = useToggleFlag();
const tSelected = ref();
const searchText = ref();
const qsearch = useGlobalVariable(
  "qsearch:tasks:fe47ad53-f907-57ed-b42f-065fc25a86a5"
);

// ##data ##auth ##state
const { assets: matchedTasks } = useQueryAssetsSearch(qsearch, DIGITAL_TASKS);
const { assetsAGConfig } = useQueryManageAssets(
  DIGITAL_TASKS,
  undefined,
  undefined,
  { enabled: false }
);
// ##computed
const someTSelected = computed(() => !isEmpty(tSelected.value));
const configurationTG = computed(() =>
  someTSelected.value && gid.value
    ? {
        [`${map(tSelected.value, (t: any) => `+${toIds(t)}`).join(" ")}`]: [
          Number(gid.value),
        ],
      }
    : undefined
);
// ##forms ##handlers ##helpers ##small-utils
const tgConfigure = async () => {
  const tg = configurationTG.value;
  if (isEmpty(tg)) return;
  try {
    ps.begin(toggleTGConfigSuccess.off);
    if (
      get(await assetsAGConfig(tg, DIGITAL_TASKS), "data.assetsAGConfig.error")
    )
      throw "tgConfig:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(toggleTGConfigSuccess.on);
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
const itemTitle = (t: any) => t?.name;
const itemTo = (t: any) => ({
  name: "deli-zadaci",
  query: { q: t?.key },
});

// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✅ Zadaci" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-zadaci-dodaj">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleTGConfigSuccess.isActive.value"
    >
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarMain>
    <div class="__spacer mt-2 px-5">
      <VTextField
        v-model="searchText"
        variant="underlined"
        placeholder="Traži zadatke..."
        clearable
        autofocus
      >
        <template #append-inner>
          <Iconx size="1.22rem" icon="task-alt" class="mt-1 opacity-20" />
        </template>
        <template #prepend-inner>
          <Iconx
            size="1.122rem"
            class="opacity-20 translate-y-px me-1"
            icon="search"
          /> </template
      ></VTextField>
    </div>
    <VDataIteratorListData
      v-model="tSelected"
      :items="matchedTasks"
      :item-title="itemTitle"
      :item-to="itemTo"
      :disabled-skeleton-loader="!qsearch"
      :props-list="{ class: 'py-0' }"
      :props-list-item-title="{ class: 'ps-3' }"
    />
    <VFabMain
      v-if="someTSelected"
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      @click="tgConfigure"
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
