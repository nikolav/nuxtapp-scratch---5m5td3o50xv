<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import { VFabMain, VCardDataIterator } from "@/components/app";
import type { IAsset } from "@/types";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  db: {
    Assets: {
      AssetsStatus: { ACTIVE, INACTIVE },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const ps = useProcessMonitor();
const { assetsIsActive } = useAssetsUtils();

// ##icons
// ##refs ##flags ##models
const formsSelected = ref();
const toggleFormsDeletedSuccess = useToggleFlag();
const resetIdDeselect = useUniqueId();

// ##data ##auth ##state
const {
  assets: forms,
  processing,
  reload: formsReload,
  remove: formsRemove,
  commit,
} = useQueryManageAssetsForms();

// ##computed
// ##forms ##handlers ##helpers ##small-utils
const itemLinkToForm = (item: any) => ({
  name: "aktiva-obrasci-fid",
  params: { fid: item?.id },
});
const fmtTitle = (f: any) => startCase(f?.name);
const handleDelete = async (selection: any) => {
  try {
    ps.begin(toggleFormsDeletedSuccess.off);
    const rm_aids = map(selection, toIds);
    if (isEmpty(rm_aids)) throw "--assets:chats:remove-failed";
    if (get(await formsRemove(rm_aids), "data.assetsRemove.error"))
      throw "--assets:chats:remove-failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      toggleFormsDeletedSuccess.on();
      resetIdDeselect();
    });
};
const handleFormsActivationStatus =
  (status: string) => async (selection: any) => {
    const res = await Promise.all(
      map(
        selection,
        async (asset: IAsset) => await commit({ status }, asset.id)
      )
    );
    resetIdDeselect();
    console.log({ res });
  };
const handleFormsActivate = handleFormsActivationStatus(ACTIVE);
const handleFormsDeactivate = handleFormsActivationStatus(INACTIVE);
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Obrasci" });

// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-obrasci">
    <VCardDataIterator
      v-model="formsSelected"
      :items="forms"
      :card-props="{ disabled: processing }"
      item-title="name"
      :item-to="itemLinkToForm"
      :reload="formsReload"
      :per-page="-1"
      hide-pagination
      :format-title="fmtTitle"
      :signal-id-deselect="resetIdDeselect.ID.value"
      :props-list-item="{ class: 'ps-3 CLASS--Au3MEZtU0E8' }"
      :props-title="{ class: 'ps-3' }"
    >
      <template #list-item-append="{ item: frm }">
        <Iconx
          v-if="assetsIsActive(frm)"
          icon="$delimiter"
          class="text-success"
        />
      </template>
      <template #menu="{ selection }">
        <VList
          class="py-0 CLASS--eI26B"
          :items="[
            {
              title: 'Aktiviraj obrasce',
              value: '55639594-2115-54a2-996e-c531852a92d0',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: '$delimiter',
                  size: '1.22rem',
                  class: 'text-green *opacity-30',
                },
                handle: () => handleFormsActivate(selection),
              },
            },
            {
              title: 'Deaktiviraj obrasce',
              value: 'bfb9e8b2-42ff-5cdd-8dac-5e9b93eb489d',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: '$delimiter',
                  size: '1.22rem',
                  class: 'text-red *opacity-30',
                },
                handle: () => handleFormsDeactivate(selection),
              },
            },
            {
              title: 'Obriši obrasce',
              value: 'fe7d09fd-6422-5b9d-8d4a-db9d7771ff5b',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: 'trash',
                  size: '1.122rem',
                  class: 'text-error opacity-30',
                },
                handle: () => handleDelete(selection),
              },
            },
          ]"
        >
          <template #divider>
            <VDivider class="border-opacity-100" length="100%" />
          </template>
          <template #item="{ props: d }">
            <VListItem @click="d.handle" link :disabled="d.disabled">
              <template #prepend>
                <Iconx v-bind="d.icon" />
              </template>
              <template #title>
                <VListItemTitle class="ms-3">{{
                  startCase(d.title)
                }}</VListItemTitle>
              </template>
            </VListItem>
          </template>
        </VList>
      </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-obrasci-nov' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.CLASS--eI26B .v-list-item__prepend .v-list-item__spacer {
  width: 0.5rem !important;
}
.CLASS--Au3MEZtU0E8 .v-list-item__append .v-list-item__spacer {
  width: 1% !important;
}
</style>
