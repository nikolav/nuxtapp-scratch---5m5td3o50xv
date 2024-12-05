<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Pomoć" });
// ##provide
// ##io

import Quill from "quill";
import EE from "eventemitter3";

const ee = new EE();

const ref_iMEVdQlzJjHck = ref();
useOnceMountedOn(ref_iMEVdQlzJjHck, () => {
  nextTick(() => {
    const q = new Quill(ref_iMEVdQlzJjHck.value, {
      // debug: "info",
      modules: {
        toolbar: true,
      },
      placeholder: "Compose an epic...",
      theme: "snow",
    });
    //
    ee.on("getContents", ({ handle }) => {
      handle(q.getContents());
    });
    ee.on("getText", ({ handle }) => {
      handle(q.getText());
    });
    ee.on("getSemanticHTML", ({ handle }) => {
      handle(q.getSemanticHTML());
    });
  });
});

const ok = () => {
  // ee.emit("getContents", {
  // ee.emit("getText", {
  ee.emit("getSemanticHTML", {
    handle: (dd: any) => {
      console.log({ dd });
    },
  });
};

// @@eos
</script>
<template>
  <section class="page--help">
    <VSheet :max-width="492" class="mx-auto *overflow-visible">
      <div ref="ref_iMEVdQlzJjHck" />
    </VSheet>
    <VBtn @click="ok">ok</VBtn>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
