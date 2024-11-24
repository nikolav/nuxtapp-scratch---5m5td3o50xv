<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VBtnSave,
  VBtnReset,
  VCardAssetsDigitalFormField,
  VCardTitleSectionStart,
  VSnackbarSuccess,
} from "@/components/app";
import type { IConfigFields } from "@/types";

// ##config:const
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
const ps = useProcessMonitor();
// ##icons
const ICONS_addmenu = {
  [DigitalFormFieldTypes.TEXT]: {
    icon: "paragraph",
    size: "1.22rem",
    class: "opacity-40",
  },
  [DigitalFormFieldTypes.BOOLEAN]: {
    icon: "control-switch",
    size: "1.22rem",
    class: "opacity-40",
  },
  [DigitalFormFieldTypes.CHOICE]: {
    icon: "checklist",
    size: "1.22rem",
    class: "opacity-40",
  },
  [DigitalFormFieldTypes.FILES]: {
    icon: "$file",
    size: "1.22rem",
    class: "opacity-40",
  },
  [DigitalFormFieldTypes.RATING]: {
    icon: "$ratingEmpty",
    size: "1.22rem",
    class: "opacity-40",
  },
};
// ##refs ##flags ##models
const lastFormCreated = ref();
const toggleFormCreatedSuccess = useToggleFlag();
const mFormFields = ref(<any[]>[]);
// ##data ##auth ##state
const { commit } = useQueryManageAssetsForms(undefined, true);
// ##computed
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
      ps.done(() => {
        console.log("Done.");
      });
    }
    if (!ps.error.value)
      ps.successful(() => {
        lastFormCreated.value = get(res, "data.assetsUpsert.status.asset");
        toggleFormCreatedSuccess.on();
        nextTick(formClearAll);
        console.log(lastFormCreated.value);
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
useHead({ title: "🎫 Obrazac" });
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
    <VSnackbarSuccess v-model="toggleFormCreatedSuccess.isActive.value">
      <NuxtLink
        :to="{
          name: 'aktiva-obrasci-fid',
          params: { fid: lastFormCreated.id },
        }"
      >
        <a class="link--prominent">
          <p>🎫&nbsp; Obrazac je uspešno sačuvan.</p>
        </a>
      </NuxtLink>
    </VSnackbarSuccess>
    <VToolbarPrimary
      text="Nov upitnik"
      route-back-name="aktiva-obrasci"
      :props-title="{ class: 'text-start ms-4 text-body-1 font-italic' }"
      :props-actions="{ class: 'pe-1' }"
    >
      <template #actions>
        <VBtn icon variant="plain">
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
              v-model.trim="form.data[field].value"
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
          <VBtn icon variant="tonal" color="primary">
            <Iconx icon="$plus" size="1.75rem" />
            <VTooltip text="Dodaj pitanje" />
            <VMenu width="256" activator="parent" location="center center">
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
          <VBtnSave type="submit" variant="elevated" />
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
