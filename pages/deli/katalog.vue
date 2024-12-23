<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VChipUserAvatar,
  VChipAssetAvatar,
  VEmptyStateNoData,
  VBadgeSelectedOfTotal,
} from "@/components/app";
import { Redirect } from "@/components/utils";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "default",
  // middleware: undefined,
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
    // hideCatalogToolbar: true,
  },
});

const route = useRoute();
const ooid = computed(() => route.query?.q);
// ##schemas
// ##utils
const { isShareable } = useCatalogUtils();
const {
  sites: { logo: siteThumb },
  products: { itemCategories, categories_select_menu: menu_p },
} = useCategoryAssets();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const auth = useStoreApiAuth();
const { order, items } = useQueryOrdersProductsAmounts(ooid);
const site = computed(() => order.value?.site);
// ##computed
const isBlocked$ = ref();
const sid = computed(() => toIds(site.value));
const productsCount = computed(() => len(order.value?.products) || 0);
const productsByCategory = computed(() =>
  isEmpty(items.value)
    ? {}
    : groupBy(
        sortBy(items.value, (item: any) =>
          lowerCase(get(item, "product.name"))
        ),
        (item: any) => first(itemCategories(item.product))
      )
);
const amountsSummedAll = computed(() =>
  reduce(items.value, (res: number, item: any) => res + Number(item.amount), 0)
);
// ##forms ##handlers ##helpers ##small-utils
const orderCreatedAt = computed(() =>
  order.value ? $dd.utc(order.value.created_at).format("D. MMM YYYY.") : ""
);
const summed = (items: any) =>
  reduce(items, (r: number, item: any) => r + Number(item.amount), 0);
// ##watch
useOnceMountedOn(order, () => {
  if (!auth.isAuthenticated$) {
    if (!isShareable(order.value)) {
      isBlocked$.value = true;
    }
  }
});
// ##hooks ##lifecycle
// ##head ##meta
// useHead({ title: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--deli-katalog">
    <Redirect :to="{ name: 'index' }" v-if="isBlocked$" />
    <template v-else>
      <VToolbarPrimary
        :text="orderCreatedAt"
        :props-title="{ class: 'text-body-2 font-italic text-start ms-2' }"
      >
        <template #title="{ text }">
          <span class="d-inline-flex items-center gap-1">
            <small class="opacity-50">#{{ order?.id }}</small>
            <span class="ms-2">{{ text }}</span>
          </span>
        </template>
        <template #prepend>
          <Iconx icon="list-outline" size="1.33rem" class="ms-1 opacity-20" />
        </template>
        <template #append>
          <VBadgeSelectedOfTotal
            :model-value="productsCount"
            :length="amountsSummedAll"
          />
        </template>
      </VToolbarPrimary>
      <VSheet class="d-flex items-center justify-between pa-2 gap-1 flex-wrap">
        <VChipAssetAvatar
          :asset="site"
          :item-to="{ name: 'aktiva-lokali-sid', params: { sid } }"
          :prepend-avatar="siteThumb(site)"
          size="large"
        />
        <VChipUserAvatar
          :user="order?.author"
          :props-avatar="{ size: 33 }"
          size="large"
          class="ps-1"
        />
      </VSheet>
      <VEmptyStateNoData v-if="isEmpty(items)" class="opacity-40" />
      <template v-else>
        <div class="__spacer space-y-6 mt-8">
          <template v-for="node in menu_p" :key="node.title">
            <VCard
              v-if="node.title in productsByCategory"
              flat
              elevation="0"
              rounded="0"
            >
              <VCardItem class="pe-3">
                <template #append>
                  <VBadgeSelectedOfTotal
                    :model-value="len(productsByCategory[node.title])"
                    :length="summed(productsByCategory[node.title])"
                    color="secondary-lighten-2"
                  />
                </template>
                <template #prepend>
                  <span class="opacity-50">{{ node.emoji }}</span>
                </template>
                <VCardTitle>
                  <span class="ps-2">{{ node.title }}</span>
                </VCardTitle>
              </VCardItem>
              <VCardText class="px-2">
                <VTable>
                  <thead class="text-xs font-italic opacity-40">
                    <tr>
                      <th class="h-auto pb-1 ps-3">Proizvod</th>
                      <th class="h-auto pb-1">Barkod</th>
                      <th class="text-end h-auto pb-1 pe-0">#</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="{ amount, product } in productsByCategory[
                        node.title
                      ]"
                      :key="product.key"
                    >
                      <td class="!border-0 h-auto pa-0 ps-1 pt-2">
                        {{ product.name }}
                      </td>
                      <td class="!border-0 h-auto pa-0 pt-2">
                        <small class="opacity-50 font-weight-thin">
                          {{ product?.data?.barcode || "-" }}
                        </small>
                      </td>
                      <td class="!border-0 text-end pa-0 pt-2 h-auto w-4">
                        {{ amount }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VCardText>
            </VCard>
          </template>
        </div>
      </template>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
