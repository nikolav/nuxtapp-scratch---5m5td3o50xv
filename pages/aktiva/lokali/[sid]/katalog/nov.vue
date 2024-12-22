<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
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
// ##schemas
// ##utils
const {
  products: { categories_select_menu: menu_p },
} = useCategoryAssets();
// ##icons
// ##refs ##flags ##models
const catalog = useStateCatalogMake();
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✨ Katalog" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-sid-katalog-nov">
    <VToolbar density="comfortable" color="surface" class="pa-0">
      <VSheet
        class="grow p-0 !ps-[2px] justify-between d-flex mx-auto"
        max-width="512"
      >
        <VBtn
          v-for="node in menu_p"
          :key="node.title"
          icon
          @click="noop"
          variant="plain"
          size="small"
          color="primary"
          class="!text-[122%]"
          >{{ node.emoji }}</VBtn
        >
      </VSheet>
    </VToolbar>
    <h1>🚧</h1>
    <Dump :data="{ menu_p }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
