<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const form = computed(() => get(attrs, "route-data.form", {}));
const fields = computed(() => get(form.value, "data.fields", []));
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
useHead({ title: "📝 Izveštaji | Popuni" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-rid-popuni">
    <h1>@teren-rid-popuni</h1>
    <template v-if="isEmpty(fields)">
      <span> 🚧 @TODO --no-form-data </span>
    </template>
    <template v-else>
      <small>
        <pre>{{ fields }}</pre>
      </small>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
