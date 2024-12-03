<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";

const {
  commit,
  IO: cacheIO,
  reload,
  cache
} = useCacheRedis("KEY_viber:KEY_user:57eaccbe-a20d-5419-9b7b-16af927dce87");

watchEffect(() => useIOEvent(cacheIO.value, reload));

const ok = async () => await commit({ bar: idGen() });

// @@eos
</script>
<template>
  <section class="component--Demo">
    <h1>🚧</h1>
    <VBtn @click="ok">ok</VBtn>
    <Dump :data="{ cache }" />
  </section>
</template>
<style lang="scss" scoped></style>
