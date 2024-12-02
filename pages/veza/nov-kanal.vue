<script setup lang="ts">
// ##imports
import { z } from "zod";
import { FIELDS_ASSETS_CHANNELS as FIELDS } from "@/config/forms";
import {
  VToolbarPrimary,
  VBtnReset,
  VBtnSave,
  VSnackbarSuccess,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
const schemaNewChannel = z.object({
  name: z.string().min(1),
});
// ##utils
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const lastInsertAssetChannel = ref();
const toggleChannelAddSuccess = useToggleFlag();
// ##data ##auth ##state
const { commit } = useQueryManageAssetsComms();
// ##computed
const toLastInsertAssetChannel = computed(() =>
  lastInsertAssetChannel.value
    ? {
        name: "veza-cid",
        params: { cid: lastInsertAssetChannel.value.id },
      }
    : undefined
);
// ##forms ##handlers ##helpers
const form = useFormModel("2f660e3e-2fca-5610-a076-b0ef5469a2a4", FIELDS, {
  schema: schemaNewChannel,
  onSubmit: async (data: any) => {
    let res: any;
    try {
      ps.begin(() => {
        toggleChannelAddSuccess.off();
        lastInsertAssetChannel.value = undefined;
      });
      res = await commit(data);
      if (get(res, "data.assetsUpsert.error")) throw "channel:add:failed";
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value)
      ps.successful(() => {
        toggleChannelAddSuccess.on();
        lastInsertAssetChannel.value = get(
          res,
          "data.assetsUpsert.status.asset"
        );
        nextTick(form.clear);
      });
  },
});
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Veza" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza-nov-kanal">
    <VSnackbarSuccess v-model="toggleChannelAddSuccess.isActive.value">
      <NuxtLink :to="toLastInsertAssetChannel">
        <p class="link--prominent">📡&nbsp; Kanal uspešno dodat.</p>
      </NuxtLink>
    </VSnackbarSuccess>
    <VForm @submit.prevent="form.submit" autocomplete="off">
      <VCard variant="text" elevation="0" rounded="0">
        <VToolbarPrimary
          route-back-name="veza"
          text="Nov kanal"
          :props-title="{ class: 'text-body-1 font-italic' }"
        >
          <template #prepend>
            <Iconx icon="headset" size="1.5rem" class="mx-1 opacity-20" />
          </template>
        </VToolbarPrimary>
        <VSpacer class="mt-1" />
        <VCardText class="space-y-3">
          <template v-for="(item, field) in FIELDS" :key="field">
            <VTextField
              v-if="!item.type"
              v-model.trim="form.data[field].value"
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
              <template #label="{ label }">
                <span>{{ label }}</span>
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
        </VCardText>
        <VCardActions class="justify-around mt-4 mb-12">
          <VBtnReset @click="form.clear" />
          <VBtnSave type="submit" />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
