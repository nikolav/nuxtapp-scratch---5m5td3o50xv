<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const route = useRoute();
const oid = computed(() => Number(route.params.oid));
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const enabled = computed(() => !!oid.value);
const { assets: posts } = useQueryManageAssetsPosts(() => [oid.value], false, {
  enabled,
});
const post = computed(() => first(posts.value));
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// useHead({ title: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-oid">
    <NuxtPage :route-data="{ post }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
