<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import {
  VToolbarSecondary,
  VDataIteratorListData,
  VFabMain,
  VSnackbarSuccess,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const gid = computed(() => get(attrs, "route-data.gid"));
// const g = computed(() => routeData.value?.g);
// const gid = computed(() => routeData.value?.gid);
// const gname = computed(() => routeData.value?.gname);
const enabled = computed(() => !!gid.value);

const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
  db: {
    Assets: {
      type: { DIGITAL_CHAT },
    },
  },
} = useAppConfig();

// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const qsearch = useGlobalVariable(
  "qsearch:d5e6cbb3-1ce8-56e2-af90-ba91411f3fa8"
);
const searchText = ref();
const channelsSelected = ref();
const toggleChannelCGSuccess = useToggleFlag();
// ##data ##auth ##state
const { assets: matchedChannels } = useQueryAssetsSearch(qsearch, DIGITAL_CHAT);
const { channelsCGConfig } = useQueryManageAssets(
  undefined,
  () => [gid.value],
  true,
  { enabled }
);
// ##computed
const someChannelsSelected = computed(() => !isEmpty(channelsSelected.value));
const configurationCG = computed(() =>
  someChannelsSelected.value && gid.value
    ? {
        [`${map(channelsSelected.value, (c: IAsset) => `+${c.id}`).join(" ")}`]:
          [Number(gid.value)],
      }
    : undefined
);
// ##forms ##handlers ##helpers
const itemTitle = (ch: IAsset) => startCase(ch.name);
const itemTo = (ch: IAsset) => ({ name: "veza-cid", params: { cid: ch.id } });
const cgConfigure = async () => {
  const cg = configurationCG.value;
  if (isEmpty(cg)) return;
  try {
    ps.begin(toggleChannelCGSuccess.off);
    if (get(await channelsCGConfig(cg), "data.channelsCGConfig.error"))
      throw "cgConfig:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(toggleChannelCGSuccess.on);
};
// ##watch
watch(
  searchText,
  debounce((searchText: string) => {
    if (searchText) {
      qsearch.value = searchText;
    }
  }, SEARCH_DEBOUNCE_DELAY_longer)
);
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Kanali" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-kanali-dodaj">
    <VSnackbarSuccess v-model="toggleChannelCGSuccess.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>
    <VToolbarSecondary
      :route-back-to="{ name: 'aktiva-grupe-gid-kanali', params: { gid } }"
      :props-title="{ class: '*bg-red grow ma-0 pa-s' }"
    >
      <template #title>
        <VTextField
          v-model="searchText"
          variant="underlined"
          density="compact"
          rounded="pill"
          placeholder="Traži kanal..."
          hide-details
          single-line
          clearable
          autofocus
          class="grow ma-0 pa-0 mb-2 px-2 text-body-2"
        >
          <template #prepend-inner>
            <Iconx
              size="1.122rem"
              class="opacity-20 translate-y-px me-1"
              icon="search"
            /> </template
        ></VTextField>
      </template>
    </VToolbarSecondary>
    <VDataIteratorListData
      v-model="channelsSelected"
      :items="matchedChannels"
      :item-title="itemTitle"
      :item-to="itemTo"
      :disabled-skeleton-loader="!qsearch"
      :props-list="{ density: 'compact', class: 'py-0 ps-0' }"
      :props-list-item="{ class: 'ms-0 *ps-4' }"
      :props-list-item-title="{ class: 'ps-0 ms-2' }"
    />
    <VFabMain
      v-if="someChannelsSelected"
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      @click="cgConfigure"
    >
      <template #icon>
        <Iconx size="1.5rem" icon="link" />
      </template>
    </VFabMain>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.page--aktiva-grupe-gid-kanali-dodaj .v-field__input {
  @include placeholder-with-prefix {
    font-style: italic;
    font-size: 0.95rem;
    opacity: 0.33;
  }
}
</style>
