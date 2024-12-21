<script setup lang="ts">
// ##imports
import { VToolbarSecondary } from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const attrs = useAttrs();
const site = computed(() => get(attrs, "route-data.site"));
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
useHead({ title: "📄 Artikli, liste" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid-artikli-liste">
    <VToolbarSecondary text="📄 Artikli">
      <template #title="{ text }">{{ text }}</template>
      <template #actions>
        <VBtn color="primary-darken-1" @click="noop" icon variant="text">
          <Iconx icon="$plus" size="1.44rem" />
        </VBtn>
        <VBtn
          color="primary-darken-1"
          @click="noop"
          icon
          variant="plain"
          density="comfortable"
        >
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
    </VToolbarSecondary>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
