<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VChipUserAvatar,
  VBtnGroupTopicLikeDislike,
  VBtnTopicChatToggle,
  VCardAssetsFormReportResponse,
  SpanTruncateCharsLength,
  VChipAssetAvatar,
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
const { publicUrl: reportsPublicUrl, isPublic: reportsIsPublic } =
  useReportsUtils();
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
const user = computed(() => report.value?.user);
const pageTitle = computed(() => `📝 Izveštaj | #${submId.value}`);
const publicUrl = computed(() => reportsPublicUrl(report.value));
const isPublic = computed(() => reportsIsPublic(report.value));

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
        <!-- @@ -->
        <VBtn
          v-if="isPublic"
          :href="publicUrl"
          icon
          variant="plain"
          density="comfortable"
          tag="a"
          target="_blank"
          class="opacity-50"
        >
          <Iconx size="1rem" icon="external-link" />
        </VBtn>
      </template>
      <template #prepend>
        <Iconx icon="page" size="1.22rem" class="opacity-20 ms-1" />
      </template>
    </VToolbarPrimary>
    <div class="__spacer __report-preview--B4YbGy5bNziDLe">
      <VCardText class="__spacer d-flex items-center">
        <VChipUserAvatar
          :user="user"
          :props-avatar="{ size: '2.75rem' }"
          size="x-large"
          class="ps-0"
        />
        <VSpacer />
        <VBtnGroupTopicLikeDislike light :topic="topicReportsLikes" />
      </VCardText>
      <VDivider class="mt-10 mb-4 border-opacity-100 mx-auto" length="50%" />
      <div class="__spacer d-flex items-center justify-between ps-4 pe-2">
        <VChipAssetAvatar
          :asset="form"
          :item-to="{ name: 'aktiva-obrasci-fid', params: { fid } }"
          size="default"
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
<style lang="scss">
.VList--IjZ4A9a5NazJEMJyI .v-list-item__prepend .v-list-item__spacer {
  width: 1rem !important;
}
</style>
