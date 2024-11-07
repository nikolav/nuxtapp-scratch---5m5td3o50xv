<script setup lang="ts">
// ##imports
// ##config:const
const DEFAULT_ICON = "dots-v";
// ##config ##props
const props = defineProps<{
  propsIcon?: any;
  propsMenu?: any;
  propsList?: any;
}>();
const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();
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
  <VBtn
    density="comfortable"
    icon
    variant="plain"
    class="component--VBtnDotsMenuList"
  >
    <slot name="icon" :icon="DEFAULT_ICON">
      <Iconx size="1.33rem" :icon="DEFAULT_ICON" v-bind="propsIcon" />
    </slot>
    <VMenu
      activator="parent"
      location="bottom end"
      :transition="DEFAULT_TRANSITION"
      :offset="-12"
      v-bind="propsMenu"
      :max-width="212"
    >
      <VList v-bind="propsList">
        <slot name="list-items" />
      </VList>
    </VMenu>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
