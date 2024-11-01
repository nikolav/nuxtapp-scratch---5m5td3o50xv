<script setup lang="ts">
// ##imports
// ##config ##const
const props = withDefaults(defineProps<{ tag?: any; handleAdd?: any }>(), {
  handleAdd: noop,
});
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
  <VBtn
    size="small"
    @click="handleAdd"
    elevation="1"
    color="primary-lighten-1"
    variant="tonal"
    rounded="pill"
    class="component--VBtnUsersTagsAdd ps-3"
  >
    <template #prepend>
      <Iconx size="1.33rem" icon="$plus" />
    </template>
    <em class="*ms-2 text-none">{{ tag }}</em>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
