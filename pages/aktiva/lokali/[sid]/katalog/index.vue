<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VEmptyStateNoData,
  VChipUserAvatar,
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

const attrs = useAttrs();
const site = computed(() => get(attrs, "route-data.site"));
const sid = computed(() => site.value?.id);
// ##schemas
// ##utils
const { isShareable, SHAREABLE } = useCatalogUtils();
const { smAndUp } = useDisplay();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models ##globals
const signalIdDeselect = useUniqueId();
const toggleCatalogRmSuccess = useToggleFlag();
const ps = useProcessMonitor();
const mOrdersSelection = ref();
// ##data ##auth ##state
const { catalogRemove, catalogConfigTags } = useMutationCatalog();
const { orders, reload } = useQuerySiteOrders(sid);
// ##computed
const someSelected = computed(() => !isEmpty(mOrdersSelection.value));
const productsCount = (order: any) => len(order?.products) || 0;
// ##forms ##handlers ##helpers ##small-utils
const mSetSelectionNone = signalIdDeselect;
const itemTo = (order: any) => ({
  name: "deli-katalog",
  query: {
    q: toIds(order),
  },
});
const itemTitle = (order: any) => $dd.utc(order?.created_at).format("D/M/YY.");
const onDeleteCatalog = async () => {
  if (isEmpty(mOrdersSelection.value)) return;
  try {
    ps.begin(toggleCatalogRmSuccess.off);
    if (
      get(
        await catalogRemove(map(mOrdersSelection.value, toIds)),
        "data.catalogOrderRemove.error"
      )
    )
      throw "@error:catalog-rm:LqI6j6d4rTeNQjYS6tnB";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      // @success:rm
      mSetSelectionNone();
      toggleCatalogRmSuccess.on();
      reload();
    });
};
const onManageCatalogTags = async (config: any) => {
  if (isEmpty(mOrdersSelection.value)) return;
  if (isEmpty(config)) return;
  try {
    if (
      some(
        await Promise.all(
          map(
            mOrdersSelection.value,
            async (order: any) => await catalogConfigTags(toIds(order), config)
          )
        ),
        (r: any) => get(r, "data.catalogManageTags.error")
      )
    )
      throw "@error:catalog-tags:kYEw6kt2M0";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      mSetSelectionNone();
      reload();
    });
  console.log("@debug", ps.error.value);
};
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
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleCatalogRmSuccess.isActive.value"
    >
      <p>Katalog je uspešno obrisan.</p>
    </VSnackbarMain>
    <VToolbarSecondary text="📃 Katalog">
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
          @click="() => onManageCatalogTags.call(null, { [SHAREABLE]: true })"
          :disabled="!someSelected"
          icon
        >
          <span>🌐</span>
        </VBtn>
        <VBtn
          @click="() => onManageCatalogTags.call(null, { [SHAREABLE]: false })"
          :disabled="!someSelected"
          icon
        >
          <span>⛔</span>
        </VBtn>
        <VBtn
          @click="onDeleteCatalog"
          color="error"
          :disabled="!someSelected"
          icon
        >
          <Iconx icon="trash" size="1.122rem" />
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
      :signal-id-deselect="signalIdDeselect.ID.value"
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
        <VBadge color="transparent" inline :model-value="isShareable(order)">
          <template #badge>
            <Iconx
              size="1rem"
              icon="world"
              class="text-info opacity-40 -rotate-3"
            />
          </template>
          <span>{{ itemTitle(order) }}</span>
        </VBadge>
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
