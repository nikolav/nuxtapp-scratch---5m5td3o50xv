<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";

const gid = computed(() => 1);
const enabled = computed(() => !!gid.value);
const gvars = computed(() => ({ gids: [gid.value] }));

const { users } = useQueryUsersSearch("g", gvars, { enabled });

const ok = async () => {};
// @@eos
</script>
<template>
  <section class="component--Demo">
    <VBtn @click="ok">ok</VBtn>
    <Dump :data="{ users }" />
  </section>
</template>
<style lang="scss" scoped></style>
