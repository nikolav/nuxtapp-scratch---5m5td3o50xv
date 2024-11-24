<script setup lang="ts">
// ##imports
import { VCardGoogleCalendar } from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
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
useHead({ title: "📅 Kalendar" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--kalendar">
    <div class="__spacer mt-1">
      <VCardGoogleCalendar />
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
