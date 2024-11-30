<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
const props = defineProps<{ propsIcon?: any }>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
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
  <VBtn
    icon
    variant="plain"
    color="on-surface"
    class="component--VBtnPanelClose position-absolute top-0 end-0"
  >
    <slot name="icon">
      <Iconx icon="$close" v-bind="propsIcon" />
    </slot>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
