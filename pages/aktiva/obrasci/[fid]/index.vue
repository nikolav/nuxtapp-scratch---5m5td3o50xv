<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { VToolbarPrimary } from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const fid = computed(() => get(attrs, "route-data.fid"));
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
useHead({ title: "🎫 Obrasci" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-obrasci-fid-index">
    <VToolbarPrimary route-back-name="aktiva-obrasci" :text="form?.name"
      :props-title="{class: 'text-body-1'}"
    >
      <template #prepend>
        <Iconx icon="$iconAppCogFill" size="1.122rem" class="opacity-20 mx-1" />
      </template>
    </VToolbarPrimary>
    <Dump :data="{ attrs }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
