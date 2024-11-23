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
const ref_tEsiXAni9GHwifLEb = ref();
// ##data ##auth ##state
const products_tot = useQueryAssetsCountProducts();
// ##computed
const { width: WPCard } = useElementSize(ref_tEsiXAni9GHwifLEb);
// ##forms ##handlers ##helpers ##small-utils
const CARDS_items = [
  {
    title: "Prodajna mesta",
    image: "/prodanjo-mesto.55099_frikom_f.jpg",
    icon: {
      icon: "storefront",
      size: "1.55rem",
      class: "opacity-20 me-1",
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
      class: "opacity-20 me-1",
    },
    to: { name: "tim" },
    count: undefined,
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
    <div class="__spacer px-2 pt-2 space-y-5">
      <VCard
        v-for="item in CARDS_items"
        :key="item.title"
        max-width="412"
        link
        :to="item.to"
        class="mx-auto"
      >
        <VResponsive
          class="pa-0 ma-0 w-100 *bg-lime"
          ref="ref_tEsiXAni9GHwifLEb"
        >
          <NuxtImg
            :width="WPCard"
            height="192"
            quality="90"
            :src="item.image"
            preload
            loading="lazy"
          />
        </VResponsive>
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
