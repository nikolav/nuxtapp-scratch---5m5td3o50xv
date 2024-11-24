<script setup lang="ts">
// .key
// .type
// .question
// .description
// .required:bool
// .items[]?
// .multiple:bool?

// ##imports
import type { IConfigFields } from "@/types";
// ##config:const
// ##config ##props
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  formFieldData: any;
  index: number;
}>();
const emit = defineEmits<{
  dropKey: [key: string];
  fieldUpdated: [item: any];
  itemsUpdated: [node: any];
}>();

const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
  db: {
    Assets: { DigitalFormFieldTypes },
  },
} = useAppConfig();

// ##schemas
// ##utils
const FIELDS = <Record<string, IConfigFields>>{
  question: {
    required: true,
    label: "Pitanje: ",
    props: {
      variant: "underlined",
    },
  },
  description: {
    type: "textarea",
    label: "Opis: ",
    props: {
      variant: "underlined",
      rows: 2,
    },
  },
  items: {
    type: "menu",
  },
  required: {
    type: "check:required",
    label: "Unos obavezan",
    props: {
      color: "primary",
    },
  },
  multiple: {
    type: "check:multiple",
    label: "Višestruk izbor",
    props: {
      color: "primary",
    },
  },
};
// ##icons
const ICONS_header = {
  [DigitalFormFieldTypes.TEXT]: {
    icon: "paragraph",
    size: "1.22rem",
    class: "text-primary-darken-1 opacity-50",
  },
  [DigitalFormFieldTypes.BOOLEAN]: {
    icon: "control-switch",
    size: "1.22rem",
    class: "text-primary-darken-1 opacity-50",
  },
  [DigitalFormFieldTypes.CHOICE]: {
    icon: "checklist",
    size: "1.22rem",
    class: "text-primary-darken-1 opacity-50",
  },
  [DigitalFormFieldTypes.FILES]: {
    icon: "$file",
    size: "1.22rem",
    class: "text-primary-darken-1 opacity-50",
  },
  [DigitalFormFieldTypes.RATING]: {
    icon: "$ratingEmpty",
    size: "1.33rem",
    class: "text-primary-darken-1 opacity-50",
  },
};
// ##refs ##flags ##models
const choiceItems = ref(<{ key: string; value: string }[]>[
  { key: uuid(), value: "" },
]);
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const form = useFormModel(`field:${props.formFieldData.key}`, FIELDS, {
  onSubmit: noop,
});
const dd = computed(() =>
  reduce(
    form.data,
    (res: any, item: any, field: string) => {
      if ("items" !== field) {
        res[field] = item.value;
      }
      return res;
    },
    <any>{}
  )
);
const choiceItemsAppend = () => {
  choiceItems.value = [...choiceItems.value, { key: uuid(), value: "" }];
};
const choiceItemsDrop = (key: string) => {
  choiceItems.value = filter(
    choiceItems.value,
    (node: any) => node.key !== key
  );
};
// ##watch
watch(
  dd,
  debounce((dd: any) => {
    emit(
      "fieldUpdated",
      assign({}, { data: dd }, { key: props.formFieldData.key })
    );
  }, SEARCH_DEBOUNCE_DELAY_longer)
);
const valsChoiceItems = computed(() =>
  reduce(
    choiceItems.value,
    (res: any, item: any) => {
      if (item.value) {
        res = [...res, item.value];
      }
      return res;
    },
    <string[]>[]
  )
);
watch(
  valsChoiceItems,
  debounce((items: any) => {
    emit("itemsUpdated", { key: props.formFieldData.key, items });
  }, SEARCH_DEBOUNCE_DELAY_longer)
);
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VForm @submit.prevent="form.submit">
    <VCard class="component--VCardAssetsDigitalFormField" v-bind="$attrs">
      <VToolbar density="compact">
        <template #prepend>
          <VBadge :content="index" inline color="secondary" />
          <Iconx v-bind="ICONS_header[formFieldData.type]" />
        </template>
        <template #append>
          <VBtn
            @click="$emit('dropKey', formFieldData.key)"
            icon
            color="error"
            variant="plain"
            class="opacity-50"
          >
            <Iconx icon="trash" size="1.33rem" />
          </VBtn>
        </template>
      </VToolbar>
      <VCardText>
        <template v-for="(item, field) in FIELDS" :key="field">
          <VTextField
            v-if="!item.type"
            v-model="form.data[field].value"
            :label="item.label"
            v-bind="item.props"
          />
          <VTextarea
            v-if="'textarea' == item.type"
            v-model="form.data[field].value"
            :label="item.label"
            v-bind="item.props"
          />
          <!-- for choices render editable list -->
          <template v-if="DigitalFormFieldTypes.CHOICE === formFieldData.type">
            <VSheet v-if="'menu' == item.type" class="__spacer py-5">
              <VListItemSubtitle class="text-body-1 font-italic ps-2 opacity-40"
                >Opcije:</VListItemSubtitle
              >
              <VList class="py-0" v-if="'menu' == item.type">
                <VListItem v-for="(node, i) in choiceItems" :key="node.key">
                  <VTextField
                    v-model="choiceItems[i].value"
                    hide-details
                    variant="underlined"
                    density="compact"
                    single-line
                    clearable
                    :autofocus="1 + i === len(choiceItems)"
                  >
                    <template #append-inner>
                      <VBtn
                        @click="choiceItemsDrop(node.key)"
                        icon
                        color="error"
                        size="small"
                        variant="plain"
                        density="comfortable"
                        class="opacity-40"
                      >
                        <Iconx icon="$minus" />
                      </VBtn>
                    </template>
                    <template #prepend-inner>
                      <VBadge
                        inline
                        :content="1 + i"
                        color="secondary"
                        class="scale-[81%] opacity-50"
                      />
                    </template>
                  </VTextField>
                </VListItem>
              </VList>
              <VCardActions class="justify-center">
                <VBtn @click="choiceItemsAppend" icon variant="text">
                  <Iconx icon="$plus" />
                  <VTooltip text="Dodaj opciju" />
                </VBtn>
              </VCardActions>
            </VSheet>
            <VCheckbox
              v-if="'check:multiple' == item.type"
              v-model="form.data[field].value"
              :label="item.label"
              hide-details
              v-bind="item.props"
            />
          </template>
          <VCheckbox
            v-if="'check:required' == item.type"
            v-model="form.data[field].value"
            :label="item.label"
            hide-details
            v-bind="item.props"
          />
        </template>
      </VCardText>
    </VCard>
  </VForm>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
