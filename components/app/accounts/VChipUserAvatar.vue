<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
const props = defineProps<{ user: any; tooltip?: any }>();
// ##schemas
// ##utils
const { calcDisplayName } = useAuthUtils();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const uname = computed(() => calcDisplayName(props.user) || "");
const uid = computed(() => props.user?.id);
const avatar = computed(() => get(props.user, "profile.avatarImage"));
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VChip
    @click.stop
    class="component--VChipUserAvatar px-3"
    variant="tonal"
    color="info"
    elevation="1"
    :to="{ name: 'tim-uid', params: { uid } }"
  >
    <template v-if="avatar" #prepend>
      <VAvatar :image="avatar" size="1.33rem" />
    </template>
    <VListItemTitle class="text-body-1 ms-2">{{ uname }}</VListItemTitle>
    <slot v-if="tooltip" name="tooltip" :tooltip="tooltip">
      <VTooltip :text="tooltip" />
    </slot>
  </VChip>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
