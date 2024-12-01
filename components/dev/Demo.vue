<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";

const { submissions } = useQueryAssetsFormsSubmissionsSearch();
// @@eos
</script>
<template>
  <section class="component--Demo">
    <h1>🚧</h1>
    <Dump :data="{ submissions }" />
  </section>
</template>
<style lang="scss" scoped></style>
