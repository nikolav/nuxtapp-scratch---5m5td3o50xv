<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { Effect } from "@/components/ui";

// ##config ##const
definePageMeta({
  layout: "app-default",
  // middleware: "",
});
// ##utils
// ##icons
// ##refs ##flags
const effectID = useUniqueId();
// ##data ##auth ##state
const { data: dataNuxtApiStatus } = useNuxtApiStatus();
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
    <VBtn @click="auth.login({ email: 'admin@nikolav.rs', password: '122' })">
      <Iconx name="$menu" />
      login
    </VBtn>
    <VBtn @click="auth.logout"> logout </VBtn>
    <VBtn @click="effectID"> effect </VBtn>
    <Effect v-model="effectID.ID">
      <h1>@index</h1>
    </Effect>
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
    <Dump :data="{ dataNuxtApiStatus, statusApollo, data }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
