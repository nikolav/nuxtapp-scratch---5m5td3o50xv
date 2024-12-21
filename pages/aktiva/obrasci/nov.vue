<script setup lang="ts">
// 02ca166b-9f1a-5c30-8a9d-11566b1d2b64
// ##imports
import {
  VToolbarPrimary,
  VBtnSave,
  VBtnReset,
  VCardAssetsDigitalFormField,
  VCardTitleSectionStart,
  VSnackbarMain,
  VBtnPanelClose,
  VFormRenderAssetsFormFields,
} from "@/components/app";
import type { IConfigFields } from "@/types";
import { useDisplay } from "vuetify";

// ##config:const
const DEFAULT_DRAWER_WIDTH = 382;
const DEFAULT_MENU_WIDTH = 312;
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  db: {
    Assets: { DigitalFormFieldTypes },
  },
} = useAppConfig();
// ##schemas
const FIELDS = <Record<string, IConfigFields>>{
  name: {
    required: true,
    label: "Naziv upitnika",
    icon: {
      name: "tag",
      size: "1rem",
      props: {
        class: "me-1 opacity-20 translate-y-[2px]",
      },
    },
    props: {
      variant: "underlined",
      hideDetails: true,
    },
  },
  notes: {
    type: "textarea",
    label: "Opis",
    icon: {
      name: "$edit",
      size: "1rem",
      props: {
        class: "opacity-20 mt-1",
      },
    },
    props: {
      variant: "underlined",
      rows: 4,
      clearable: true,
      hideDetails: true,
    },
  },
};
// ##utils
const { width: VW, smAndUp } = useDisplay();
const ps = useProcessMonitor();
// ##icons
const { ICONS_ASSETS_FORMS_type: ICONS_addmenu } = useIconsConfig();
// ##refs ##flags ##models
const toggleDrawerPreviewActive = useToggleFlag();
const lastFormCreated = ref();
const toggleFormCreatedSuccess = useToggleFlag();
const mFormFields = ref(<any[]>[]);
// ##data ##auth ##state
const { commit } = useQueryManageAssetsForms(undefined, true);
// ##computed
const wDrawer = computed(() =>
  smAndUp.value ? DEFAULT_DRAWER_WIDTH : VW.value
);
// ##forms ##handlers ##helpers ##small-utils
const form = useFormModel("5e4ace58-a3c3-58f6-b3b7-5b64b5a99717", FIELDS, {
  onSubmit: async (fdata: any) => {
    const dd = assign({}, fdata, { data: { fields: mFormFields.value } });
    let res: any;
    try {
      ps.begin(() => {
        lastFormCreated.value = null;
        toggleFormCreatedSuccess.off();
      });
      res = await commit(dd);
      if (get(res, "data.assetsUpsert.error")) throw "--form:create:failed";
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value)
      ps.successful(() => {
        lastFormCreated.value = get(res, "data.assetsUpsert.status.asset");
        formClearAll();
        nextTick(toggleFormCreatedSuccess.on);
      });
  },
});
const dropFieldByKey = (key: string) => {
  mFormFields.value = filter(
    mFormFields.value,
    (item: any) => key !== item.key
  );
};
const fieldUpdated = (patch: any) => {
  mFormFields.value = map(mFormFields.value, (node: any) => {
    if (node.key === patch.key) {
      node.data = {
        ...node.data,
        ...patch.data,
      };
    }
    return node;
  });
};
const choiceItemsUpdated = (node: any) => {
  // node: {key:string; items: string[]}
  mFormFields.value = map(mFormFields.value, (item: any) => {
    if (node.key === item.key) {
      item.items = node.items;
    }
    return item;
  });
};
const clearFields = () => {
  mFormFields.value = [];
};
const formClearAll = () => {
  form.clear();
  clearFields();
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📝 Obrazac | Nov" });
// ##provide
// ##io

const itemadd = (type = DigitalFormFieldTypes.TEXT) => {
  mFormFields.value = [
    ...mFormFields.value,
    { key: uuid(), type, data: {}, items: [] },
  ];
};
// @@eos
</script>
<template>
  <section class="page--aktiva-obrasci-nov">
    <VNavigationDrawer
      v-model="toggleDrawerPreviewActive.isActive.value"
      location="right"
      :order="-1"
      :width="wDrawer"
    >
      <VBtnPanelClose
        @click="toggleDrawerPreviewActive.off"
        density="comfortable"
        class="ma-2 z-[1]"
      />
      <div class="__spacer pa-3 mt-12">
        <VFormRenderAssetsFormFields
          is-preview
          :form="{ data: { fields: mFormFields } }"
        />
      </div>
    </VNavigationDrawer>

    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleFormCreatedSuccess.isActive.value"
    >
      <NuxtLink
        :to="{
          name: 'aktiva-obrasci-fid',
          params: { fid: lastFormCreated.id },
        }"
      >
        <a class="link--prominent">
          <p>📝&nbsp; Obrazac je uspešno sačuvan.</p>
        </a>
      </NuxtLink>
    </VSnackbarMain>

    <VToolbarPrimary
      text="Nov upitnik"
      route-back-name="aktiva-obrasci"
      :props-title="{ class: 'text-body-1 font-italic' }"
      :props-actions="{ class: 'pe-1' }"
    >
      <template #actions>
        <VBtn
          :disabled="isEmpty(mFormFields)"
          @click="toggleDrawerPreviewActive.on"
          icon
          variant="plain"
        >
          <Iconx icon="preview" size="1.33rem" />
        </VBtn>
      </template>
      <template #prepend>
        <Iconx icon="$edit" size="1.22rem" class="ms-1 opacity-20" />
      </template>
    </VToolbarPrimary>
    <VForm @submit.prevent="form.submit">
      <VCard variant="text" rounded="0" elevation="0">
        <VCardText class="__spacer space-y-5 mt-2">
          <template v-for="(item, field) in FIELDS" :key="field">
            <VTextField
              v-if="!item.type"
              v-model="form.data[field].value"
              autofocus
              variant="underlined"
              hide-details
              clearable
            >
              <template #prepend-inner>
                <Iconx
                  :size="item.icon?.size"
                  :icon="item.icon?.name"
                  v-bind="item.icon?.props"
                />
              </template>
              <template #label>
                <span>{{ item.label }}</span>
                <span v-if="item.required" class="text-error"> *</span>
              </template>
            </VTextField>
            <VTextarea
              v-if="'textarea' == item.type"
              v-model="form.data[field].value"
              :label="item.label"
              v-bind="item.props"
            >
              <template #prepend-inner>
                <Iconx
                  :icon="item.icon?.name"
                  :size="item.icon?.size"
                  v-bind="item.icon?.props"
                />
              </template>
            </VTextarea>
          </template>
          <VCardTitleSectionStart
            title="Pitanja"
            :props-container="{ class: 'mt-10' }"
            class="text-center text-medium-emphasis"
          >
            <template #default="{ title }">
              <VBadge
                :model-value="0 < len(mFormFields)"
                inline
                :content="len(mFormFields)"
                color="info-lighten-1"
              >
                <span class="me-1">{{ title }}</span>
              </VBadge>
            </template>
          </VCardTitleSectionStart>
          <div v-if="!isEmpty(mFormFields)" class="__spacer space-y-5 mt-4">
            <VCardAssetsDigitalFormField
              v-for="(item, i) in mFormFields"
              :key="item.key"
              :form-field-data="item"
              :index="i + 1"
              @drop-key="dropFieldByKey"
              @field-updated="fieldUpdated"
              @items-updated="choiceItemsUpdated"
            />
          </div>
        </VCardText>
        <VCardActions
          class="justify-center"
          :class="[isEmpty(mFormFields) ? 'mt-0 pt-0' : 'mt-5']"
        >
          <VBtn
            @click="toggleDrawerPreviewActive.on"
            icon
            variant="plain"
            size="large"
          >
            <Iconx icon="eye" size="1.22rem" class="opacity-75" />
          </VBtn>
          <VBtn icon variant="tonal" color="primary" size="large" elevation="1">
            <Iconx icon="$plus" size="1.88rem" />
            <VTooltip text="Dodaj pitanje" />
            <!-- ##menu -->
            <VMenu
              :width="DEFAULT_MENU_WIDTH"
              activator="parent"
              location="center center"
            >
              <VList id="ID--haTiig41kUAREtP1zEO">
                <VListItem @click="itemadd(DigitalFormFieldTypes.TEXT)">
                  <template #prepend>
                    <Iconx v-bind="ICONS_addmenu[DigitalFormFieldTypes.TEXT]" />
                  </template>
                  <VListItemTitle class="ms-4">
                    Textualni odgovor
                  </VListItemTitle>
                </VListItem>
                <VListItem @click="itemadd(DigitalFormFieldTypes.CHOICE)">
                  <template #prepend>
                    <Iconx
                      v-bind="ICONS_addmenu[DigitalFormFieldTypes.CHOICE]"
                    />
                  </template>
                  <VListItemTitle class="ms-4">
                    Izbor sa liste opcija
                  </VListItemTitle>
                </VListItem>
                <VListItem @click="itemadd(DigitalFormFieldTypes.BOOLEAN)">
                  <template #prepend>
                    <Iconx
                      v-bind="ICONS_addmenu[DigitalFormFieldTypes.BOOLEAN]"
                    />
                  </template>
                  <VListItemTitle class="ms-4"> Da/ne izbor </VListItemTitle>
                </VListItem>
                <VListItem @click="itemadd(DigitalFormFieldTypes.RATING)">
                  <template #prepend>
                    <Iconx
                      v-bind="ICONS_addmenu[DigitalFormFieldTypes.RATING]"
                    />
                  </template>
                  <VListItemTitle class="ms-4"> Ocena 1-5 </VListItemTitle>
                </VListItem>
                <VListItem @click="itemadd(DigitalFormFieldTypes.TABLE_DATA)">
                  <template #prepend>
                    <Iconx
                      v-bind="ICONS_addmenu[DigitalFormFieldTypes.TABLE_DATA]"
                    />
                  </template>
                  <VListItemTitle class="ms-5 *translate-x-[2px]">
                    Popuni tabelu
                  </VListItemTitle>
                </VListItem>
                <VListItem @click="itemadd(DigitalFormFieldTypes.GOOGLE_FORMS)">
                  <template #prepend>
                    <Iconx
                      v-bind="ICONS_addmenu[DigitalFormFieldTypes.GOOGLE_FORMS]"
                    />
                  </template>
                  <VListItemTitle class="ms-5 *translate-x-[2px]">
                    Google obrasci
                  </VListItemTitle>
                </VListItem>
                <VListItem @click="itemadd(DigitalFormFieldTypes.FILES)">
                  <template #prepend>
                    <Iconx
                      v-bind="ICONS_addmenu[DigitalFormFieldTypes.FILES]"
                    />
                  </template>
                  <VListItemTitle class="ms-4">
                    Otprema datoteka
                  </VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </VCardActions>
        <VCardActions class="justify-around mt-16">
          <VBtnReset @click="formClearAll" :props-icon="{ class: 'me-2' }" />
          <VBtnSave type="submit" variant="elevated" size="x-large" />
        </VCardActions>
      </VCard>
    </VForm>
    <VSpacer class="mt-24" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--haTiig41kUAREtP1zEO .v-list-item__prepend .v-list-item__spacer {
  width: 0 !important;
}
</style>
