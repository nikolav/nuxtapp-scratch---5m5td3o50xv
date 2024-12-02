<script setup lang="ts">
// ##imports
import type { IConfigFields } from "@/types";
import {
  VBtnPickFiles,
  VBtnReset,
  VBtnSave,
  NuxtLinkAssetsFormExternal,
  VEmptyStateNoData,
} from "@/components/app";
// ##config:const
// ##config ##props
const emit = defineEmits<{
  submited: [fields: any];
}>();
const props = withDefaults(
  defineProps<{
    form: any;
    spaceY?: any;
    isPreview?: boolean;
    propsBtnSave?: any;
  }>(),
  {
    spaceY: "2.22rem",
  }
);
const fields = computed(() => get(props.form, "data.fields"));

const {
  db: {
    Assets: { DigitalFormFieldTypes },
  },
  app: { DEFAULT_TRANSITION },
} = useAppConfig();

// ##schemas
// ##utils
const spacey_ = computed(() =>
  isNumeric(props.spaceY) ? `${props.spaceY}px` : props.spaceY
);
const refSizergxI13Ky3 = ref();
const { width: WSelect } = useElementSize(refSizergxI13Ky3);

const FIELDS_format = <Record<string, IConfigFields>>{
  [DigitalFormFieldTypes.CHOICE]: {
    type: "select",
    label: "Izaberi",
    props: {
      transition: DEFAULT_TRANSITION,
      chips: true,
      rounded: true,
      class: "",
      variant: "solo-filled",
      // color: "primary",
      "single-line": true,
      clearable: true,
    },
  },
  [DigitalFormFieldTypes.TEXT]: {
    type: "textarea",
    label: "Odgovor",
    props: {
      "single-line": true,
      rows: 3,
      clearable: true,
      variant: "underlined",
      class: "",
    },
  },
  [DigitalFormFieldTypes.TABLE_DATA]: {
    type: "table-data",
    label: "Popuni tabelu",
    props: {
      class: "",
    },
  },
  [DigitalFormFieldTypes.GOOGLE_FORMS]: {
    type: "google-forms",
    label: "Popuni Google obrazac",
    props: {
      class: "",
    },
  },
  [DigitalFormFieldTypes.FILES]: {
    type: "attach",
    label: "Prilog",
    props: {
      size: "large",
      rounded: true,
      class: "ps-4",
    },
  },
  [DigitalFormFieldTypes.RATING]: {
    type: "rating",
    label: "Ocena",
    props: {
      "active-color": "warning",
      color: "secondary",
      class: "",
    },
  },
  [DigitalFormFieldTypes.BOOLEAN]: {
    type: "boolean",
    label: "",
    props: { class: "w-100 d-flex justify-evenly" },
    propsBtn: {
      size: "large",
      rounded: true,
      class: "ps-4 pe-6",
    },
    buttons: [
      {
        title: {
          item: "👍🏻",
          text: "Da",
        },
        value: true,
      },
      {
        title: {
          item: "👎🏻",
          text: "Ne",
        },
        value: false,
      },
    ],
  },
};

const FIELDS = computed(() =>
  reduce(
    fields.value,
    (res_f: any, item: any) => {
      res_f[item.data.question] = {
        ...FIELDS_format[item.type],
        model$: item,
      };
      return res_f;
    },
    <any>{}
  )
);
// ##icons
// ##refs ##flags ##models
const answers = ref(<any>{});
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const formSubmit = () => {
  if (props.isPreview) return;
  emit("submited", { key: uuid(), answers: toValue(answers) });
};

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VForm
    @submit.prevent="formSubmit"
    class="component--VFormRenderAssetsFormFields"
  >
    <VCard flat>
      <template v-if="isEmpty(FIELDS)">
        <slot name="no-data">
          <VEmptyStateNoData class="opacity-50" />
        </slot>
      </template>
      <template v-else>
        <template v-for="(node, field, index) in FIELDS" :key="field">
          <!--items margin-top -->
          <VSpacer v-if="0 < index" class="CLASS-spaceY--dHYAAf" />
          <!-- item:title -->
          <slot name="title" :node="node" :text="field" :index="index">
            <h4 class="text-body-1 font-weight-medium">
              <VBadge
                :color="
                  node.model$.data.required ? 'error-lighten-1' : 'secondary'
                "
                inline
                :content="1 + index"
                class="align-text-bottom"
              />
              <span class="ms-1">
                <slot name="title-text" :text="field">
                  {{ field }}
                </slot>
              </span>
            </h4>
          </slot>
          <VCardText
            v-if="node.model$.data.description"
            class="text-body-2 text-disabled indent-4"
          >
            <p>
              {{ node.model$.data.description }}
            </p>
          </VCardText>
          <!-- item:body -->
          <VCardText>
            <div ref="refSizergxI13Ky3" class="__spacer px-2">
              <NuxtLinkAssetsFormExternal
                v-if="['table-data', 'google-forms'].includes(node.type)"
                v-model="answers[field]"
                :node="node"
              />
              <VCardActions v-if="'attach' == node.type" class="justify-center">
                <VBtnPickFiles
                  v-model="answers[field]"
                  variant="elevated"
                  v-bind="node.props"
                >
                  <span>{{ node.label }}</span>
                </VBtnPickFiles>
              </VCardActions>
              <VRating
                v-if="'rating' == node.type"
                v-model="answers[field]"
                :clearable="!node.model$.data.required"
                v-bind="node.props"
              />
              <VTextarea
                v-if="'textarea' == node.type"
                v-model="answers[field]"
                :label="node.label"
                v-bind="node.props"
              >
                <template #label="{ label }">
                  <span>{{ label }}</span>
                  <span v-if="node.model$.data.required" class="text-error">
                    *</span
                  >
                </template>
              </VTextarea>
              <VSelect
                v-if="'select' == node.type"
                v-model="answers[field]"
                :label="node.label"
                :multiple="node.model$.data.multiple"
                :items="node.model$.items"
                :menu-props="{ location: 'center', width: WSelect }"
                v-bind="node.props"
              >
                <template #prepend-inner>
                  <span class="__spacer me-2" />
                </template>
                <template #label="{ label }">
                  <span>{{ label }}</span>
                  <span v-if="node.model$.data.required" class="text-error">
                    *</span
                  >
                </template>
              </VSelect>
              <VCardActions v-if="'boolean' == node.type">
                <VItemGroup
                  :mandatory="node.model$.data.required"
                  v-model="answers[field]"
                  v-bind="node.props"
                >
                  <VItem
                    v-for="i in node.buttons"
                    :key="i.title.text"
                    :value="i.value"
                  >
                    <template #default="{ select, isSelected }">
                      <VBtn
                        @click="
                          select(
                            isSelected
                              ? !!node.model$.data.required
                              : !isSelected
                          )
                        "
                        :color="isSelected ? 'primary' : 'secondary'"
                        :variant="isSelected ? 'elevated' : 'flat'"
                        v-bind="node.propsBtn"
                      >
                        <template #prepend>
                          <span class="mb-[2px]">{{ i.title.item }}</span>
                        </template>
                        <span>
                          {{ i.title.text }}
                        </span>
                      </VBtn>
                    </template>
                  </VItem>
                </VItemGroup>
              </VCardActions>
            </div>
          </VCardText>
        </template>
        <VSpacer class="mt-16" />
        <VCardActions class="justify-around">
          <VBtnReset disabled @click="noop" />
          <VBtnSave
            :disabled="isPreview"
            variant="elevated"
            v-bind="propsBtnSave"
          />
        </VCardActions>
      </template>
    </VCard>
    <VSpacer class="mt-32" />
  </VForm>
</template>
<style lang="scss" scoped>
.CLASS-spaceY--dHYAAf {
  margin-top: v-bind(spacey_);
}
</style>
<style module></style>
<style lang="scss"></style>
