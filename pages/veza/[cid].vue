<script setup lang="ts">
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const route = useRoute();
const param_cid = computed(() => get(route.params, "cid"));
const enabled = computed(() => !!param_cid.value);
const { assets } = useQueryManageAssetsComms(() => [param_cid.value], false, {
  enabled,
});
const channel = computed(() => first(assets.value));

// @@eos
</script>
<template>
  <section class="page--veza-cid">
    <h1>veza:index</h1>
    <NuxtPage :route-data="{ channel }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
