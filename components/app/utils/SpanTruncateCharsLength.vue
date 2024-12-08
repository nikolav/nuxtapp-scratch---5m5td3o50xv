<script setup lang="ts">
// ##imports
// ##config:const
const props = withDefaults(
  defineProps<{ text: string; length?: number; elipsis?: string }>(),
  {
    length: 10,
    elipsis: "...",
    text: "",
  }
);
// ##config ##props ##route ##attrs
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// @elipsis if has more text: show; else: hide
const elipsis_ = computed(() =>
  props.length - props.elipsis.length < props.text.length ? props.elipsis : ""
);
const text_ = computed(
  () =>
    `${props.text.substring(
      0,
      clamp(props.text.length, props.length - props.elipsis.length)
    )}${elipsis_.value}`
);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <span class="component--SpanTruncateCharsLength">
    <slot :text="text_">
      {{ text_ }}
    </slot>
  </span>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
