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
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const products_tot = useQueryAssetsCountProducts();
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const CARDS_items = [
  {
    title: "Prodajna mesta",
    image: "/prodanjo-mesto.55099_frikom_f.jpg",
    icon: {
      icon: "storefront",
      size: "1.55rem",
      class: "opacity-20 *me-1",
    },
    to: { name: "aktiva-lokali" },
    count: undefined,
  },
  {
    title: "Tim",
    image: "/tim.2024-11-23 04_07_39-Window.png",
    icon: {
      icon: "people-groups",
      size: "1.88rem",
      class: "opacity-20 *me-1",
    },
    to: { name: "tim" },
    count: undefined,
  },
  {
    title: "Izveštaji",
    image: "/forms.y37RA68d8i.jpg",
    icon: {
      icon: "task",
      size: "1.55rem",
      class: "opacity-20 *me-1",
    },
    to: { name: "teren" },
  },
  {
    title: "Asortiman",
    image:
      "/asortiman.watercolor-illustration-wooden-shelf-with-boxes_1282444-230916.jpg",
    icon: {
      icon: "box",
      size: "1.88rem",
      class: "opacity-20 me-1",
    },
    to: { name: "aktiva-proizvodi" },
    count: products_tot,
  },
];
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Aktiva" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva">
    <div class="__spacer px-4 pt-4 space-y-4">
      <VCard
        v-for="item in CARDS_items"
        :key="item.title"
        max-width="412"
        link
        :to="item.to"
        class="mx-auto"
      >
        <VImg height="192" :src="item.image" cover />
        <VCardItem>
          <template #title>
            <h4 class="text-h6 font-weight-light">{{ item.title }}</h4>
          </template>
          <template #append>
            <VBadge
              :model-value="!!item.count?.value"
              inline
              :content="item.count?.value"
              color="primary-lighten-1"
            >
              <Iconx v-bind="item.icon" />
            </VBadge>
          </template>
        </VCardItem>
      </VCard>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
