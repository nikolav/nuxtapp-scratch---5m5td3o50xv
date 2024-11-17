<script setup lang="ts">
// ##imports
import type { OrNoValue, IAsset } from "@/types";
// ##config:const
// ##config ##props
const props = defineProps<{ asset?: OrNoValue<IAsset>; type?: string }>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const aids = computed(() =>
  props.asset ? [Number(props.asset.id)] : undefined
);
const enabled = computed(() => !isEmpty(aids.value));
const { assets: childAssets } = useQueryManageAssets(
  props.type,
  aids,
  undefined,
  { enabled },
  {
    children: true,
  }
);
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
  <slot :assets="childAssets" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
