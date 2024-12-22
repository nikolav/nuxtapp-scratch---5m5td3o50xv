<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VEmptyStateNoData,
  VChipUserAvatar,
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
const { smAndUp } = useDisplay();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models ##globals
const mOrdersSelection = ref();
// ##data ##auth ##state
const { orders, reload } = useQuerySiteOrders(sid);
// ##computed
const productsCount = (order: any) => len(order?.products) || 0;
// ##forms ##handlers ##helpers ##small-utils
const itemTo = (order: any) => ({
  name: "deli-katalog",
  query: {
    q: toIds(order),
  },
});
const itemTitle = (order: any) => $dd.utc(order?.created_at).format("D/M/YY.");
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📄 Katalog, liste" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid-katalog">
    <VToolbarSecondary text="📄 Katalog">
      <template #title="{ text }">
        <span>{{ text }}</span>
      </template>
      <template #actions>
        <VBtn
          :to="{ name: 'aktiva-lokali-sid-katalog-nov', params: { sid } }"
          color="primary-darken-1"
          icon
          variant="text"
        >
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
    <VSpacer class="mt-3" />
    <VEmptyStateNoData v-if="isEmpty(orders)" class="opacity-40" />
    <VDataIteratorListData
      v-else
      v-model="mOrdersSelection"
      :items="orders"
      :item-to="itemTo"
      disabled-skeleton-loader
      :props-list="{ class: 'CLASS--VList-item-spacer-none' }"
      :props-list-item-title="{ class: 'ps-0' }"
      :props-list-item="{ class: 'ps-1' }"
      :props-selection-check="{ class: '!mx-0 !px-0', density: 'compact' }"
    >
      <template #list-item-title="{ item: order }">
        <VBadge
          inline
          :content="productsCount(order)"
          color="primary"
          class="me-2"
        >
          <small class="opacity-50 me-1">#{{ toIds(order) }}</small>
        </VBadge>
        <span>{{ itemTitle(order) }}</span>
      </template>
      <template #list-item-append="{ item: order }">
        <VChipUserAvatar
          :props-avatar="{ size: 31 }"
          :user="get(order, 'author')"
          class="ps-0"
          :class="[smAndUp ? '' : '!max-w-[122px]']"
        />
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
