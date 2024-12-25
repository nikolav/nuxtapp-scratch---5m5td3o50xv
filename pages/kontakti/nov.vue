<script setup lang="ts">
// ##imports
import { z } from "zod";
import type { IConfigFields } from "@/types";
import {
  VToolbarPrimary,
  VBtnSave,
  VTextFieldsList,
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
// ##schemas
const schemaHasName = z.object({
  name: z.string(),
});
// ##utils
// ##icons
// ##refs ##flags ##models
const lastContactAdded = ref();
const toggleContactsAdded = useToggleFlag();
const ps = useProcessMonitor();
// ##data ##auth ##state
const { commit } = useDocsContacts();
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const FIELDS_new_contact = <Record<string, IConfigFields>>{
  name: {
    required: true,
    label: "Kontakt, ime",
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
    label: "Dodaj kontakte",
  },
};
const form = useFormModel(
  "contacts:new:501b0777-ad88-575a-8992-d329907cd5b7",
  FIELDS_new_contact,
  {
    schema: schemaHasName,
    onSubmit: async (data: any) => {
      let res: any;
      try {
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
        if (isEmpty(d.contacts))
          throw "@error:contacts-new:no-contacts:M3t8szhRYLK";
        res = await commit(d);
        if (!get(res, "data.docsUpsert.id"))
          throw "@error:contacts-new:MiZw6mqCvZxLT8ZN1x";
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value)
        ps.successful(() => {
          // @success
          lastContactAdded.value = get(res, "data.docsUpsert");
          toggleContactsAdded.on();
          form.clear();
        });

      console.log("@debug", ps.error.value);
    },
  }
);
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✨🧑🏻 Nov kontakt" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--kontakti-nov">
    <VSnackbarMain
      v-model="toggleContactsAdded.isActive.value"
      color="success-darken-1"
    >
      <NuxtLink
        :to="{
          name: 'kontakti-azuriraj-ckey',
          params: { ckey: lastContactAdded?.key },
        }"
      >
        <a class="link--prominent">
          <p>Kontakt je uspešno sačuvan.</p>
        </a>
      </NuxtLink>
    </VSnackbarMain>
    <VToolbarPrimary
      text="Nov kontakt"
      :props-title="{ class: 'ms-0 ps-3 text-start text-body-1 font-italic' }"
      route-back-name="kontakti"
    >
      <template #prepend>
        <Iconx icon="notebook" size="1.33rem" class="opacity-20 ms-[2px]" />
      </template>
    </VToolbarPrimary>
    <VForm @submit.prevent="form.submit">
      <VCard flat elevation="0" rounded="0">
        <VCardText>
          <template v-for="(item, field) in FIELDS_new_contact" :key="field">
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
        <VCardActions class="justify-around">
          <VBtnSave
            :disabled="!form.valid.value"
            :props-icon="{ icon: 'user-add', class: 'me-3' }"
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
