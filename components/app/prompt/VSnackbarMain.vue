<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const {
  app: { DEFAULT_TRANSITION, BODY_ADD_CLASS },
} = useAppConfig();
const props = defineProps<{
  propsCardItem?: any;
}>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const mActive = defineModel<boolean>();
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
  <VSnackbar
    v-model="mActive"
    :attach="`.${BODY_ADD_CLASS}`"
    :activator="undefined"
    rounded="0"
    tile
    width="100%"
    :transition="DEFAULT_TRANSITION"
    location="top"
    class="mt-0 mx-0 CLASS--e4e88e85-2554-5bd8-ab1f-3feb5cead0bb"
  >
    <VCardItem class="pe-2" v-bind="propsCardItem">
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>
      <template #append>
        <slot name="append">
          <VBtn
            @click="mActive = false"
            icon
            color="surface"
            density="comfortable"
            variant="plain"
          >
            <Iconx icon="$close" />
          </VBtn>
        </slot>
      </template>
      <slot />
    </VCardItem>
  </VSnackbar>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.CLASS--e4e88e85-2554-5bd8-ab1f-3feb5cead0bb .v-snackbar__content {
  padding: 0;
}
</style>
