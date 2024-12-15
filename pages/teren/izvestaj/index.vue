<script setup lang="ts">
// ##imports
import {
  VCardAssetsFormReportResponse,
  VChipUserAvatar,
  SpanTruncateCharsLength,
  VChipAssetAvatar,
} from "@/components/app";
import { Redirect } from "@/components/utils";

// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "default",
  // middleware: undefined,
});

const route = useRoute();
const rid = computed(() => route.query.q);

const {
  urls: { appPublic },
} = useAppConfig();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
const toggleIsBlocked = useToggleFlag();
// ##data ##auth ##state
const { reports, loading } = useQueryReportsSearch("ids:public", () => [
  rid.value,
]);
const report = computed(() => first(reports.value));
// ##computed
const form = computed(() => report.value?.asset);
const fid = computed(() => form.value?.id || 0);
const ttl = computed(() => `🌐 Izveštaji | #${report.value?.id}`);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
onMounted(() => {
  watch(loading, (loading) => {
    if (!loading && !report.value) toggleIsBlocked.on();
  });
});
// ##head ##meta
useHead({ title: ttl });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-prikaz">
    <Redirect v-if="toggleIsBlocked.isActive.value" :to="{ name: 'index' }" />
    <template v-else-if="report">
      <VCardText class="__spacer d-flex items-center">
        <VChipUserAvatar
          :user="report.user"
          :props-avatar="{ size: '2rem' }"
          size="default"
          class="ps-0"
        />
      </VCardText>
      <VDivider class="mt-10 mb-4 border-opacity-100 mx-auto" length="50%" />
      <div class="__spacer d-flex items-center justify-between ps-4 pe-2">
        <VChipAssetAvatar
          :asset="form"
          :item-to="{ name: 'aktiva-obrasci-fid', params: { fid } }"
          size="large"
        >
          <template #avatar>
            <span class="me-2">📝</span>
          </template>
          <SpanTruncateCharsLength :text="form?.name || ''" :length="22" />
        </VChipAssetAvatar>
        <small class="text-xs opacity-40 *font-mono font-italic">{{
          $dd.utc(report?.created_at).format("D. MMM YYYY.")
        }}</small>
      </div>
      <VSpacer class="mt-16" />
      <VCardAssetsFormReportResponse :report="report" />
      <div class="d-flex justify-center mt-12 mb-16">
        <span class="text-2xl opacity-30">•</span>
      </div>
      <VCardSubtitle class="text-end">
        <NuxtLink :href="appPublic">
          <a class="font-italic opacity-50 link--prominent">
            <small>{{ appPublic }}</small>
          </a>
        </NuxtLink>
      </VCardSubtitle>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
