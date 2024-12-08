<script setup lang="ts">
// ##imports
import { VSheetChatItemSimple, VEmptyStateNoData } from "@/components/app";
// ##config
const emit = defineEmits<{
  (e: "chatMessagesInit"): void;
}>();
const props = defineProps<{ propsContainer?: any }>();
// ##utils
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const { chat, length: chatSize, remove } = useDocsTopicChat();
// ##computed
// ##forms ##helpers ##handlers
const id_ = (node: any) => get(node, "raw.id");
// ##watch
useOnceMountedOn(chatSize, () => {
  emit("chatMessagesInit");
});
// ##hooks:lifecycle
// ##head

// @@eos
</script>
<template>
  <VDataIterator
    class="component--VDataIteratorRenderChatSimple"
    :items="chat"
    :items-per-page="-1"
  >
    <template #no-data>
      <VEmptyStateNoData class="opacity-40" />
    </template>
    <template #default="{ items }">
      <div class="__spacer space-y-4" v-bind="propsContainer">
        <template v-for="node in items" :key="id_(node)">
          <VSheetChatItemSimple
            :remove="() => remove(id_(node))"
            :item="node.raw"
          />
        </template>
      </div>
    </template>
  </VDataIterator>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
