<script setup lang="ts">
// ##imports
import {
  VToolbarSecondary,
  VDataIteratorListData,
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
const site = computed(() => get(attrs, "route-data.site"));
const sid = computed(() => site.value?.id);
// ##schemas
// ##utils
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { orders, loading, reload } = useQuerySiteOrders(sid);
// ##computed
const productsCount = (order: any) => len(order?.products) || 0;
// ##forms ##handlers ##helpers ##small-utils
const itemTitle = (order: any) =>
  $dd.utc(order?.created_at).format("D. MMM YYYY.");
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📄 Artikli, liste" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid-katalog">
    <VToolbarSecondary text="📄 Katalog">
      <template #title="{ text }">{{ text }}</template>
      <template #actions>
        <VBtn color="primary-darken-1" @click="noop" icon variant="text">
          <Iconx icon="$plus" size="1.44rem" />
        </VBtn>
        <VBtn
          color="primary-darken-1"
          @click="reload"
          icon
          variant="plain"
          density="comfortable"
        >
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
    </VToolbarSecondary>
    <VEmptyStateNoData v-if="isEmpty(orders)" class="opacity-40" />
    <VDataIteratorListData
      v-else
      :items="orders"
      :item-title="itemTitle"
      disabled-skeleton-loader
      :props-list="{ class: 'CLASS--VList-item-spacer-none' }"
      :props-list-item-title="{ class: 'ps-3' }"
    >
      <template #list-item-prepend="{ item: order }">
        <VBadge inline :content="productsCount(order)" color="primary" />
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
