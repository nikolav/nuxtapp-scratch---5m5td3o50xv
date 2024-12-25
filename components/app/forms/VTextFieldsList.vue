<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const mItems = defineModel<{ key: string; contact: any }[]>();
const props = defineProps<{ propsTextField?: any }>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const hasItems = computed(() => !isEmpty(mItems.value));
// ##forms ##handlers ##helpers ##small-utils
const itemsAdd = () => {
  mItems.value = [...(mItems.value || []), { key: uuid(), contact: undefined }];
};
const itemsDrop = (item: any) => {
  mItems.value = filter(mItems.value, (it: any) => item.key != it.key);
};
const onModelValue = (item: any, v: any) => {
  mItems.value = map(mItems.value, (it: any) =>
    item.key == it.key ? { ...it, contact: v } : it
  );
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <div class="component--VTextFieldsList">
    <div v-if="mItems && hasItems" class="__spacer">
      <slot name="label">
        <small class="opacity-50 ps-2">Kontakti</small>
      </slot>

      <VTextField
        v-for="item in mItems"
        :key="item.key"
        :model-value="item.contact"
        @update:model-value="(v) => onModelValue(item, v)"
        variant="underlined"
        hide-details
        center-affix
        density="comfortable"
        v-bind="propsTextField"
      >
        <template #append-inner>
          <VBtn
            @click="itemsDrop(item)"
            icon
            small
            color="error"
            variant="plain"
            density="comfortable"
          >
            <Iconx icon="$minus" size="1.22rem" />
          </VBtn>
        </template>
      </VTextField>
    </div>
    <VSpacer class="mt-5" />
    <VCardActions class="justify-center">
      <VBtn @click="itemsAdd" icon size="x-large" variant="tonal" elevation="1">
        <Iconx icon="$plus" size="2.25rem" />
      </VBtn>
    </VCardActions>
  </div>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
