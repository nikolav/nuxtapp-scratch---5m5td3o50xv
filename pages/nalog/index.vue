<script setup lang="ts">
import { type Dayjs } from "dayjs";
import { type OrNoValue } from "@/types";
import { VBtnTopicChatToggle, VToolbarPrimary } from "@/components/app";

definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const { calcDisplayName } = useAuthUtils();
const auth = useStoreApiAuth();
const diplayName$ = computed(() => calcDisplayName(auth.user$));

// @utils
// store:pull
const { chatUserChannel } = useTopics();
const topicUserChannel = computed(() =>
  [chatUserChannel(auth.uid), "--title", kebabCase(auth.displayName)].join(" ")
);

// @head
useHead({
  title: diplayName$,
});

// @@eos
</script>
<template>
  <section class="page--nalog">
    <VToolbarPrimary
      route-back-name="index"
      :text="diplayName$"
      :props-actions="{ class: 'pe-2' }"
      :props-title="{ class: 'text-start text-body-1 ms-4' }"
      class="ma-0 pa-0"
    >
      <template #prepend>
        <Iconx
          icon="account-user-edit"
          size="1.22rem"
          class="opacity-20 ms-2 *me-1"
        />
      </template>
      <template #actions>
        <VBtnTopicChatToggle :topic="topicUserChannel" />
        <VBtn
          icon
          density="comfortable"
          :to="{ name: 'nalog-index-prilog' }"
          variant="plain"
        >
          <Iconx size="1.33rem" icon="folder-open-outline" />
        </VBtn>
      </template>
    </VToolbarPrimary>
    <NuxtPage :route-data="{ displayName: diplayName$ }" />
  </section>
</template>
<style lang="scss" scoped></style>
