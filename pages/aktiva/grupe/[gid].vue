<script setup lang="ts">
// ##imports
import { VToolbarPrimary, VBtnTopicChatToggle } from "@/components/app";
// ##config ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { TOOLTIPS_OPEN_DELAY },
} = useAppConfig();
// ##utils
const route = useRoute();
const { chatAssets } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const { assets: groups } = useQueryManageAssetsGroups(() => [route.params.gid]);
// ##computed
const g = computed(() => first(groups.value));
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name || "");
// const members = computed(() => g.value?.users || []);
const topicGroupChat = computed(() =>
  topicWithTitle(chatAssets(gid.value), gname.value)
);

// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid">
    <VToolbarPrimary
      :props-actions="{ class: 'pe-3' }"
      :props-title="{
        class: 'ms-3 text-start text-body-1 font-italic',
      }"
      :text="g?.name"
      route-back-name="aktiva-grupe"
    >
      <template #prepend>
        <Iconx
          class="opacity-20 mx-1 ms-2"
          size="1.33rem"
          icon="people-groups"
        />
      </template>
      <template #actions>
        <VBtnTopicChatToggle density="comfortable" :topic="topicGroupChat" />
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-uredi-clanove', params: { gid } }"
          density="comfortable"
          icon
          variant="text"
          size="large"
        >
          <Iconx class="ms-1" size="1.33rem" icon="account-user-edit" />
          <VTooltip
            activator="parent"
            text="Uredi članove"
            :open-delay="TOOLTIPS_OPEN_DELAY"
            location="bottom"
          />
        </VBtn>
      </template>
    </VToolbarPrimary>
    <NuxtPage />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
