<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const props = defineProps<{ isActive?: any }>();
const emit = defineEmits<{
  visible: [void];
}>();
// ##schemas
// ##utils
const ref_MspVpxJRO7d7WeA = ref();
const { stop: observerStop } = useIntersectionObserver(
  ref_MspVpxJRO7d7WeA,
  ([entry], _observer) => {
    if (entry?.isIntersecting && props.isActive) {
      emit("visible");
    }
  }
);
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
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
  <VBtn
    ref="ref_MspVpxJRO7d7WeA"
    class="component--VBtnTriggerVisible"
    @click="isActive && $emit('visible')"
  >
    <slot :observerStop="observerStop"> ok </slot>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
