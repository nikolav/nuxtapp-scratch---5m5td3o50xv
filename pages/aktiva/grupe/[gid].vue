<script setup lang="ts">
// 86ef32ec-f9e2-5988-9dc7-bd77a9665ab3
// ##imports
import { useDisplay } from "vuetify";
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
// ##utils
const { width: VW } = useDisplay();
const route = useRoute();
const GID = computed(() => route.params.gid);
const enabled = computed(() => !!GID.value);
const { chatAssets } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const { assets: groups, reload: gReload } = useQueryManageAssetsGroups(
  () => [GID.value],
  undefined,
  { enabled }
);
// ##computed
const g = computed(() => first(groups.value));
const gid = computed(() => g.value?.id);
// const gkey = computed(() => g.value?.key);
const gname = computed(() => g.value?.name || "");
const topicGroupChat = computed(() =>
  topicWithTitle(chatAssets(gid.value), gname.value)
);

// ##forms ##helpers ##handlers
const MENU = [
  {
    value: "_info",
    to: { name: "aktiva-grupe-gid", params: { gid: gid.value } },
    icon: {
      icon: "$info",
      size: "1.22rem",
      class: "",
    },
    props: {},
  },
  {
    value: "users",
    to: { name: "aktiva-grupe-gid-uredi-clanove", params: { gid: gid.value } },
    icon: {
      icon: "account-cog",
      size: "1.5rem",
      class: "",
    },
    props: {},
  },
  {
    value: "sites",
    to: { name: "aktiva-grupe-gid-sites", params: { gid: gid.value } },
    icon: {
      icon: "storefront",
      size: "1.33rem",
      class: "",
    },
    props: {},
  },
  {
    value: "forms",
    to: { name: "aktiva-grupe-gid-obrasci", params: { gid: gid.value } },
    icon: {
      icon: "$iconAppCogFill",
      size: "1.22rem",
      class: "",
    },
    props: {},
  },
  {
    value: "chats",
    to: { name: "aktiva-grupe-gid-kanali", params: { gid: gid.value } },
    icon: {
      icon: "headset",
      size: "1.42rem",
      class: "",
    },
    props: {},
  },
  {
    value: "cal",
    to: { name: "aktiva-grupe-gid-kalendar", params: { gid: gid.value } },
    icon: {
      icon: "$calendar",
      size: "1.42rem",
      class: "",
    },
    props: {},
  },
  {
    value: "files",
    to: { name: "aktiva-grupe-gid-prilog", params: { gid: gid.value } },
    icon: {
      icon: "folder-open-outline",
      size: "1.42rem",
      class: "",
    },
    props: {},
  },
];
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid">
    <VToolbarPrimary
      :props-title="{ class: 'text-start ms-0 opacity-90' }"
      route-back-name="aktiva-grupe"
      hide-default-close
      class="py-[2px]"
    >
      <template #title>
        <VSheet
          color="transparent"
          class="ma-0 pa-0 grow d-flex justify-between items-center"
        >
          <VBtn
            v-for="item in MENU"
            :key="item.value"
            :to="item.to"
            icon
            variant="plain"
            size="small"
            :density="333 < VW ? undefined : 'comfortable'"
            v-bind="item.props"
          >
            <Iconx v-bind="item.icon" />
          </VBtn>
          <VBtnTopicChatToggle
            size="small"
            variant="plain"
            :topic="topicGroupChat"
          />
        </VSheet>
      </template>
    </VToolbarPrimary>
    <NuxtPage :route-data="{ g, gReload }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--UHBFcD8MGgeMNNVG .v-list-item__prepend .v-list-item__spacer {
  width: 0.33rem !important;
}
</style>
