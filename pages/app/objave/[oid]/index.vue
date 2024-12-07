<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const post = computed(() => get(attrs, "route-data.post"));
const pageTitle = computed(() => `📃 ${post.value?.name}`);
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const clientStorage = useFirebaseStorageAssetImages(() => post.value?.key);
// ##computed
const postImages = computed(() => clientStorage.images.value);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: pageTitle });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-oid-index">
    <VImg
      v-for="image in postImages"
      :key="image"
      :width="122"
      :height="122"
      :src="image"
      cover
    />
    <Dump :data="{ images: postImages, post }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
