<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
defineOptions({
  inheritAttrs: false,
});
const emit = defineEmits<{
  commit: [string];
}>();
const props = defineProps<{
  getData?: any;
  propsBtn?: any;
}>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
const data = ref();
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
onMounted(() => {
  if (props.getData) {
    props.getData((fmt: any) => {
      data.value = fmt?.link;
    });
  }
});
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VForm @submit.prevent="$emit('commit', data)" class="pa-0 ma-0">
    <VCardItem class="pa-0 ma-0">
      <VTextField
        v-model="data"
        hide-details
        variant="plain"
        single-line
        clearable
        class="component--VTextFieldPromptBasic grow"
        v-bind="$attrs"
      />
      <template #append>
        <VBtn type="submit" icon variant="text" color="on-surface" v-bind="propsBtn">ok</VBtn>
      </template>
    </VCardItem>
  </VForm>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
