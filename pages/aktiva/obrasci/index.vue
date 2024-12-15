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
  "@page": {
    appClass: "bg-transparent",
    bodyClass: "CLASS--f6b8cb17-1a95-5506-a6ac-bc03f09a1a3d",
  },
});

const {
  db: {
    Assets: {
      AssetsStatus: { ACTIVE, INACTIVE },
      tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const ps = useProcessMonitor();
const { assetsIsActive, assetIsPublic, assetsFormsPublicUrl } =
  useAssetsUtils();

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
  tags: configAssetTags,
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
    // soft:rm
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
const handleFormSetShareableStatus =
  (flag = true) =>
  async (selection: any) => {
    const res = await Promise.all(
      map(
        selection,
        async (form: any) =>
          await configAssetTags(toIds(form), {
            [TAG_ASSETS_SHAREABLE_GLOBALY]: flag,
          })
      )
    );
    console.log({ res });
  };
const handleFormSetShareableOn = handleFormSetShareableStatus(true);
const handleFormSetShareableOff = handleFormSetShareableStatus(false);
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
      :item-to="itemLinkToForm"
      :reload="formsReload"
      :per-page="-1"
      hide-pagination
      :format-title="fmtTitle"
      :signal-id-deselect="resetIdDeselect.ID.value"
      :props-list="{ class: 'bg-transparent' }"
      :props-list-item="{ class: 'ps-3 pe-0 CLASS--Au3MEZtU0E8' }"
      :props-title="{ class: 'ps-3' }"
      :props-dots-menu-icon="{ size: '1.5rem' }"
    >
      <template #list-item-append="{ item: frm }">
        <span class="d-flex items-center gap-2">
          <VBtn
            v-if="assetIsPublic(frm)"
            @click.stop
            icon
            variant="plain"
            :href="assetsFormsPublicUrl(frm)"
            tag="a"
            target="_blank"
            density="comfortable"
          >
            <Iconx
              icon="external-link"
              size="1.122rem"
              class="translate-y-px"
            />
          </VBtn>
          <Iconx
            v-if="assetsIsActive(frm)"
            icon="$delimiter"
            class="text-success me-2"
          />
        </span>
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
              title: 'Blokiraj obrasce',
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
              type: 'divider',
            },
            {
              title: 'Javni obrazac',
              value: '7835488f-471c-5b8e-b030-7b1734c58921',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: 'world',
                  size: '1.22rem',
                  class: 'text-primary opacity-30 -rotate-3',
                },
                handle: () => handleFormSetShareableOn(selection),
              },
            },
            {
              title: 'Blokiraj javni pristup',
              value: 'c587a4a6-7831-566f-82d8-f4a3c7f0ad71',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  emoji: '⛔',
                  size: '1.22rem',
                  class: 'text-red opacity-30 text-sm',
                },
                handle: () => handleFormSetShareableOff(selection),
              },
            },
            {
              type: 'divider',
            },
            {
              title: 'Obriši obrasce',
              value: 'delete',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: 'trash',
                  size: '1.22rem',
                  class: 'text-error opacity-30',
                },
                handle: () => handleDelete(selection),
              },
            },
          ]"
        >
          <template #divider>
            <VDivider class="border-opacity-75" length="100%" />
          </template>
          <template #item="{ props: d }">
            <VListItem
              @click="d.handle"
              link
              :disabled="d.disabled"
              :class="['delete' == d.value ? 'mt-1' : '']"
            >
              <template #prepend>
                <span v-if="d.icon?.emoji" v-bind="d.icon">{{
                  d.icon.emoji
                }}</span>
                <Iconx v-else v-bind="d.icon" />
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
