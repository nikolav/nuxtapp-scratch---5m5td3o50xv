<script setup lang="ts">
import {
  VBtnTopicChatToggle,
  VToolbarPrimary,
  VBadgeSelectedOfTotal,
} from "@/components/app";
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  db: {
    Assets: {
      type: { PHYSICAL_STORE },
    },
  },
} = useAppConfig();

const route = useRoute();
const sid = computed(() => route.params?.sid);
const qenabled = computed(() => !!sid.value);

const { assets } = useQueryManageAssets(
  PHYSICAL_STORE,
  () => [sid.value],
  false,
  {
    enabled: qenabled,
  }
);
const site = computed(() => first(assets.value));
const skey = computed(() => site.value?.key);
const sname = computed(() => startCase(site.value?.name || ""));

const { chatAssets } = useTopics();
const topicChatAssetSite = computed(
  () => `${chatAssets(skey.value)} --title ${kebabCase(sname.value)}`
);

const catalogIndex = useStateCatalogAdd();
const sizeCatalog = computed(() =>
  reduce(
    catalogIndex.value,
    (s: number, x: number) => {
      if (0 < x) {
        s += 1;
      }
      return s;
    },
    0
  )
);
const summedCatalog = computed(() => summedValues(catalogIndex.value));

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid">
    <VToolbarPrimary
      :text="sname"
      route-back-name="aktiva-lokali"
      :props-title="{ class: 'text-body-1 text-start ms-2' }"
      :props-actions="{ class: 'pe-1' }"
      class="ma-0 pa-0"
    >
      <template v-if="0 < sizeCatalog" #title="{ text }">
        <span class="d-inline-flex gap-0">
          <VBadgeSelectedOfTotal
            :model-value="sizeCatalog"
            :length="summedCatalog"
          />
          <span class="ps-1">{{ text }}</span>
        </span>
      </template>
      <template #actions>
        <VBtnTopicChatToggle
          density="comfortable"
          :topic="topicChatAssetSite"
        />
        <VBtn
          :to="{ name: 'aktiva-lokali-sid-katalog', params: { sid } }"
          icon
          variant="plain"
          density="comfortable"
        >
          <Iconx icon="list-outline" size="1.33rem" />
        </VBtn>
        <VBtn
          :to="{ name: 'aktiva-lokali-sid-prilog', params: { sid } }"
          icon
          variant="plain"
          density="comfortable"
        >
          <Iconx icon="$file" size="1.22rem" />
        </VBtn>
      </template>
      <template #prepend>
        <Iconx icon="storefront" size="1.33rem" class="mx-1 opacity-20" />
      </template>
    </VToolbarPrimary>
    <NuxtPage :route-data="{ site }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
