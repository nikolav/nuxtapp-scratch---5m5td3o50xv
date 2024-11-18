<script setup lang="ts">
import { useDisplay } from "vuetify";
import { AuthLogin } from "@/components/app/auth";
import { Redirect } from "@/components/utils";
import { VToolbarWelcome } from "@/components/app";

const { height: WH } = useDisplay();
// @@ss
const auth = useStoreApiAuth();
// @@eos
</script>
<template>
  <section class="page--index">
    <Redirect v-if="auth.isAuthenticated$" :to="{ name: 'app' }" />
    <template v-else>
      <VToolbarWelcome />
      <VResponsive
        max-width="598"
        class="mx-auto -translate-y-[50%]"
        :style="`margin-top: ${WH / 2}px;`"
      >
        <AuthLogin />
      </VResponsive>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
