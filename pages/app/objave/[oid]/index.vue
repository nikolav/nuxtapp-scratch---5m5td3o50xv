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
// ##computed
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
    <h1>🚧</h1>
    <Dump :data="{ post }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
