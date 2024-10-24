<script setup lang="ts">
// ##imports
// ##config ##const
// ##utils
// ##icons
// ##refs ##flags
// ##data ##auth ##state
// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head
// useHead({ title: "" });

// @@eos
</script>
<template>
  <section class="root---app-vue">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.BLUR-enter-active,
.BLUR-leave-active {
  transition: all 0.122s;
}

.BLUR-enter-from,
.BLUR-leave-to {
  opacity: 0;
  filter: blur(0.122rem);
}

.BLUR-leave-active {
  position: absolute;
  z-index: -1;
  width: 100%;
}
</style>
