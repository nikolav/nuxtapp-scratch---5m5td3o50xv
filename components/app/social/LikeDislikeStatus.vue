<script setup lang="ts">
const props = defineProps<{ topic?: string; propsContainer?: any }>();
const { likesCount, dislikesCount } = useTopicLikeDislike(() => props.topic);
// @@eos
</script>
<template>
  <em
    class="component--LikeDislikeStatus d-inline-flex items-center gap-2 opacity-50"
    v-bind="propsContainer"
  >
    <!-- @@likes -->
    <span class="d-inline-flex items-center gap-1">
      <Iconx class="text-success-darken-3" icon="thumb" />
      <pre style="font-size: 81%" class="d-inline-block">{{ likesCount }}</pre>
    </span>

    <!-- @@dislikes -->
    <span class="d-inline-flex items-center gap-1">
      <Iconx class="text-error-darken-2 rotate-180" icon="thumb" />
      <pre style="font-size: 81%" class="d-inline-block">{{
        dislikesCount
      }}</pre>
    </span>
  </em>
</template>
<style lang="scss" scoped></style>
