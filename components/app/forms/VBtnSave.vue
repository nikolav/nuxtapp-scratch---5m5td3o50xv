<script setup lang="ts">
// ##imports
// ##config
const props = withDefaults(
  defineProps<{ propsIcon?: any; text?: any; propsText?: any }>(),
  {
    text: "Sačuvaj",
  }
);
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
  <VBtn
    elevation="1"
    size="large"
    variant="tonal"
    rounded="pill"
    class="px-4"
    type="submit"
  >
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <slot>
      <Iconx
        class="opacity-40 me-2"
        size="1.44rem"
        icon="save"
        v-bind="propsIcon"
      />
      <span v-bind="propsText">{{ text }}</span>
    </slot>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
