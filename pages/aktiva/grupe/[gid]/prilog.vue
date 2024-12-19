<script setup lang="ts">
// ##imports
import { z } from "zod";
import type { IConfigFields } from "@/types";

// ##config:const
const LINK_HELP_SHARE_FOLDERS_DRIVE =
  "https://support.google.com/drive/answer/7166529?hl=en&co=GENIE.Platform%3DDesktop#zippy=%2Cshare-with-specific-people";
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##utils
const ps = useProcessMonitor();
const attrs = useAttrs();
// ##schemas
const schemaInputLink = z.object({
  link_share_folder: z.string(),
});
// ##icons
// ##refs ##flags ##models
const g = computed(() => get(attrs, "route-data.g"));
const gid = computed(() => g.value?.id);
const sharedFolder = computed(() => get(g.value, "data.link_share_folder"));

// ##data ##auth ##state
const { commit } = useQueryManageAssetsGroups(undefined, undefined, {
  enabled: false,
});
// ##forms ##handlers ##helpers
const FIELDS = <Record<string, IConfigFields>>{
  link_share_folder: {
    required: true,
    "@table:data": true,
    label: "Koristi ovaj deljeni folder",
    icon: {
      icon: "google-drive",
      size: "1.122rem",
      class: "mt-1 opacity-20 mx-1",
    },
    props: {
      class: "grow",
    },
  },
};

const form = useFormModel("0f76693f-75dc-52d3-9222-b0ef0fb9eecd", FIELDS, {
  schema: schemaInputLink,
  onSubmit: async (data: any) => {
    try {
      ps.begin();
      const dd = reduce(
        FIELDS,
        (res: any, item: IConfigFields, field: string) => {
          if (field in data) {
            if (item["@table:data"]) {
              assign(res.data, { [field]: data[field] });
            }
          }
          return res;
        },
        <any>{ data: {} }
      );
      if (get(await commit(dd, gid.value), "data.assetsUpsert.error"))
        throw "@error:mnEUl6";
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value)
      ps.successful(() => {
        // @success
      });
  },
});
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-prilog">
    <VEmptyState v-if="!sharedFolder" title="Deljeni folder nije podešen">
      <template #media>
        <Iconx size="10rem" icon="folder-wrench" class="text-error-lighten-1" />
      </template>
      <template #text>
        <p class="mt-3">
          Kako da delim google drive folder sa korisnicima
          <VBtn
            icon
            color="info"
            density="comfortable"
            variant="text"
            tag="a"
            :href="LINK_HELP_SHARE_FOLDERS_DRIVE"
            target="_blank"
          >
            <Iconx icon="help" size="1.33rem" />
          </VBtn>
        </p>
      </template>
    </VEmptyState>
    <VEmptyState v-else>
      <NuxtLink :href="sharedFolder" target="_blank">
        <VBtn icon size="7.22rem" variant="tonal">
          <VBadge color="transparent" location="top end" offset-y="12">
            <Iconx icon="folder" size="5rem" />
            <template #badge>
              <VAvatar
                color="primary-lighten-1"
                density="comfortable"
                size="small"
              >
                <Iconx size="1.122rem" icon="external-link" />
              </VAvatar>
            </template>
          </VBadge>
        </VBtn>
      </NuxtLink>
    </VEmptyState>
    <VSpacer class="mt-5" />
    <VForm @submit.prevent="form.submit" class="pa-3">
      <div class="__spacer">
        <template v-for="(item, field) in FIELDS" :key="field">
          <VTextField
            v-if="null == item.type"
            v-model="form.data[field].value"
            :label="item.label"
            variant="underlined"
            clearable
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
        </template>
        <VCardActions class="pe-3">
          <VSpacer />
          <VBtn
            variant="tonal"
            elevation="1"
            size="large"
            rounded="pill"
            type="submit"
            >ok</VBtn
          >
        </VCardActions>
      </div>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
