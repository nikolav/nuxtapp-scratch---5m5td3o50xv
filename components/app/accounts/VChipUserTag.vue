<script setup lang="ts">
// ##imports
// ##config ##const
const props = withDefaults(
  defineProps<{ tag: string; color?: any; handleClear?: any }>(),
  {
    color: "warning-darken-2",
    handleClear: noop,
  }
);
// ##utils
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
  <VChip
    variant="tonal"
    :color="color"
    elevation="1"
    class="component--VChipUserTag"
  >
    <strong>
      {{ tag }}
    </strong>
    <template #close>
      <slot name="close" :color="color" :text="tag" :handleClear="handleClear">
        <span class="ma-0 pa-0 ms-n1">
          <VBtn
            @click.stop="handleClear"
            :color="color"
            variant="plain"
            icon
            density="compact"
          >
            <Iconx size="1.22rem" icon="$close" />
          </VBtn>
        </span>
      </slot>
    </template>
  </VChip>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
