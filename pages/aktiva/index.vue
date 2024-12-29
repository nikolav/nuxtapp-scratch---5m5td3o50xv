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
    props: {
      class: "CLASS--paxXfBzGu",
    },
  },
  {
    title: "Tim",
    image: "/tim.2024-11-23 04_07_39-Window.png",
    // image: "/tim.2.png",
    // image: "/tim.3.png",
    icon: {
      icon: "people-groups",
      size: "1.88rem",
      class: "opacity-20 *me-1",
    },
    to: { name: "tim" },
    count: undefined,
    props: {
      class: "CLASS--JwRxXZJ4V",
    },
  },
  {
    title: "Izveštaji",
    // image: "/forms.yhoMIMv7yr.png",
    image: "/forms.y37RA68d8i.jpg",
    icon: {
      icon: "task",
      size: "1.55rem",
      class: "opacity-20 *me-1",
    },
    to: { name: "teren" },
    props: { class: "CLASS-mPGeyycY7qSc0WvQ" },
  },
  {
    title: "Zadaci",
    image: "/zadaci.XhXD2gvSvy.png",
    icon: {
      icon: "task-alt",
      size: "1.55rem",
      class: "opacity-20",
    },
    to: { name: "zadaci" },
    props: {
      class: "CLASS--SG0adFum",
    },
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
    props: { class: "CLASS-X3PZhHeI4n" },
  },
  {
    title: "Kontakti",
    image: "/kontakti.5ij49SIlMz.png",
    icon: {
      icon: "user",
      size: "1.55rem",
      class: "opacity-20",
    },
    to: { name: "kontakti" },
    props: {
      class: "CLASS--SUW5rCN6V9",
    },
  },
  {
    title: "Veza",
    image: "/veza.zm0JgOtXYA.png",
    icon: {
      icon: "headset",
      size: "1.55rem",
      class: "opacity-20 me-1",
    },
    to: { name: "veza" },
    props: { class: "bg-top" },
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
        <VImg height="192" :src="item.image" cover v-bind="item.props" />
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
<style lang="scss">
.CLASS--JwRxXZJ4V {
  img {
    // object-position: 0 18% !important;
    // object-position: 0 5% !important;
  }
}
.CLASS-mPGeyycY7qSc0WvQ {
  img {
    object-position: 0 45% !important;
  }
}
.CLASS-X3PZhHeI4n {
  img {
    object-position: 0 3% !important;
  }
}
.CLASS--paxXfBzGu {
  img {
    object-position: 0 78% !important;
  }
}
.CLASS--SUW5rCN6V9 {
  img {
    object-position: 0 32% !important;
    transform: scale(102%) rotate(-2deg);
  }
}
.CLASS--SG0adFum {
  img {
    object-position: 0 22% !important;
    transform: scale(111%) rotate(1deg);
  }
}
</style>
