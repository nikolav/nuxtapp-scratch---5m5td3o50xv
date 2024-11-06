<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";

const { cache, commit } = useCacheRedis("7e919100-b940-5b7b-91ce-861a9923c722");
const ok = async () => {
  await commit({ "dev:0": `--${idGen()}` });
};
// @@eos
</script>
<template>
  <section class="component--Demo">
    <VBtn @click="ok">ok</VBtn>
    <Dump :data="{ cache }" />
  </section>
</template>
<style lang="scss" scoped></style>
