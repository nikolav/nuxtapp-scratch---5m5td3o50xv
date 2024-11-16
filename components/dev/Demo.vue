<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";
const {
  db: {
    Assets: {
      type: { PHYSICAL_STORE },
    },
  },
} = useAppConfig();
const ok = async () => {};
const q = ref();
const search = ref();
watch(
  search,
  debounce((search: string) => {
    if (search) {
      q.value = search;
    }
  }, 1234)
);

const { assets, reload } = useQueryAssetsSearch(q, PHYSICAL_STORE, 5);

// @@eos
</script>
<template>
  <section class="component--Demo">
    <VTextField v-model="search" />
    <VBtn @click="ok">ok</VBtn>
    <VBtn @click="reload">reload</VBtn>
    <Dump :data="{ assets }" />
  </section>
</template>
<style lang="scss" scoped></style>
