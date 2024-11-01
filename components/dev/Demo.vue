<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";
import { VDialogManageUsersTags } from "@/components/app";

const uids = [1];

const { commit, tags, search } = useMutationUsersTags();
const toggleDialog = useToggleFlag();
const ok = async () => {
  const res = await commit({ "1": { "bar.2": true } });
  console.log({ res });
};
// @@eos
</script>
<template>
  <section class="component--Demo">
    <div>
      <VTextField v-model="search" label="tags:search" clearable />
    </div>
    <VBtn @click="ok">ok</VBtn>
    <VBtn @click="toggleDialog">dialog</VBtn>
    <VDialogManageUsersTags
      v-model="toggleDialog.isActive.value"
      v-model:uids="uids"
    />
    <Dump :data="{ tags }" />
  </section>
</template>
<style lang="scss" scoped></style>
