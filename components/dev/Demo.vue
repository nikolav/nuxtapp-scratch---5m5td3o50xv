<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";

const { users } = useQueryUsers(() => [1]);
const u = computed(() => first(users.value));
const image = computed(() => get(u.value, "profile.avatarImage"));
// @@eos
</script>
<template>
  <section class="component--Demo">
    <VAvatar density="compact" text="L" color="on-surface" :image="image" />
    <Dump :data="{ user: u }" />
  </section>
</template>
<style lang="scss" scoped></style>
