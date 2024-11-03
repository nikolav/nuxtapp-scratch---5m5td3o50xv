<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";

const { cache, commit } = useCacheRedis("foo");

const ok = async () => {
  await commit({
    bar: `bax --${idGen()}`,
  });
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
