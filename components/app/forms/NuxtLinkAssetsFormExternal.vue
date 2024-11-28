<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
const props = defineProps<{ node: any }>();
// ##schemas
// ##utils
const { ICONS_ASSETS_FORMS_type } = useIconsConfig();
// ##icons
// ##refs ##flags ##models
const mLink = defineModel();
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
watchEffect(() => {
  mLink.value = props.node.model$.data.link;
});
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <NuxtLink :href="mLink" target="_blank">
    <VCardItem>
      <template #prepend>
        <Iconx v-bind="ICONS_ASSETS_FORMS_type[node.model$.type]" />
      </template>
      <a
        class="link--prominent ms-1 d-flex items-center gap-1 text-primary-darken-1"
      >
        <Iconx icon="external-link" class="opacity-40" size=".88rem" />
        <span v-bind="node.props">
          {{ node.label }}
        </span>
      </a>
    </VCardItem>
  </NuxtLink>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
