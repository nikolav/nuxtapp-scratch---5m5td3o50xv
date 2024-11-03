<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";

const { store: cache, commit } = useCacheRedis("foo");

const ok = async () => {
  const res = await commit({
    foo: `--${idGen()}`,
  });
  console.log({ res });
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
