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
const auth = useStoreApiAuth();
const { data } = useFirebaseCloudFirestoreCollection("demo");
const { status: statusApollo } = useQueryApolloStatus();
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
    <button
      class="p-2 bg-stone-200 rounded shadow-md border border-stone-300"
      @click="auth.login({ email: 'admin@nikolav.rs', password: '122' })"
    >
      login
    </button>
    <button
      class="p-2 bg-stone-200 rounded shadow-md border border-stone-300"
      @click="auth.logout"
    >
      logout
    </button>
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
  <Dump :data="{ statusApollo, data }" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
