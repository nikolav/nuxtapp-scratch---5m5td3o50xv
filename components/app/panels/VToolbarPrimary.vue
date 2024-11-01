<script setup lang="ts">
// 4c522173-c6d5-57d6-a60e-a832fafaf384
const props = withDefaults(
  defineProps<{
    routeBackName?: string;
    routeBackTo?: any;
    dividerStart?: boolean;
    text?: any;
    propsTitle?: any;
    propsActions?: any;
    onClose?: any;
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
    :height="toolbarMainHeight"
    class="component--VToolbarPrimary"
    color="primary"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
      <VDivider v-if="dividerStart" vertical inset class="ms-2" />
    </template>
    <template #append>
      <VToolbarItems v-bind="propsActions">
        <slot name="actions" />
      </VToolbarItems>
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
