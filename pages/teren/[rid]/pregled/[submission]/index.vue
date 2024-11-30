<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VChipUserAvatar,
  VBtnGroupTopicLikeDislike,
  VBtnTopicChatToggle,
  VCardAssetsFormReportResponse,
  SpanTruncateCharsLength,
} from "@/components/app";

// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const route = useRoute();
const { submission: submissionId } = route.params;
const form = computed(() => get(attrs, "route-data.form"));
const fid = computed(() => form.value?.id || -1);

// ##schemas
// ##utils
const { $dd } = useNuxtApp();
const { reportsLikes, reportsChat } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { reports } = useQueryReportsSearch("ids", () => [submissionId]);
// ##computed
const report = computed(() => first(reports.value));
const submId = computed(() => report.value?.id);
const response = computed(() => get(report.value, "data.response"));
const user = computed(() => report.value?.user);
const pageTitle = computed(() => `📝 Izveštaj | #${submId.value}`);

const topicReportsLikes = computed(() => reportsLikes(submId.value));
const topicReportChat = computed(() =>
  topicWithTitle(
    reportsChat(submId.value),
    `#${submId.value} | ${form.value?.name}`
  )
);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: pageTitle });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="component--teren-rid-pregled-submission">
    <VToolbarPrimary
      route-back-name="teren"
      :text="`#${report?.id} | ${startCase(form?.name)}`"
      :props-title="{ class: 'text-start ms-3 text-body-2 font-italic' }"
      :props-actions="{ class: 'pe-1' }"
    >
      <template #actions>
        <VBtnTopicChatToggle
          v-if="topicReportChat"
          density="comfortable"
          :topic="topicReportChat"
          :props-icon="{ size: '1.122rem', class: 'opacity-50' }"
        />
      </template>
      <template #prepend>
        <Iconx icon="page" size="1.22rem" class="opacity-20 ms-1" />
      </template>
    </VToolbarPrimary>
    <div class="__spacer __report-preview--B4YbGy5bNziDLe">
      <VCardText class="__spacer d-flex items-center">
        <VChipUserAvatar :user="user" />
        <VSpacer />
        <VBtnGroupTopicLikeDislike light :topic="topicReportsLikes" />
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
      <div class="__spacer">
        <VCardAssetsFormReportResponse :report="report" color="transparent" />
      </div>
      <div class="d-flex justify-center mt-12 mb-16">
        <span class="text-2xl opacity-30">•</span>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
