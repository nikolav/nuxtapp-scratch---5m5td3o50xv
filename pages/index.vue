<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";

// ##config ##const
definePageMeta({
  layout: "app-default",
  // middleware: "",
});
// ##utils
const { $toast } = useNuxtApp();
// ##icons
// ##refs ##flags
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
    <VBtn @click="$toast('ok')"> ok </VBtn>
    <Dump :data="{ dataNuxtApiStatus, statusApollo, data }" />
    <NuxtImg src="/apples.jpg" width="555" height="122" fit="contain" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
