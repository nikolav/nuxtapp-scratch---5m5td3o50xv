<script setup lang="ts">
// ##imports
import { SpanTruncateCharsLength } from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs
const props = defineProps<{ report: any; descriptions?: boolean }>();

const form = computed(() => props.report?.asset);
const fields = computed(() => get(form.value, "data.fields"));

const response = computed(() => get(props.report, "data.response"));

const {
  db: {
    Assets: {
      DigitalFormFieldTypes: {
        TEXT,
        BOOLEAN,
        CHOICE,
        FILES,
        GOOGLE_FORMS,
        RATING,
        TABLE_DATA,
      },
    },
  },
} = useAppConfig();

// ##schemas
// ##utils
// ##icons
const { ICONS_ASSETS_FORMS_type } = useIconsConfig();
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard flat rounded="0" class="component--VCardAssetsFormReportResponse">
    <div class="__spacer">
      <template v-for="(formField, index) in fields" :key="formField.key">
        <template v-if="hasOwn(response, formField.data.question)">
          <VSpacer v-if="0 < index" class="mt-12" />
          <VCardText>
            <h4 class="text-body-1 font-weight-medium">
              <VBadge
                :content="1 + index"
                inline
                class="opacity-50 align-text-bottom mx-2"
              />
              <span>{{ formField.data.question }}</span>
            </h4>
            <p
              v-if="descriptions && formField.data.description"
              class="indent-2 text-body-1 text-disabled pa-2"
            >
              <small>
                {{ formField.data.description }}
              </small>
            </p>
          </VCardText>
          <VCardText v-if="BOOLEAN === formField.type">
            <VChip
              size="large"
              :text="response[formField.data.question] ? '👍🏻 Da' : '👎🏻 Ne'"
              :color="
                response[formField.data.question]
                  ? 'success-darken-2'
                  : 'error-darken-1'
              "
              elevation="1"
            >
            </VChip>
          </VCardText>
          <VCardText v-else-if="FILES === formField.type">
            <span class="__spacer d-inline-flex items-center gap-2 flex-wrap">
              <NuxtLink
                v-for="urlFile in response[formField.data.question]"
                :key="urlFile"
                :href="urlFile"
                target="_blank"
              >
                <VChip link size="small" elevation="1" color="primary">
                  <template #prepend>
                    <Iconx
                      icon="external-link"
                      size=".81rem"
                      class="me-1 opacity-40"
                    />
                  </template>
                  <SpanTruncateCharsLength
                    :text="urlFilename(urlFile)"
                    :length="22"
                  />
                </VChip>
              </NuxtLink>
            </span>
          </VCardText>
          <VCardText
            v-else-if="TEXT === formField.type"
            class="indent-4 text-body-2 !opacity-85 !prose"
          >
            <p>
              {{ response[formField.data.question] }}
            </p>
          </VCardText>
          <VCardText v-else-if="TABLE_DATA === formField.type">
            <NuxtLink :href="response[formField.data.question]" target="_blank">
              <span class="d-inline-flex items-center gap-3 text-body-1">
                <Iconx v-bind="ICONS_ASSETS_FORMS_type[TABLE_DATA]" />

                <a
                  class="d-inline-flex items-center gap-1 link--prominent text-primary"
                >
                  <Iconx icon="external-link" />
                  <span>Popunjena tabela</span>
                </a>
              </span>
            </NuxtLink>
          </VCardText>
          <VCardText v-else-if="GOOGLE_FORMS === formField.type">
            <NuxtLink :href="response[formField.data.question]" target="_blank">
              <span class="d-inline-flex items-center gap-3 text-body-1">
                <Iconx v-bind="ICONS_ASSETS_FORMS_type[GOOGLE_FORMS]" />

                <a
                  class="d-inline-flex items-center gap-1 link--prominent text-primary"
                >
                  <Iconx icon="external-link" />
                  <span>Popunjen Google obrazac</span>
                </a>
              </span>
            </NuxtLink>
          </VCardText>
          <VCardText v-else-if="RATING === formField.type">
            <VRating
              disabled
              size="large"
              :model-value="response[formField.data.question]"
              active-color="warning"
              color="secondary-lighten-1"
            />
          </VCardText>
          <VCardText v-else-if="CHOICE === formField.type">
            <VList
              :items="[].concat(response[formField.data.question])"
              density="compact"
              class="py-0 VList--OP0cAIH1pP0Er"
            >
              <template #item="{ props: { title } }">
                <VListItem class="ps-0">
                  <template #prepend>
                    <Iconx icon="$complete" color="primary" size="1.55rem" />
                  </template>
                  <span>{{ title }}</span>
                </VListItem>
              </template>
            </VList>
          </VCardText>
        </template>
      </template>
    </div>
  </VCard>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.VList--OP0cAIH1pP0Er .v-list-item__prepend .v-list-item__spacer {
  width: 1.22rem !important;
}
</style>
