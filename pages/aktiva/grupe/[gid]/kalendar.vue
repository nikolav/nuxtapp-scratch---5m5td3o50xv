<script setup lang="ts">
// ##imports
import { z } from "zod";
import type { IConfigFields } from "@/types";
import { VBtnReset, VBtnSave, VCardGoogleCalendar } from "@/components/app";
// ##config:const
const URL_CALENDAR_CONFIG_HELP =
  "https://support.google.com/calendar/answer/37083?hl=en";
// const LINK_demo =
//   "https://calendar.google.com/calendar/u/0?cid=ZjkzOTYxYzIzMGY4OWEyM2ZlMWM0OTlmNTU1MmUwMDkwZGVkZWIwYWRjMzY2ZTFhYmYwMTc3ZDc3OGRjODdkZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t";
// const PUBLIC_URL_demo =
//   "https://calendar.google.com/calendar/embed?src=f93961c230f89a23fe1c499f5552e0090dedeb0adc366e1abf0177d778dc87dd%40group.calendar.google.com&ctz=Europe%2FBelgrade";
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const gReload = get(attrs, "route-data.gReload");
const g = computed(() => get(attrs, "route-data.g", <any>{}));
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name);
const enabled = computed(() => !!gid.value);

// ##schemas
const schemaGoogleCalendarConfig = z.object({
  shareable_link: z.string(),
  public_url: z.string(),
});
// ##utils
const { assetsUpdated } = useTopics();
const FIELDS = <Record<string, IConfigFields>>{
  shareable_link: {
    label: "Link za ažuriranje",
    required: true,
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
  public_url: {
    label: "Javni url za pregled",
    required: true,
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
};
// ##icons
// ##refs ##flags ##models
const ps = useProcessMonitor();
// ##data ##auth ##state
const { assetsPatchData } = useQueryManageAssetsGroups(
  () => [gid.value],
  undefined,
  {
    enabled,
  }
);
// ##computed
const configGoogleCalendar = computed(() => {
  try {
    return schemaGoogleCalendarConfig.parse(
      get(g.value, "data.google_calendar")
    );
  } catch (error) {
    // pass
  }
  return null;
});
// ##forms ##handlers ##helpers ##small-utils
const form = useFormModel("7eebfe9e-15ab-54f1-820d-66b63bd53e6b", FIELDS, {
  schema: schemaGoogleCalendarConfig,
  onSubmit: async (google_calendar: any) => {
    try {
      ps.begin();
      if (!enabled.value) throw "assets:data:patch:error";
      if (
        get(
          await assetsPatchData(gid.value, { google_calendar }),
          "data.assetsPatchData.error"
        )
      )
        throw "assets:data:patch:error";
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value) ps.successful();
  },
});

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📆 Kalendar" });
// ##provide
// ##io
watchEffect(() => useIOEvent(() => assetsUpdated(gid.value), gReload));

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-kalendar">
    <template v-if="isEmpty(configGoogleCalendar)">
      <VEmptyState
        headline="Kalendar nije podešen"
        title="Podesi parametre kalendara za pregled:"
        color="error"
        icon="$calendar"
      >
        <template #title>
          <span>Kako da podesim parametre kalendara</span>
          <NuxtLink
            class="ms-1"
            :href="URL_CALENDAR_CONFIG_HELP"
            target="_blank"
          >
            <VBtn icon small variant="plain" color="info" density="comfortable">
              <Iconx icon="help" size="1.82rem" />
            </VBtn>
          </NuxtLink>
        </template>
      </VEmptyState>
      <VForm @submit.prevent="form.submit">
        <VCard variant="text" elevation="0" rounded="0">
          <VCardText>
            <template v-for="(item, field) in FIELDS" :key="field">
              <VTextField
                v-model.trim="form.data[field].value"
                :label="item.label"
                v-bind="item.props"
              >
                <template #label="{ label }">
                  <span>{{ label }}</span>
                  <span v-if="item.required" class="text-error"> *</span>
                </template>
              </VTextField>
            </template>
          </VCardText>
          <VCardActions class="justify-around mt-5">
            <VBtnReset @click="form.reset" :props-icon="{ class: 'me-2' }" />
            <VBtnSave :disabled="!form.valid.value" type="submit" />
          </VCardActions>
        </VCard>
      </VForm>
    </template>
    <VCardGoogleCalendar
      v-else
      :href="configGoogleCalendar?.public_url"
      :href-edit="configGoogleCalendar?.shareable_link"
      :show-chat="false"
    />
    <VSpacer class="mt-16" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
