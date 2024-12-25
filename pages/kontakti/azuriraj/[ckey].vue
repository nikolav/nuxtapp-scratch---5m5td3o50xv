<script setup lang="ts">
// ##imports
import { z } from "zod";
import type { IConfigFields } from "@/types";
import {
  VToolbarPrimary,
  VTextFieldsList,
  VBtnSave,
  VBtnReset,
  VSnackbarMain,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const route = useRoute();
const ckey = computed(() => route.params?.ckey);
// ##schemas
const schemaHasName = z.object({
  name: z.string(),
});

// ##utils
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const toggleContactsUpdatedSuccess = useToggleFlag();
// ##data ##auth ##state
const { data: d, commit } = useDoc(ckey);
// ##computed
const model = computed(() => d.value?.data);
// ##forms ##handlers ##helpers ##small-utils
const FIELDS_contacts = <Record<string, IConfigFields>>{
  name: {
    required: true,
    label: "Naziv",
    icon: {
      icon: "tag",
      size: "1.22rem",
      class: "opacity-20 mx-1",
    },
    props: {
      clearable: true,
    },
  },
  contacts: {
    type: "ls-contacts",
    label: "Ažuriraj kontakte",
    equals: isEqual,
  },
};
const form = useFormModel(
  "a73d1d5d-24e0-5f65-bea8-2f25760bdb9d",
  FIELDS_contacts,
  {
    schema: schemaHasName,
    model,
    onSubmit: async (data: any) => {
      let res: any;
      try {
        ps.begin(toggleContactsUpdatedSuccess.off);
        const d = reduce(
          data.contacts,
          (res: any, node: any) => {
            if (node.contact) {
              res.contacts.push(node);
            }
            return res;
          },
          <any>{
            name: data.name,
            contacts: [],
          }
        );
        if (isEmpty(d.contacts)) throw "@error:contacts-update:zBpzIUNyYqvj3iM";
        await commit(d, false);
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value)
        ps.successful(() => {
          // @success
          toggleContactsUpdatedSuccess.on();
        });

      console.log("@debug", ps.error.value);
    },
  }
);
// ##watch
// ##hooks ##lifecycle
useOnceMountedOn(model, form.reset);
// ##head ##meta
useHead({ title: "🧑🏻 Ažuriraj kontakte" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--kontakti-azuriraj-cid">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleContactsUpdatedSuccess.isActive.value"
    >
      <p>Kontakt je uspešno ažuriran.</p>
    </VSnackbarMain>
    <VToolbarPrimary
      :text="d.data?.name"
      route-back-name="kontakti"
      :props-title="{ class: 'text-start ms-0 ps-3 text-body-2 font-italic' }"
    >
      <template #prepend>
        <Iconx icon="$edit" size="1.22rem" class="ms-1 opacity-20" />
      </template>
    </VToolbarPrimary>
    <VForm @submit.prevent="form.submit">
      <VCard flat elevation="0" rounded="0">
        <VCardText>
          <template v-for="(item, field) in FIELDS_contacts" :key="field">
            <VTextField
              v-if="!item.type"
              v-model="form.data[field].value"
              :label="item.label"
              variant="underlined"
              class="d-block"
              v-bind="item.props"
            >
              <template #prepend-inner>
                <Iconx v-bind="item.icon" />
              </template>
              <template #label="{ label }">
                <span>{{ label }}</span>
                <span v-if="item.required" class="text-error"> *</span>
              </template>
            </VTextField>
            <VSpacer class="mt-3" />
            <VTextFieldsList
              v-if="'ls-contacts' == item.type"
              v-model="form.data[field].value"
              :props-text-field="{ clearable: true }"
            >
              <template #label>
                <small class="opacity-50 ps-2">{{ item.label }}</small>
              </template>
            </VTextFieldsList>
          </template>
        </VCardText>
        <VSpacer class="mt-10" />
        <VCardActions class="justify-around">
          <VBtnReset :props-icon="{ class: 'me-1' }" @click="form.reset" />
          <VBtnSave
            :disabled="!form.valid.value"
            :props-icon="{ icon: 'account-user-edit', class: 'me-3' }"
            type="submit"
            variant="elevated"
            size="x-large"
            class="px-5"
          />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
