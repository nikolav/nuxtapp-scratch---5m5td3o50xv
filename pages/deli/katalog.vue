<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import {
  VToolbarPrimary,
  VChipUserAvatar,
  VChipAssetAvatar,
  VEmptyStateNoData,
} from "@/components/app";
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
const {
  sites: { logo: siteThumb },
  products: { itemCategories },
} = useCategoryAssets();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { order, items } = useQueryOrdersProductsAmounts(ooid);
const site = computed(() => order.value?.site);
// ##computed
const sid = computed(() => toIds(site.value));
const productsCount = computed(() => len(order.value?.products) || 0);
// ##forms ##handlers ##helpers ##small-utils
const orderCreatedAt = computed(() =>
  order.value ? $dd.utc(order.value.created_at).format("D. MMM YYYY.") : ""
);
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// useHead({ title: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--deli-katalog">
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
        <VBadge
          :model-value="0 < productsCount"
          inline
          :content="productsCount"
          color="primary-lighten-1"
        />
      </template>
    </VToolbarPrimary>
    <VSheet class="d-flex items-center justify-between pa-1 gap-1">
      <VChipAssetAvatar
        :asset="site"
        :item-to="{ name: 'aktiva-lokali-sid', params: { sid } }"
        :prepend-avatar="siteThumb(site)"
        size="large"
        class="!max-w-[144px]"
      />
      <VChipUserAvatar
        :user="order?.author"
        :props-avatar="{ size: 33 }"
        size="large"
        class="ps-1 !max-w-[144px]"
      />
    </VSheet>
    <VEmptyStateNoData v-if="isEmpty(items)" />
    <template v-else>
      <VDivider length="66%" class="border-opacity-100 mx-auto my-5" />
      <VList>
        <VListItem v-for="node in items" :key="node.product.key">
          {{ itemCategories(node.product) }}
        </VListItem>
      </VList>
    </template>
    <Dump :data="{ site, order, items }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
