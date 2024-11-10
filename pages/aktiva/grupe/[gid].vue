<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VBtnTopicChatToggle,
  VBtnDotsMenuList,
} from "@/components/app";
// ##config ##const
const LIST_ITEM_CLASSES = "ps-2 pe-5";
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
const watchKEY_onMessage = useUniqueId();
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
      :props-actions="{ class: 'pe-2' }"
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
        <VBtn
          :to="{ name: 'aktiva-grupe-gid-uredi-clanove', params: { gid } }"
          density="comfortable"
          icon
          variant="text"
          size="large"
        >
          <Iconx class="ms-1" size="1.61rem" icon="account-cog" />
          <VTooltip text="Ažuriraj članove" />
        </VBtn>
        <VBtnDotsMenuList
          :props-icon="{ size: '1.5rem' }"
          :props-list="{ class: '*pe-2' }"
        >
          <template #list-items>
            <VListItem :class="LIST_ITEM_CLASSES" @click="watchKEY_onMessage">
              <template #prepend>
                <VBtnTopicChatToggle
                  density="comfortable"
                  variant="plain"
                  color="on-surface"
                  class="opacity-40"
                  :topic="topicGroupChat"
                  :watch-key="watchKEY_onMessage.ID.value"
                />
              </template>
              <VListItemTitle class="ms-1">
                <span>Poruke</span>
              </VListItemTitle>
            </VListItem>
            <VListItem
              link
              :class="LIST_ITEM_CLASSES"
              :to="{ name: 'aktiva-grupe-gid-prilog', params: { gid } }"
            >
              <template #prepend>
                <Iconx
                  class="opacity-30 mx-2"
                  size="1.5rem"
                  icon="folder-open-outline"
                />
              </template>
              <VListItemTitle class="ms-2">
                <span>Prilog</span>
              </VListItemTitle>
            </VListItem>
          </template>
        </VBtnDotsMenuList>
      </template>
    </VToolbarPrimary>
    <NuxtPage :route-data="{ g, gid, gname }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
