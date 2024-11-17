<script setup lang="ts">
// ##imports
import { Iconx } from "@/components/icons";
// ##config
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  topic?: any;
  main?: boolean;
  propsIcon?: any;
  watchKey?: any;
}>();

// ##utils
const { TOPIC_CHAT_ACTIVE_main } = useTopics();
// ##icons
// ##refs ##flags
const {
  topic: topicCurrent,
  isActive,
  topicSet,
} = useGlobalVariableChatActive();
// ##data ##auth ##state
// ##computed
// ##forms ##helpers ##handlers
const topic_ = () => {
  topicSet(true === props.main ? TOPIC_CHAT_ACTIVE_main : props.topic);
};
// ##watch
watch(() => props.watchKey, topic_);
// ##hooks:lifecycle
// ##head

// @@eos
</script>
<template>
  <slot :isActive="isActive">
    <VBtn
      @click="topic_"
      icon
      class="component--VBtnTopicChatToggle"
      size="large"
      v-bind="$attrs"
    >
      <slot name="icon" :isActive="isActive" :props="propsIcon">
        <Iconx size="1.33rem" icon="chat" v-bind="propsIcon" />
      </slot>
    </VBtn>
  </slot>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
