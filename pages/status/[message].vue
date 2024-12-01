<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const route = useRoute();
const message = computed(() =>
  JSON.parse(decodeURIComponent(String(route.params.message)))
);
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✔" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--status-message">
    <NuxtPage :route-data="{ message }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
