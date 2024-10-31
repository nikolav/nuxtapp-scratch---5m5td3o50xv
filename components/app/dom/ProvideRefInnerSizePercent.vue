<script setup lang="ts">
// #9efa436d-4375-5ad5-8d8b-d3e42d6afe97
// ##imports
// ##config ##const
const props = withDefaults(
  defineProps<{
    percent?: any;
    // Component | Element
    refLookup?: any;
  }>(),
  {
    percent: 0.99,
  }
);
// ##utils
const el$$ = computed(() => get(props.refLookup, "$el", props.refLookup));
const { width: W, height: H } = useElementSize(el$$);
const sideMin = computed(() => Math.min(W.value, H.value));
const size_ = computed(() => Math.round(sideMin.value * Number(props.percent)));

// ##icons
// ##refs ##flags
// ##data ##auth ##state
// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide

// @@eos
</script>
<template>
  <slot :size="size_" :sideMin="sideMin" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
