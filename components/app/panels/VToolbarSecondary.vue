<script setup lang="ts">
// ##imports
import { VToolbarPrimary } from "@/components/app";
// ##config:const
// ##config ##props
const props = defineProps<{
  propsContainer?: any;
}>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VToolbarPrimary
    color="transparent"
    :divider-start="false"
    :props-title="{ class: 'text-body-1 text-start ms-0 ps-2' }"
    hide-default-close
  >
    <template #title="propsTitle_">
      <slot name="title" v-bind="propsTitle_" />
    </template>
    <template #actions>
      <slot name="actions" />
    </template>
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <slot />
  </VToolbarPrimary>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
