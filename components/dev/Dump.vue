<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ data: any }>();

const d$ = computed(() => {
  try {
    return JSON.stringify(props.data, null, 2);
  } catch (error) {
    // pass
  }
  return props.data;
});
watchEffect(() => {
  console.log("Debug data:", props.data);
});
// @@eos
</script>
<template>
  <section class="component--dev.Dump">
    <small>
      <pre v-bind="$attrs">{{ d$ }}</pre>
    </small>
  </section>
</template>
<style lang="scss" scoped>
.component--dev\.Dump {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: .33rem;
  font-size: 0.9rem;
  color: #333;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
