<script setup lang="ts">
// ##imports
import { VToolbarPrimary } from "@/components/app";
// ##config ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##utils
const route = useRoute();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const { assets: groups } = useQueryManageAssetsGroups(
  () => [route.params.gid],
  true
);
// ##computed
const g = computed(() => first(groups.value));
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name || "");
const ttl = computed(() => `Ažuriraj članove: ${gname.value}`);
// const members = computed(() => g.value?.users || []);
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide
useHead({ title: ttl });

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-uredi-clanove">
    <div class="__sizer pa-1">
      <VToolbarPrimary
        :route-back-to="routeBackTo"
        density="comfortable"
        elevation="1"
        rounded="pill"
        color="primary-lighten-2"
        class="opacity-75"
      >
        <template #prepend>
          <VBtn
            :to="routeBackTo"
            size="small"
            density="comfortable"
            icon
            variant="plain"
          >
            <Iconx size="large" icon="$prev" />
          </VBtn>
        </template>
      </VToolbarPrimary>
    </div>
    <h1>grupe:uredi-clanove</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem facilis
      expedita quidem?
    </p>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
