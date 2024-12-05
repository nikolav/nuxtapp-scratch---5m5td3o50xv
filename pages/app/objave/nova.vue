<script setup lang="ts">
// ##imports
import type { IConfigFields } from "@/types";
import { renderIcon } from "@/components/icons";
import {
  VToolbarPrimary,
  VBtnReset,
  VBtnSave,
  VImgImagesPickerDefaut,
} from "@/components/app";
// ##config:const
const DEFAULT_imagePickerHeight = 222;
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const FIELDS_post = <Record<string, IConfigFields>>{
  name: {
    required: true,
    label: "Naslov",
    icon: {
      icon: "tag",
      size: "1.122rem",
      class: "opacity-20 mx-1 mt-[2px]",
    },
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
  public: {
    type: "checkbox",
    label: "Javni post, svi vide",
    props: {
      color: "primary",
    },
  },
  "image-picker": {
    type: "image-picker",
  },
  content: {
    required: true,
    type: "textarea",
    icon: {
      icon: "$edit",
      size: "1rem",
      class: "",
      props: {},
    },
  },
};
// ##schemas
// ##utils
// ##icons
const iconCheckOn = renderIcon("check-on", { class: "scale-[111%]" });
const iconCheckOff = renderIcon("check-off", { class: "scale-[111%]" });
// ##refs ##flags ##models
const signalIdCleared = useUniqueId();
const imagesPicked = ref();
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const form = useFormModel(
  "post:new:228d7abf-56f9-5b2e-8480-b779c5aedaf9",
  FIELDS_post,
  {
    onSubmit: async (data: any) => {
      console.log({ data });
    },
  }
);
const formClear = () => {
  form.clear();
  signalIdCleared();
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✨📃 Nova objava" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-nova">
    <VForm @submit.prevent="form.submit">
      <VCard flat rounded="0">
        <VToolbarPrimary
          flat
          text="Objavi nov post"
          :props-title="{ class: 'text-body-1 font-italic' }"
          route-back-name="app"
        >
          <template #prepend>
            <Iconx
              icon="page"
              size="1.33rem"
              class="opacity-20 ms-1 rotate-6"
            />
          </template>
        </VToolbarPrimary>
        <VCardText class="!max-w-[492px] mx-auto">
          <template v-for="(item, field) in FIELDS_post" :key="field">
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
              :true-icon="iconCheckOn"
              :false-icon="iconCheckOff"
              v-bind="item.props"
            >
              <template #label="{ label }"
                ><span class="ps-2">{{ label }}</span></template
              >
            </VCheckbox>
            <VResponsive
              v-else-if="'image-picker' == item.type"
              class="overflow-visible"
            >
              <p class="ps-2 text-body-1 text-medium-emphasis">Slike:</p>
              <VImgImagesPickerDefaut
                v-model="imagesPicked"
                rounded="lg"
                :props-container="{
                  height: DEFAULT_imagePickerHeight,
                  rounded: 'lg',
                }"
                :key-images-cleared="signalIdCleared.ID.value"
              />
            </VResponsive>
          </template>
        </VCardText>
        <VCardActions class="justify-around">
          <VBtnReset @click="formClear" :props-icon="{ class: 'me-1' }" />
          <VBtnSave
            color="on-surface"
            variant="elevated"
            type="submt"
            elevation="3"
            size="x-large"
            text="Objavi"
            :props-icon="{ icon: 'world', class: '-rotate-6' }"
            class="text-primary-darken-1 pe-5"
          />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
