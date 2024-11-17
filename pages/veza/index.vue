<script setup lang="ts">
// ##imports
import {
  VFabMain,
  VCardDataIterator,
  VBtnTopicChatToggle,
} from "@/components/app";
import type { IAsset } from "@/types";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const { assetsDigitalChannel } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { assets: channels, reload } = useQueryManageAssetsComms(undefined, true);
// ##computed
// ##forms ##handlers ##helpers
const itemTo = (ch: IAsset) => ({
  name: "veza-cid",
  params: { cid: ch.id },
});
const topicCH = (ch: any) =>
  topicWithTitle(assetsDigitalChannel(ch.key), ch.name);
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Veza" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza">
    <VCardDataIterator
      :items="channels"
      :reload="reload"
      :item-to="itemTo"
      item-title="name"
      item-value="id"
      :card-props="{ class: 'pa-0 ma-0' }"
      :props-list="{ class: 'ps-0 ms-0' }"
      :props-list-item="{
        class: 'ps-3',
      }"
      :props-title="{ class: 'ms-3' }"
    >
      <template #list-item-append="{ item: channel_ }">
        <VBtnTopicChatToggle
          :topic="topicCH(channel_)"
          elevation="1"
          density="comfortable"
          variant="text"
        />
      </template>
    </VCardDataIterator>
    <VFabMain :to="{ name: 'veza-nov-kanal' }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
