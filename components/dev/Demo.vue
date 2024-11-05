<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";
import mp from "~/assets/app/categories.assets.products.json";

const ok = async () => {
  const t = new TreeModel();
  const node = t.parse({ title: "#root", key: "", emoji: "", children: mp });
  console.log(node);
};
// @@eos
</script>
<template>
  <section class="component--Demo">
    <VBtn @click="ok">ok</VBtn>
    <Dump :data="{}" />
  </section>
</template>
<style lang="scss" scoped></style>
