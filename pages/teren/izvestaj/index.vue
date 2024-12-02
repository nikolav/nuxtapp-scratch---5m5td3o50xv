<script setup lang="ts">
// ##imports
import {
  VCardAssetsFormReportResponse,
  VChipUserAvatar,
  SpanTruncateCharsLength,
} from "@/components/app";

// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "default",
  // middleware: undefined,
});

const route = useRoute();
const { q: rid } = route.query;

const {
  urls: { appPublic },
} = useAppConfig();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { reports } = useQueryReportsSearch("ids:public", () => [rid]);
const report = computed(() => first(reports.value));
// ##computed
const form = computed(() => report.value?.asset);
const fid = computed(() => form.value?.id || 0);
const ttl = computed(() => `🌐 Izveštaji | #${report.value?.id}`);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: ttl });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-prikaz">
    <template v-if="report">
      <VCardText class="__spacer d-flex items-center">
        <VChipUserAvatar :user="report.user" />
        <VSpacer />
        <NuxtLink :href="appPublic">
          <a
            class="link--prominent text-primary-darken-1 font-italic opacity-40"
          >
            <small>@{{ appPublic }}</small>
          </a>
        </NuxtLink>
      </VCardText>
      <VDivider class="mt-10 mb-4 border-opacity-100 mx-auto" length="50%" />
      <div class="__spacer d-flex items-center justify-between ps-4 pe-2">
        <VChip
          link
          :to="{ name: 'aktiva-obrasci-fid', params: { fid } }"
          size="small"
          elevation="1"
          color="primary"
        >
          <template #prepend>
            <small class="me-1">📝</small>
          </template>
          <SpanTruncateCharsLength :text="form?.name || ''" :length="22" />
        </VChip>
        <small class="text-xs opacity-40 *font-mono font-italic">{{
          $dd.utc(report?.created_at).format("D. MMM YYYY.")
        }}</small>
      </div>
      <VSpacer class="mt-16" />
      <VCardAssetsFormReportResponse :report="report" />
      <div class="d-flex justify-center mt-12 mb-16">
        <span class="text-2xl opacity-30">•</span>
      </div>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
