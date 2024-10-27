<script setup lang="ts">
// mGboFLwXJpbrJ1T
import { useDisplay } from "vuetify";
import { VFabMain, VCardDataIterator } from "@/components/app";
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

// @utils
const { smAndUp } = useDisplay();

// @data @auth
const { assets: groups, reload, processing } = useQueryManageAssetsGroups();

// @forms @helpers
const itemTo = (item: any) => ({
  name: "aktiva-grupe-gid",
  params: { gid: item?.id },
});
const {
  categoryNodeByTag,
  categoryTagByAsset,
  groups: { top: parent },
} = useCategoryAssets();
const itemGroups = (g: any) =>
  [categoryNodeByTag(categoryTagByAsset(g), parent)?.value().title].filter(
    Boolean
  );
useHead({ title: "Grupe" });
// @@eos
</script>
<template>
  <section class="page--aktiva-grupe">
    <VCardDataIterator
      :items="groups"
      item-title="name"
      :item-groups="itemGroups"
      :item-to="itemTo"
      :reload="reload"
      :card-props="{ disabled: processing }"
      :menu-props="{ 'max-height': 255 }"
      :props-title="{ class: 'ps-3 *pt-1' }"
      :props-selection="{ class: '-translate-y-[2px]' }"
      :per-page="6"
    >
      <template #list-item-title="{ title }">
        {{ title }}
      </template>
      <template #list-item-append="{ item }">
        <VBtn
          @click.stop
          density="comfortable"
          icon
          v-if="get(item, 'users.length')"
          size="small"
          variant="text"
          color="secondary-lighten-1"
          class="opacity-75 text-body-2"
        >
          <VAvatar
            color="secondary"
            size="small"
            density="compact"
            :text="get(item, 'users.length')"
          />
          <!-- @@list user names -->
        </VBtn>
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
