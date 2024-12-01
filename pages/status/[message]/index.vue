<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const route = useRoute();
const attrs$ = useAttrs();
const message = computed(() => get(attrs$, "route-data.message"));
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
useHead({ title: "✅" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--status-message-index">
    <VEmptyState v-bind="message.props">
      <template #media>
        <VSpacer class="mt-2" />
        <Iconx v-bind="message.icon" />
        <VSpacer class="mt-4" />
      </template>
      <template #actions>
        <VCardActions class="pa-5">
          <NuxtLink :to="message.action.to">
            <VBtn
              rounded="pill"
              size="large"
              class="px-5 text-none"
              variant="elevated"
              elevation="2"
            >
              {{ message.action.text }}
            </VBtn>
          </NuxtLink>
        </VCardActions>
      </template>
    </VEmptyState>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
