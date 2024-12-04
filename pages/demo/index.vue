<script setup lang="ts">
// ##imports
import { Demo } from "@/components/dev";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
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

// @@eos
</script>
<template>
  <section class="page--demo">
    <Demo />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
