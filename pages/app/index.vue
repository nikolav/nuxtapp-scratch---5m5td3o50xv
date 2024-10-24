<script setup lang="ts">
// ##imports
// ##config ##const
definePageMeta({
  layout: "app-default",
});
// ##utils
// ##icons
// ##refs ##flags
const counter = ref(0);
// ##data ##auth ##state
// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head
useHead({ title: "--about" });
watchEffect(() => {
  console.log(get({ counter: counter.value }, "counter"));
});
// @@eos
</script>
<template>
  <section class="page--about">
    <h1>@app</h1>
    <pre>Counter is: [{{ counter }}]</pre>
    <button @click="counter++">ok</button>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
