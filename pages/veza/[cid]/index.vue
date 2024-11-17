<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const attrs = useAttrs();
const channel = computed(() => get(attrs, "route-data.channel"));
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Veza" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza-cid-index">
    <h1>veza @{{ channel?.id }}:{{ channel?.key }}</h1>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
