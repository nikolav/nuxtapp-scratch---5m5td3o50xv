<script setup lang="ts">
// 8rWqBKIKsWZ4pbf1
import { Test, Dump } from "@/components/dev";

const { notificationSend: notification } = useMessagingNotification();

const ok = async () => {
  const res = await notification([1, 3, 4, 6], {
    title: `title --${idGen()}`,
    body: `body --${idGen()}`,
  });
  console.log({ res });
};
// @@eos
</script>
<template>
  <section class="*bg-red min-h-[422px] d-flex items-center justify-center">
    <VBtn @click="ok">ok</VBtn>
  </section>
</template>
<style lang="scss" scoped></style>
