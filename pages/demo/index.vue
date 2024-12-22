<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "default",
  // middleware: "access-debug",
});
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
useHead({ title: "🚧Demo" });
// ##provide
// ##io

const { orders } = useQuerySiteOrders(7);

// @@eos
</script>
<template>
  <section class="page--demo">
    <h1>🚧</h1>
    <Dump :data="{ orders }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
