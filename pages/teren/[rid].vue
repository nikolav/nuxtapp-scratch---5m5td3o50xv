<script setup lang="ts">
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const route = useRoute();
const rid = computed(() => route.params.rid);
const enabled = computed(() => !!rid.value);

const { assets: forms } = useQueryManageAssetsForms(
  () => [rid.value],
  undefined,
  { enabled }
);
const form = computed(() => first(forms.value));

// @@eos
</script>
<template>
  <section class="page--teren-izvestaji-nov">
    <NuxtPage :route-data="{ rid, form }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
