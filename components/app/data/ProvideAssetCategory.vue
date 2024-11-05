<script setup lang="ts">
// ##imports
// ##config
const props = defineProps<{ asset?: any }>();

// ##utils
const { categoryNodeByTag, categoryTagByAsset } = useCategoryAssets();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
// ##computed
const categoryNodeModel = computed(() =>
  omit(categoryNodeByTag(categoryTagByAsset(props.asset))?.model, "children")
);

// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head

// @@eos
</script>
<template>
  <slot v-bind="categoryNodeModel" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
