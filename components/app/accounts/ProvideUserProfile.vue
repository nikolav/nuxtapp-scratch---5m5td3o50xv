<script setup lang="ts">
// ##imports
// ##config
const props = defineProps<{ uid: any; includeExternal?: boolean }>();
// ##utils
// ##icons
// ##refs
// ##state ##data ##auth
const auth = useStoreApiAuth();
const isUserOther = computed(
  () => props.uid && auth.uid && props.uid != auth.uid
);
const { users } = useQueryUsers(
  () => [props.uid],
  isUserOther,
  () => [props.includeExternal]
);
// ##computed
const user = computed(() =>
  isUserOther.value ? first(users.value) : auth.user$
);
const profile = computed(() => user.value?.profile);
// ##forms ##helpers
// ##watch
// ##hooks:lifecycle

// @@eos
</script>
<template>
  <slot :user="user" :profile="profile" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
