<script setup lang="ts">
// ##imports
import { z } from "zod";
import { useDisplay } from "vuetify";
import type { IConfigFields } from "@/types";
import {
  VToolbarPrimary,
  VDataIteratorListData,
  VEmptyStateNoData,
  VBtnReset,
  VBtnSave,
  VBtnOpenGallery,
} from "@/components/app";

// ##config:const
const DEFAULT_PANEL_HEIGHT_CONFIG_VIBER = 192;
// ##config ##props ##route ##attrs
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  signalIdDeselect?: any;
}>();

const {
  layout: { toolbarMainHeight },
  app: { BODY_ADD_CLASS, DEFAULT_TRANSITION },
} = useAppConfig();

const sizeBtnToolbar = toolbarMainHeight - 2;
// ##schemas
const schemaChannelsInfoInput = z.object({
  channelName: z.string(),
  auth_token: z.string(),
  is_global: z.optional(z.boolean()),
});
// ##utils
const { smAndUp } = useDisplay();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const toggleDialogChannelsAddActive = useToggleFlag();
const channels = defineModel<any>();
const channelsSelected = ref();
const clientViber = useViberChannels();
watchEffect(() =>
  useIOEvent(clientViber.cache.IO.value, clientViber.cache.reload)
);

// ##data ##auth ##state
const auth = useStoreApiAuth();
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const clearSelection = () => {
  channelsSelected.value = undefined;
};
const FIELDS = <Record<string, IConfigFields>>{
  channelName: {
    required: true,
    label: "Naziv kanala",
    icon: {
      icon: "tag",
      size: "1rem",
      class: "opacity-20 translate-y-1 me-1",
    },
    props: {
      variant: "underlined",
      clearable: true,
      placeholder: "Isti kao u Viber aplikaciji...",
    },
  },
  auth_token: {
    required: true,
    label: "Ključ",
    icon: {
      icon: "hashtag",
      size: "1rem",
      class: "opacity-20 *translate-y-1 *me-1",
    },
    props: {
      variant: "underlined",
      clearable: true,
      placeholder: "Viber podešavanja za kanal...",
    },
  },
  is_global: {
    type: "checkbox",
    label: "Javni kanal, svi vide",
    props: {
      color: "primary",
    },
  },
};
const form = useFormModel(
  "viber:channels:add:428438fd-6105-57ae-a9f4-2c7305daeb0d",
  FIELDS,
  {
    schema: schemaChannelsInfoInput,
    onSubmit: async (dd: any) => {
      return await clientViber.configure.set_webhook(
        dd.channelName,
        dd.auth_token,
        dd.is_global,
        async () => {
          // @success
          form.clear();
          toggleDialogChannelsAddActive.off();
          await clientViber.cache.reload();
        }
      );
    },
  }
);
const viberChannelsDrop = async () => {
  try {
    ps.begin();
    if (
      !get(
        await clientViber.configure.channels_drop(...channelsSelected.value),
        "data.viberChannelSetupChannelsDrop.status"
      )
    )
      throw "viberChannelsDrop:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(async () => {
      clearSelection();
      await clientViber.cache.reload();
    });
};
// ##watch
watch(
  () => props.signalIdDeselect,
  (ID) => {
    if (ID) clearSelection();
  }
);
watchEffect(() => {
  channels.value = keys(clientViber.cache.store.value);
});
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VSheet
    color="transparent"
    elevation="0"
    rounded="0"
    class="component--VSheetCrudViberChannels"
  >
    <VDialog
      :attach="`.${BODY_ADD_CLASS}`"
      v-model="toggleDialogChannelsAddActive.isActive.value"
      :fullscreen="!smAndUp"
      location="center center"
      persistent
      no-click-animation
      :transition="DEFAULT_TRANSITION"
      :scrim="smAndUp"
    >
      <VForm @submit.prevent="form.submit">
        <VCard>
          <VToolbarPrimary
            :props-title="{ class: 'text-body-1 font-italic' }"
            :on-close="toggleDialogChannelsAddActive.off"
            :divider-start="false"
          >
            <template #title>
              <span class="d-inline-flex items-center gap-1 flex-wrap">
                <span
                  >Poveži Viber<small class="opacity-50">&#169;</small>
                  kanale</span
                >
                <VBtnOpenGallery
                  color="on-primary"
                  variant="text"
                  :show-badge="false"
                  :slides="[{ src: '/viber-dev-tools.png' }]"
                >
                  <template #icon>
                    <Iconx icon="help" size="1.33rem" />
                  </template>
                </VBtnOpenGallery>
              </span>
            </template>
            <template #prepend>
              <VBtn
                @click="toggleDialogChannelsAddActive.off"
                icon
                variant="plain"
                size="small"
              >
                <Iconx icon="$prev" size="1.5rem" />
              </VBtn>
            </template>
          </VToolbarPrimary>
          <VCardText>
            <VSpacer class="mt-2" />
            <div class="__spacer space-y-4">
              <template v-for="(item, field) in FIELDS" :key="field">
                <VTextField
                  v-if="!item.type"
                  v-model="form.data[field].value"
                  :label="item.label"
                  v-bind="item.props"
                >
                  <template #label="{ label }">
                    <span>{{ label }}</span>
                    <span v-if="item.required" class="text-error"> *</span>
                  </template>
                  <template #prepend-inner>
                    <Iconx v-bind="item.icon" />
                  </template>
                </VTextField>
                <VCheckbox
                  v-else-if="'checkbox' == item.type"
                  v-model="form.data[field].value"
                  :label="item.label"
                  v-bind="item.props"
                />
              </template>
            </div>
          </VCardText>
          <VCardActions class="py-4 px-5">
            <VBtnReset @click="toggleDialogChannelsAddActive.off">
              <Iconx icon="$close" size="1.22rem" class="me-1" />
              <span>Odustani</span>
            </VBtnReset>
            <VSpacer />
            <VBtnSave :disabled="!form.valid.value" variant="elevated" />
          </VCardActions>
        </VCard>
      </VForm>
    </VDialog>
    <VToolbarPrimary color="transparent" hide-default-close class="pe-3">
      <template #default>
        <VSpacer />
        <div class="__spacer space-x-5">
          <VBtn
            @click="toggleDialogChannelsAddActive.on"
            :size="sizeBtnToolbar"
            variant="plain"
            icon
          >
            <Iconx icon="$plus" />
          </VBtn>
          <VBtn
            :disabled="isEmpty(channelsSelected)"
            @click="viberChannelsDrop"
            :size="sizeBtnToolbar"
            variant="plain"
            icon
            color="error"
          >
            <Iconx icon="$minus" />
          </VBtn>
          <VBtn
            @click="clientViber.cache.reload"
            icon
            size="small"
            variant="plain"
            class="opacity-50"
          >
            <Iconx icon="$loading" size="1.122rem" />
          </VBtn>
        </div>
      </template>
    </VToolbarPrimary>
    <VEmptyStateNoData v-if="isEmpty(channels)" class="opacity-30" disabled />
    <VResponsive
      v-else
      :height="DEFAULT_PANEL_HEIGHT_CONFIG_VIBER"
      class="overflow-y-auto"
    >
      <VDataIteratorListData
        v-if="!isEmpty(channels)"
        v-model="channelsSelected"
        :items="channels"
        :item-title="identity"
        :props-list="{ class: 'py-0', density: 'compact' }"
        :props-list-item="{ link: false, class: 'ps-2' }"
        :props-list-item-title="{
          class: 'ms-2 font-italic font-weight-medium opacity-85',
        }"
        v-bind="$attrs"
      />
    </VResponsive>
  </VSheet>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
