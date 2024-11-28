<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const form = computed(() => get(attrs, "route-data.form"));

// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📝 Obrasci | Pregled" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-rid-pregled">
    <h1>@teren-rid-pregled</h1>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
