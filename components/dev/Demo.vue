<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";
import { VDialogManageUserTags } from "@/components/app";

const { commit } = useMutationUsersTags();
const toggleDialog = useToggleFlag();
const ok = async () => {
  const res = await commit({ "1": { "foo.1": false } });
  console.log({ res });
};
// @@eos
</script>
<template>
  <section class="*bg-red min-h-[422px] d-flex items-center justify-center">
    <VBtn @click="ok">ok</VBtn>
    <VBtn @click="toggleDialog">dialog</VBtn>
    <VDialogManageUserTags v-model="toggleDialog.isActive.value" />
  </section>
</template>
<style lang="scss" scoped></style>
