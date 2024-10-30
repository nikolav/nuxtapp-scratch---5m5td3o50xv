<script setup lang="ts">
// ##imports
// ##config ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##utils
// ##icons
// ##refs ##flags
// ##data ##auth ##state
// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide
useHead({ title: "O aplikaciji" });

// @@eos
</script>
<template>
  <section class="page--about">
    <NuxtLink
      href="https://github.com/nikolav/nuxtapp-scratch---5m5td3o50xv/tree/frikom-app"
      external
      target="_blank"
    >
      <div class="d-flex justify-end">
        <VListItem>
          <template #prepend>
            <Iconx size="2rem" icon="uil:github" />
          </template>
          <VListItemTitle class="ps-2">
            <a class="link--prominent text-primary-darken-2"> frikom-app </a>
          </VListItemTitle>
        </VListItem>
      </div>
    </NuxtLink>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam non dolorem
      sit minima reiciendis magni libero illum, suscipit ab molestiae. Nemo
      reprehenderit veniam, omnis molestiae velit officiis atque incidunt fugit.
    </p>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
