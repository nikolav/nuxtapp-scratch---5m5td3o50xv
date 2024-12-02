<script setup lang="ts">
// ##imports
// ##config:const

// ##config ##props ##route ##attrs
const props = defineProps<{ user: any }>();

// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { groups } = useQueryGroupsByUser(() => toIds(props.user));
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
  <slot :groups="groups" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
