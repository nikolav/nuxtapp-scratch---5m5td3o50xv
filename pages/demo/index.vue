<script setup lang="ts">
// ##imports
import EE from "eventemitter3";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "default",
  // middleware: "access-debug",
});
// ##schemas
// ##utils
const $emitter = new EE();
$emitter.on("foo", (...args: any[]) => {
  console.log({ "foo:args": args });
});
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "🚧Demo" });
// ##provide
// ##io
// @@eos
</script>
<template>
  <section class="page--demo">
    <h1>🚧</h1>
    <VBtn @click="$emitter.emit('foo', 122)">ok </VBtn>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
