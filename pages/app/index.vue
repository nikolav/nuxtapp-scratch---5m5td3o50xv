<script setup lang="ts">
// ##imports
import { VFabMain } from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
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
useHead({ title: "👷🏻‍♂️ Frikom teren ", titleTemplate: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--dashboard">
    <h1>🚧app</h1>
    <div>
      <NuxtLink :to="{ name: 'app-objave-oid', params: { oid: 153 } }">
        <a class="link--prominent">@153</a>
      </NuxtLink>
    </div>
    <VFabMain
      color="surface"
      elevation="5"
      size="large"
      :to="{ name: 'app-objave-nova' }"
    >
      <template #icon>
        <strong class="text-xl rotate-3"><pre>📄</pre></strong>
      </template>
    </VFabMain>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
