<script setup lang="ts">
// ##imports
import { VToolbarPrimary } from "@/components/app";
// ##config:const
// ##config ##props
defineOptions({
  inheritAttrs: false,
});
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
  <div class="__spacer mt-1 mx-2" v-bind="propsContainer">
    <VToolbarPrimary
      color="primary-lighten-1"
      rounded="pill"
      :divider-start="false"
      v-bind="$attrs"
    >
      <template #prepend="{ routeBack }">
        <VBtn :to="routeBack" icon variant="plain" density="comfortable">
          <Iconx size="1.55rem" icon="$prev" />
        </VBtn>
      </template>

      <template #title="propsTitle_">
        <slot name="title" v-bind="propsTitle_" />
      </template>
      <template #actions>
        <slot name="actions" />
      </template>
    </VToolbarPrimary>
  </div>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
