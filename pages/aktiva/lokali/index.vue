<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import {
  VFabMain,
  VCardDataIterator,
  TopicRatingStatus,
  VSheetPinCodeRequired,
} from "@/components/app";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  app: { BODY_ADD_CLASS },
} = useAppConfig();
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const {
  sites: { itemCategories: sitesItemGroups, logo: sitesLogo },
} = useCategoryAssets();
const { ratingAssets } = useTopics();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const sitesSelected = ref();
const toggleMenuPinCodeRequiredOnRemove = useToggleFlag();
// ##data ##auth ##state
const {
  assets: sites,
  processing,
  reload: sitesReload,
  remove: assetsSitesRemove,
} = useQueryManageAssetsSites(undefined, true);

// ##computed
// ##forms ##handlers ##helpers
const itemLinkToSite = (item: any) => ({
  name: "aktiva-lokali-sid",
  params: { sid: item.id },
});
const fmtTitle = (s: any) => startCase(s.name);
const handleAssetsSitesRemove = async () => {
  console.log({ sitesSelected: sitesSelected.value });
};
const selectionClearSitesSelected = () => {
  sitesSelected.value = undefined;
};
const handleSitesOnDelete = async () => {
  try {
    ps.begin();
    const sids_rm = map(sitesSelected.value, toIds);
    if (isEmpty(sids_rm)) throw "--assetsSites:remove:failed";
    if (get(await assetsSitesRemove(sids_rm), "data.assetsRemove.error"))
      throw "--assetsSites:remove:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      selectionClearSitesSelected();
      toggleMenuPinCodeRequiredOnRemove.off();
    });
};
// v-bind placement :positioned
const placement_g18RyJ52W1O0EdVo = usePanelPlacedViewport();
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Lokali" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali">
    <VMenu
      v-model="toggleMenuPinCodeRequiredOnRemove.isActive.value"
      :activator="undefined"
      :attach="`.${BODY_ADD_CLASS}`"
      :close-on-content-click="false"
      v-bind="placement_g18RyJ52W1O0EdVo"
    >
      <VSheetPinCodeRequired
        :max-width="undefined"
        message="Pin za brisanje lokala:"
      >
        <template #actions="{ text, pin }">
          <VBtn
            @click="handleSitesOnDelete"
            color="error"
            variant="tonal"
            :disabled="text != pin"
            rounded="pill"
            class="px-3"
          >
            <Iconx icon="trash" size="1.22rem" class="opacity-85" />
            <span class="ms-1">Obriši lokale</span>
          </VBtn>
        </template>
      </VSheetPinCodeRequired>
    </VMenu>
    <VCardDataIterator
      v-model="sitesSelected"
      :items="sites"
      :card-props="{ disabled: processing }"
      item-title="name"
      :item-to="itemLinkToSite"
      :item-groups="sitesItemGroups"
      :reload="sitesReload"
      :format-title="fmtTitle"
      :items-per-page="-1"
      hide-pagination
      :props-list-item="{ class: 'ms-0 ps-2' }"
      :props-title="{ class: 'ms-2 ps-0' }"
      :props-selection="{ class: '-translate-y-px' }"
      :props-dots-menu-icon="{ size: '1.5rem' }"
    >
      <template #menu>
        <VList
          :items="[
            {
              title: 'Obriši lokale',
              value: 'fc4f010b-3077-5385-b817-3e8395776294',
              props: {
                class: '',
                icon: {
                  icon: 'trash',
                  class: 'text-error opacity-30',
                  size: '1.122rem',
                },
                handle: toggleMenuPinCodeRequiredOnRemove.on,
              },
            },
          ]"
          class="VList--VB6GdDjL266qeJ6 py-0"
        >
          <template #divider>
            <VDivider class="border-opacity-100" length="100%" />
          </template>
          <template #item="{ props: d }">
            <VListItem @click="d.handle" link>
              <template #prepend>
                <Iconx v-bind="d.icon" />
              </template>
              <VListItemTitle>{{ d.title }}</VListItemTitle>
            </VListItem>
          </template>
        </VList>
      </template>
      <template #list-item-append="{ item: site }">
        <TopicRatingStatus
          :topic="ratingAssets(get(site, 'key'))"
          class="text-warning-darken-1"
          size="1.122rem"
        />
      </template>
      <template #list-item-title="{ item: site }">
        <span class="d-flex items-center gap-4">
          <VAvatar
            :image="sitesLogo(site)"
            size="small"
            density="comfortable"
          />
          <span>{{ fmtTitle(site) }}</span>
        </span>
      </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-lokali-nov' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.VList--VB6GdDjL266qeJ6 .v-list-item__prepend {
  min-width: 2rem;
}
</style>
