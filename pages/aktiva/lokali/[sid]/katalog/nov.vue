<script setup lang="ts">
// ##imports
import { VEmptyStateNoData, VSnackbarMain } from "@/components/app";

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
const site = computed(() => get(attrs, "route-data.site"));
const sid = computed(() => site.value?.id);
// ##schemas
// ##utils
const ps = useProcessMonitor();
const {
  CATEGORY_KEY_ASSETS_prefix,
  products: { categories_select_menu: menu_p },
} = useCategoryAssets();
// ##icons
// ##refs ##flags ##models
const lastCatalogCreated = ref();
const toggleCatalogAddSuccess = useToggleFlag();
const catalogIndex = useStateCatalogAdd();
const categoryKeyPicked = useGlobalVariable(
  "c4c004ca-8236-5514-ae5c-8e3306598397"
);
const category = computed(() =>
  categoryKeyPicked.value
    ? `${CATEGORY_KEY_ASSETS_prefix}${categoryKeyPicked.value}`
    : ""
);
const qenabled = computed(() => !!category.value);
// ##data ##auth ##state
const { catalogAdd, processing } = useMutationCatalog();
const { assets: products } = useQueryManageAssetsProducts(
  undefined,
  false,
  { enabled: qenabled },
  { category }
);
// ##computed
const catalog_ = computed(() =>
  reduce(
    catalogIndex.value,
    (res: any, amount: number, key: any) => {
      if (0 < amount) {
        res[key] = amount;
      }
      return res;
    },
    <any>{}
  )
);
// ##forms ##handlers ##helpers ##small-utils
const catalogClear = () => {
  catalogIndex.value = <any>{};
};
const categoryKeyPutRandom = () => {
  categoryKeyPicked.value = sample(menu_p).key;
};
const onAmount = (pid: any, amount: any) => {
  catalogIndex.value[pid] = Math.max(0, amount);
};
const onSubmit = async () => {
  let res: any;
  try {
    ps.begin(toggleCatalogAddSuccess.off);
    if (some([sid.value, catalog_.value], isEmpty))
      throw "@error:catalog-add:yYALXo4ycaVq6e7ZUY";
    res = await catalogAdd(sid.value, catalog_.value);
    if (!get(res, "data.catalogOrderAdd.status.id"))
      throw "@error:catalog-add:WLRg1tAdmblfxMu";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      lastCatalogCreated.value = get(res, "data.catalogOrderAdd.status.order");
      catalogClear();
      toggleCatalogAddSuccess.on();
    });
  console.log("@debug:catalog-add", ps.error.value);
};
const summedValues = (node: any) =>
  reduce(node, (sum: number, x: number) => sum + x, 0);
// ##watch
// ##hooks ##lifecycle
useOnceMountedOn(true, () => {
  nextTick(() => {
    if (!categoryKeyPicked.value) categoryKeyPutRandom();
  });
});
// ##head ##meta
useHead({ title: "✨ Katalog" });
// ##provide
// ##io

const itemTo = (catalog: any) => ({
  name: "deli-katalog",
  query: {
    q: toIds(catalog),
  },
});

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid-katalog-nov">
    <VSnackbarMain
      v-model="toggleCatalogAddSuccess.isActive.value"
      color="success-darken-1"
    >
      <NuxtLink :to="itemTo(lastCatalogCreated)">
        <a class="link--prominent">
          <p>📃 Katalog je uspešno sačuvan.</p>
        </a>
      </NuxtLink>
    </VSnackbarMain>
    <VForm @submit.prevent>
      <VCard
        :disabled="processing || ps.processing.value"
        flat
        rounded="0"
        elevation="0"
      >
        <VToolbar density="comfortable" color="surface" class="pa-0 px-1">
          <VSheet
            class="grow p-0 !ps-[2px] justify-between d-flex mx-auto"
            max-width="512"
          >
            <VBtn
              v-for="node in menu_p"
              :key="node.title"
              icon
              @click="categoryKeyPicked = node.key"
              :variant="categoryKeyPicked == node.key ? 'tonal' : 'text'"
              size="small"
              color="primary"
              class="!text-[122%]"
              >{{ node.emoji }}</VBtn
            >
            <VDivider vertical class="border-opacity-75 ms-1 me-2" inset />
            <VBtn
              :disabled="isEmpty(catalog_) || processing || ps.processing.value"
              @click="onSubmit"
              variant="tonal"
              color="primary"
              icon
              elevation="1"
              size="small"
            >
              <Iconx size="1.5rem" icon="save" />
            </VBtn>
          </VSheet>
        </VToolbar>
        <VEmptyStateNoData v-if="isEmpty(products)" class="opacity-40" />
        <VCardText v-else class="px-0">
          <VTable class="CLASS--uv4Mz">
            <thead class="text-xs opacity-40 font-italic">
              <tr>
                <th class="px-0 ps-3">Proizvod</th>
                <th class="text-end">#</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in products" :key="p.key">
                <td class="!border-0 pa-0 ps-2 text-body-2">{{ p.name }}</td>
                <td class="!border-0 text-end pa-0 !w-[54px] pe-2">
                  <VTextField
                    @update:model-value="
                      (val) => onAmount.call(null, p.id, val)
                    "
                    :model-value="catalogIndex[p.id]"
                    type="number"
                    density="compact"
                    center-affix
                    hide-details
                    single-line
                    variant="underlined"
                    flat
                    class="mx-0 px-0 CLASS--Z2ZLdtgA1FpzZkXhUR w-100"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped>
.CLASS--uv4Mz thead th {
  height: auto !important;
}
.CLASS--uv4Mz tbody td {
  height: auto !important;
}
</style>
<style module></style>
<style lang="scss">
.CLASS--Z2ZLdtgA1FpzZkXhUR input {
  text-align: end;
}
</style>
