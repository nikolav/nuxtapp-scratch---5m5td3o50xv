<script setup lang="ts">
// mGboFLwXJpbrJ1T
import { useDisplay } from "vuetify";
import {
  VFabMain,
  VCardDataIterator,
  VBtnMenuListItems,
} from "@/components/app";
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

// @utils
const { smAndUp } = useDisplay();
const { showUserScreen } = useNavigationUtils();
const { calcDisplayName: calcUserDisplayName } = useAuthUtils();

// @refs @models
const selection = ref();

// @data @auth
const { assets: groups, reload, processing } = useQueryManageAssetsGroups();

// @forms @helpers
const itemTo = (item: any) => ({
  name: "aktiva-grupe-gid",
  params: { gid: item?.id },
});
const {
  categoryNode,
  groups: { top: g_top },
} = useCategoryAssets();
const itemGroups = (g: any) =>
  [get(categoryNode(g, g_top), "model.title")].filter(Boolean);

// @head
useHead({ title: "Grupe" });

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe">
    <VCardDataIterator
      v-model="selection"
      :items="groups"
      item-title="name"
      :item-groups="itemGroups"
      :item-to="itemTo"
      :reload="reload"
      :card-props="{ disabled: processing }"
      :menu-props="{ 'max-height': 255 }"
      :props-title="{ class: 'ps-3 *pt-1' }"
      :props-selection="{ class: '-translate-y-[2px]' }"
      :props-list-item="{ class: 'ps-2' }"
    >
      <template #list-item-title="{ title }">
        {{ title }}
      </template>
      <template #list-item-append="{ item }">
        <VBtnMenuListItems :items="get(item, 'users')">
          <template #title="{ item }">
            <a
              class="link--prominent text-primary-darken-1"
              @click.stop="showUserScreen(item.id)"
            >
              <span>
                {{ calcUserDisplayName(item) }}
              </span>
            </a>
          </template>
        </VBtnMenuListItems>
      </template>
      <template #menu="{ selection }">
        <VSheet elevation="3">
          <p>{{ selection?.length }}</p>
        </VSheet>
      </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-grupe-nova' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
