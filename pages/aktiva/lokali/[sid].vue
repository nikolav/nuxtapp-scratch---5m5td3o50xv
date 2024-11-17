<script setup lang="ts">
import { VBtnTopicChatToggle, VToolbarPrimary } from "@/components/app";
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
const sid = computed(() => get(route.params, "sid"));

const { assets } = useQueryManageAssets(
  PHYSICAL_STORE,
  () => [sid.value],
  false
);
const site = computed(() => first(assets.value));
const skey = computed(() => site.value?.key);
const sname = computed(() => startCase(site.value?.name || ""));

const { chatAssets } = useTopics();
const topicChatAssetSite = computed(
  () => `${chatAssets(skey.value)} --title ${kebabCase(sname.value)}`
);

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid">
    <VToolbarPrimary
      :text="sname"
      route-back-name="aktiva-lokali"
      :props-title="{ class: 'text-body-1 text-start' }"
      :props-actions="{ class: 'pe-1' }"
      class="ma-0 pa-0"
    >
      <template #actions>
        <VBtnTopicChatToggle :topic="topicChatAssetSite" />
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
