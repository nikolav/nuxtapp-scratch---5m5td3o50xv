<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const route = useRoute();
const { oid: OID } = route.params;
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const enabled = computed(() => !!OID);
const { assets: posts } = useQueryManageAssetsPosts(() => [OID], undefined, {
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
