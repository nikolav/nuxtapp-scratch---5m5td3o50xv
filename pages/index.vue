<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config ##const
definePageMeta({
  layout: "app-default",
  // middleware: "",
});
// ##utils
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const { data } = useFirebaseCloudFirestoreCollection("demo");
// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head
useHead({ title: "--index" });

// @@eos
</script>
<template>
  <section class="page--index">
    <h1>@index</h1>
    <p class="text-blue-400">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet omnis
      fuga accusantium ipsum, odio molestiae at reprehenderit deleniti aperiam
      dolore fugit veniam dolor perferendis magni error aliquid maxime. Error,
      veritatis.
    </p>
    <p class="text-blue-400">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eveniet omnis
      fuga accusantium ipsum, odio molestiae at reprehenderit deleniti aperiam
      dolore fugit veniam dolor perferendis magni error aliquid maxime. Error,
      veritatis.
    </p>
  </section>
  <Dump :data="{ data }" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
