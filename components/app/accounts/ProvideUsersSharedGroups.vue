<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { users: usersCommonGroups } = useQueryUsersSearch("groups-shared");
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
  <slot :users="usersCommonGroups" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
