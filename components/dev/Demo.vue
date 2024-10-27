<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";

const { data } = useDoc("foo:122");

const ok = async (message: any) => {};
// @@eos
</script>
<template>
  <section>
    <pre>866ca6ae-cc60-5b40-90da-c693373d3057</pre>
    <Dump :data="{ data }" />
  </section>
</template>
<style lang="scss" scoped></style>
