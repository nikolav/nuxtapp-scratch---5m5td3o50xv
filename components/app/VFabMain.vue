<script setup lang="ts">
// daVORcblZd8JD
import { useDisplay } from "vuetify";
const { smAndUp } = useDisplay();

const props = defineProps<{
  propsIcon?: any;
}>();

// @@eos
</script>
<template>
  <VFab
    absolute
    appear
    icon
    class="!fixed !z-[999]"
    :class="[smAndUp ? 'end-20 bottom-6' : 'end-6 bottom-20']"
  >
    <slot name="icon">
      <Iconx icon="$plus" v-bind="propsIcon" />
    </slot>
  </VFab>
</template>
<style lang="scss" scoped></style>
