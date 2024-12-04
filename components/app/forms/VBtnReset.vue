<script setup lang="ts">
// ##imports
// ##config
const props = withDefaults(defineProps<{ propsIcon?: any; text?: any }>(), {
  text: "Poništi",
});
// ##utils
// ##icons
// ##refs ##flags
// ##state ##data ##auth
// ##computed
// ##forms ##helpers
// ##watch
// ##hooks:lifecycle

// @@eos
</script>
<template>
  <VBtn color="secondary" variant="plain" rounded="pill" class="px-3">
    <slot>
      <Iconx size="1.44rem" icon="rubber" v-bind="propsIcon" />
      <slot name="text" :text="text">
        <span> {{ text }} </span>
      </slot>
    </slot>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
