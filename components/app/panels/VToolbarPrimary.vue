<script setup lang="ts">
// 4c522173-c6d5-57d6-a60e-a832fafaf384
const props = withDefaults(
  defineProps<{
    routeBackName?: string;
    routeBackTo?: any;
    dividerStart?: boolean;
    text?: any;
    onClose?: any;
    propsTitle?: any;
    propsActions?: any;
    hideDefaultClose?: boolean;
  }>(),
  {
    routeBackName: "aktiva-proizvodi",
    dividerStart: true,
  }
);
const {
  layout: { toolbarMainHeight },
} = useAppConfig();
const ROUTE_BACK = props.routeBackTo || { name: props.routeBackName };
// @@eos
</script>
<template>
  <VToolbar
    flat
    :height="toolbarMainHeight"
    color="primary"
    class="component--VToolbarPrimary"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" :routeBack="ROUTE_BACK" />
      <VDivider v-if="dividerStart" class="ms-2" vertical inset />
    </template>
    <template #append>
      <VToolbarItems v-bind="propsActions">
        <slot name="actions" />
      </VToolbarItems>
      <template v-if="!hideDefaultClose">
        <slot name="append" :toRoutePrev="ROUTE_BACK" :onClose="onClose">
          <VBtn
            @click="onClose"
            size="small"
            :to="onClose ? undefined : ROUTE_BACK"
            icon="$close"
            variant="plain"
            density="comfortable"
          />
        </slot>
      </template>
    </template>
    <slot :text="text">
      <VToolbarTitle
        class="text-center opacity-50 font-weight-light"
        v-bind="propsTitle"
      >
        <slot name="title" :text="text">
          <span>{{ text }}</span>
        </slot>
      </VToolbarTitle>
    </slot>
  </VToolbar>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
