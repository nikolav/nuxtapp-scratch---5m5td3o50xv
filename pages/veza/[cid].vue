<script setup lang="ts">
// ##imports
import { VToolbarPrimary, VBtnTopicChatToggle } from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

// ##schemas
// ##utils
const route = useRoute();
const param_cid = computed(() => get(route.params, "cid"));
const { assetsDigitalChannel } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const enabled = computed(() => !!param_cid.value);
const { assets } = useQueryManageAssetsComms(() => [param_cid.value], false, {
  enabled,
});
// ##computed
const channel = computed(() => first(assets.value));
const cid = computed(() => channel.value?.id);
const topicCH = computed(() =>
  topicWithTitle(assetsDigitalChannel(channel.value?.key), channel.value?.name)
);
// ##forms ##handlers ##helpers
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// useHead({ title: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza-cid">
    <VToolbarPrimary
      :text="startCase(channel?.name)"
      route-back-name="veza"
      :props-title="{ class: 'text-body-1 text-start' }"
      :props-actions="{ class: 'pe-2' }"
      class="ma-0 pa-0"
    >
      <template #prepend>
        <Iconx icon="headset" size="1.55rem" class="opacity-20 mx-1" />
      </template>
      <template #actions>
        <VBtnTopicChatToggle :topic="topicCH" />
        <VBtn
          :to="{ name: 'veza-cid-prilog', params: { cid } }"
          icon
          density="comfortable"
          variant="plain"
        >
          <Iconx icon="$file" size="1.22rem" />
        </VBtn>
      </template>
    </VToolbarPrimary>
    <NuxtPage :route-data="{ channel }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
