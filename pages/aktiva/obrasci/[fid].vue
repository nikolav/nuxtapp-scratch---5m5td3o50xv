<script setup lang="ts">
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const route = useRoute();
const fid = computed(() => get(route.params, "fid"));
const qEnabled = computed(() => !!fid.value);
const { assets } = useQueryManageAssetsForms(() => [fid.value], false, {
  enabled: qEnabled,
});
const form = computed(() => first(assets.value));

// @@eos
</script>
<template>
  <section class="component--aktiva-obrasci-fid">
    <NuxtPage :route-data="{ fid, form }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
