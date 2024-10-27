<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";

const { data, reload } = useDoc("foo:122");

const ok = async (message: any) => {};
// @@eos
</script>
<template>
  <section>
    <VBtn @click="reload">ok</VBtn>
    <div class="p-4 bg-stone-600/20">866ca6ae-cc60-5b40-90da-c693373d3057</div>
    <Dump :data="{ data }" />
  </section>
</template>
<style lang="scss" scoped></style>
