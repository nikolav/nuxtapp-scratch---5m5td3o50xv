<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const props = defineProps<{
  type?: string;
  category?: string;
}>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const count = useQueryAssetsCount(props.type, undefined, props.category);
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <slot :count="count" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
