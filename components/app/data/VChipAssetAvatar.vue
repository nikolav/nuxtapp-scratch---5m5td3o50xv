<script setup lang="ts">
// ##imports
// ##config:const
const DEFAULT_format_title = (asset?: any) => startCase(asset?.name || "");
// ##config ##props ##route ##attrs ##form-fields
const props = defineProps<{ asset?: any; itemTo?: any; formatTitle?: any }>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { avatarImage } = useFirebaseStorageAssetsGroupAvatar(
  () => props.asset?.key
);
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// :to="{ name: 'aktiva-grupe-gid', params: { gid: asset?.id } }"
// @@eos
</script>
<template>
  <VChip
    :text="(formatTitle || DEFAULT_format_title)(asset)"
    color="info"
    elevation="1"
    :to="itemTo"
    :prepend-avatar="avatarImage"
    size="x-large"
  >
    <template v-if="$slots.avatar" #prepend>
      <slot name="avatar" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </VChip>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
