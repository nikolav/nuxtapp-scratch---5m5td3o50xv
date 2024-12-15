<script setup lang="ts">
// ##imports
import { z } from "zod";
import { FIELDS_ASSETS_CHANNELS as FIELDS } from "@/config/forms";
import {
  VBtnSave,
  VBtnReset,
  VSnackbarSuccess,
  // VBtnTopicChatToggle,
  ProvideAssetsChildren,
  VChipAssetAvatar,
} from "@/components/app";
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
      type: { PEOPLE_GROUP_TEAM },
    },
  },
} = useAppConfig();
const attrs = useAttrs();
const channel = computed(() => get(attrs, "route-data.channel"));
const cid = computed(() => channel.value?.id);
// ##schemas
const schemaHasName = z.object({
  name: z.string().min(1),
});
const schemaChannelUpdate = z.object({
  name: z.optional(z.nullable(z.string().min(1))),
  notes: z.optional(z.nullable(z.string())),
});
// ##utils
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const toggleChannelUpdateSuccess = useToggleFlag();
// ##data ##auth ##state
const enabled = computed(() => !!cid.value);
const { commit } = useQueryManageAssetsComms(() => [cid.value], undefined, {
  enabled,
});
// ##computed
// ##forms ##handlers ##helpers
const form = useFormModel("69fc529b-7b76-5f1a-ba9a-3727966d2bad", FIELDS, {
  model: channel,
  schema: schemaHasName,
  onSubmit: async () => {
    try {
      ps.begin(toggleChannelUpdateSuccess.off);
      if (!enabled.value) throw "channel:update:faied";
      const patch = schemaChannelUpdate.parse(form.diff.value);
      if (isEmpty(patch)) throw "channel:update:faied";
      if (get(await commit(patch, cid.value), "data.assetsUpsert.error"))
        throw "channel:update:faied";
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value) ps.successful(toggleChannelUpdateSuccess.on);
  },
});
const itemTo = (g: IAsset) => ({
  name: "aktiva-grupe-gid",
  params: { gid: g.id },
});
// ##watch
// ##hooks ##lifecycle
useOnceMountedOn(channel, form.reset);
// ##head ##meta
useHead({ title: "Veza" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza-cid-index">
    <VSnackbarSuccess v-model="toggleChannelUpdateSuccess.isActive.value">
      <p>Kanal je uspešno ažuriran.</p>
    </VSnackbarSuccess>
    <ProvideAssetsChildren
      :asset="channel"
      :type="PEOPLE_GROUP_TEAM"
      v-slot="{ assets: groups }"
    >
      <VCardText
        v-if="!isEmpty(groups)"
        class="__spacer d-flex flex-wrap items-center justify-start gap-2 px-0 ps-1"
      >
        <VChipAssetAvatar
          v-for="g in groups"
          :key="g.key"
          :asset="g"
          :item-to="itemTo(g)"
        />
      </VCardText>
    </ProvideAssetsChildren>
    <VForm @submit.prevent="form.submit">
      <VCard variant="text" elevation="0" rounded="0">
        <VCardText class="space-y-3 mt-2">
          <template v-for="(item, field) in FIELDS" :key="field">
            <VTextField
              v-if="!item.type"
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
          <VSpacer class="mt-5" />
          <VTextField
            disabled
            readonly
            variant="plain"
            :model-value="channel?.key"
            label="Ključ"
          >
            <template #prepend-inner>
              <Iconx
                icon="hashtag"
                size="1rem"
                class="opacity-50 translate-y-[.122rem] me-[.22rem]"
              />
            </template>
          </VTextField>
        </VCardText>
        <VCardActions class="justify-around mt-4 mb-12">
          <VBtnReset @click="form.reset" />
          <VBtnSave
            :disabled="!form.isDirty.value || !form.valid.value"
            type="submit"
          />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
