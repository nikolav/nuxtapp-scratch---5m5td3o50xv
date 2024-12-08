<script setup lang="ts">
// ##imports
import { z } from "zod";
import type { IConfigFields } from "@/types";
import {
  VToolbarPrimary,
  VBtnSave,
  VBtnReset,
  VSnackbarSuccess,
} from "@/components/app";
import { FIELDS_ASSETS_SITES as FIELDS } from "@/config/forms";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();
// ##schemas
const schemaInputSiteAdd = z.object({
  name: z.string().min(1),
  location: z.optional(z.nullable(z.string())),
  category: z.string(),
  code: z.optional(z.nullable(z.string())),
  notes: z.optional(z.nullable(z.string())),
});
// ##utils
const ps = useProcessMonitor();
const {
  sites: { categories_select_menu },
} = useCategoryAssets();
// ##icons
// ##refs ##flags ##models
const toggleAssetsSitesCommitSuccess = useToggleFlag();
const ref_erRepfm9YBGynr0zSCB = ref();
const siteAdded = ref();
// ##data ##auth ##state
const { commit, processing } = useQueryManageAssetsSites(undefined, true);
// ##computed
const { width: W_fields } = useElementSize(
  useComponentEl(ref_erRepfm9YBGynr0zSCB)
);
// ##forms ##handlers ##helpers
const form = useFormModel(
  "useFormModel:db757920-ca23-5358-8a25-a88572a44332",
  reduce(
    FIELDS,
    (res: any, item: IConfigFields, field: string) => {
      if (!item.skip) {
        res[field] = true;
      }
      return res;
    },
    <any>{}
  ),
  {
    schema: schemaInputSiteAdd,
    onSubmit: async (fields: any) => {
      let res: any;
      try {
        ps.begin(() => {
          siteAdded.value = undefined;
        });
        res = await commit(fields);
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value && !get(res, "data.assetsUpsert.error"))
        ps.successful(() => {
          siteAdded.value = get(res, "data.assetsUpsert.status.asset");
        });
    },
  }
);
// ##watch
watch(ps.success, (success: boolean) => {
  if (success) {
    toggleAssetsSitesCommitSuccess.on();
    nextTick(form.clear);
  }
});
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✨🏪 Nov lokal" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-lokali-nov">
    <VSnackbarSuccess v-model="toggleAssetsSitesCommitSuccess.isActive.value">
      <NuxtLink
        :to="{ name: 'aktiva-lokali-sid', params: { sid: siteAdded.id } }"
      >
        <p class="link--prominent">🏪 Lokal je uspešno sačuvan.</p>
      </NuxtLink>
    </VSnackbarSuccess>
    <VToolbarPrimary
      text="Ulistaj lokal"
      route-back-name="aktiva-lokali"
      :props-title="{ class: 'text-body-1 font-italic' }"
    >
      <template #prepend>
        <Iconx size="1.33rem" icon="storefront" class="opacity-20 mx-1" />
      </template>
    </VToolbarPrimary>
    <VForm
      @submit.prevent="form.submit"
      autocomplete="off"
      :disabled="processing"
    >
      <VCard class="__spacer mt-1" variant="text" rounded="0">
        <VCardText class="space-y-5 px-5" ref="ref_erRepfm9YBGynr0zSCB">
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
              variant="underlined"
              :label="item.label"
              clearable
              hide-details
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
            <VSelect
              v-if="'select' == item.type"
              v-model="form.data[field].value"
              :items="categories_select_menu"
              variant="solo"
              rounded="pill"
              hide-details
              :list-props="{ class: 'py-0' }"
              :menu-props="{
                location: 'center',
                width: W_fields,
                transition: DEFAULT_TRANSITION,
              }"
              v-bind="item.props"
            >
              <template #prepend-inner>
                <span class="__spacer me-1" />
              </template>
              <template #label>
                <Iconx
                  :icon="item.icon?.name"
                  :size="item.icon?.size"
                  v-bind="item.icon?.props"
                />
                <span>
                  {{ item.label }}
                </span>
                <span v-if="item.required" class="text-error"> *</span>
              </template>
            </VSelect>
          </template>
        </VCardText>
        <VCardActions class="justify-evenly mt-5 mb-12">
          <VBtnReset @click="form.clear" :props-icon="{ class: 'me-2' }" />
          <VBtnSave type="submit" :disabled="!form.valid.value" />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
