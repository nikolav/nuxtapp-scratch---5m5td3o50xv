<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ topic?: any; propsContainer?: any }>();

const { rating } = useTopicRating(() => props.topic);

// @@eos
</script>
<template>
  <em
    class="component--TopicRatingStatus d-inline-flex items-center opacity-50"
    v-bind="propsContainer"
  >
    <Iconx
      class="*opacity-30"
      size="small"
      icon="star-circle"
      v-bind="$attrs"
    />
    <pre class="ms-1" style="font-size: 92%">{{ rating }}</pre>
  </em>
</template>
<style lang="scss" scoped></style>
