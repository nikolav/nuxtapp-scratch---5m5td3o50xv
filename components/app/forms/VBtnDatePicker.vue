<script setup lang="ts">
// ##imports
import { type Dayjs } from "dayjs";
import type { OrNoValue } from "@/types";

// ##config ##const
defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(
  defineProps<{
    label?: any;
    defaultNoValue?: string;
    formatDisplayDate?: any;
    propsBtn?: any;
    propsContainer?: any;
    propsMenu?: any;
    propsIconExpand?: any;
  }>(),
  {
    defaultNoValue: "-izaberi datum-",
  }
);
const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();

// ##utils
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags
const mDatePicked = defineModel<OrNoValue<Dayjs>>();
const toggleMenu = useToggleFlag();
const mDate_ = ref();
// ##data ##auth ##state
// ##computed
const displayDate = computed(() =>
  mDatePicked.value
    ? props.formatDisplayDate
      ? props.formatDisplayDate(mDatePicked.value)
      : mDatePicked.value.local().format("D. MMMM YYYY.")
    : undefined
);
// ##forms ##helpers ##handlers
const select_ = (d?: OrNoValue<Dayjs>) => {
  mDatePicked.value = d;
};
const dateSelected = () => {
  select_(mDate_.value ? $dd.utc(mDate_.value) : undefined);
  toggleMenu.off();
};
// ##watch
// ##hooks:lifecycle
// ##head

// @@eos
</script>
<template>
  <span class="component--VBtnDatePicker grid_" v-bind="propsContainer">
    <span v-if="label" class="label_">
      <slot name="label">
        <span class="ps-px opacity-50 text-caption">{{ label }}</span>
      </slot>
    </span>
    <span class="body_ d-inline-block ma-0 pa-0 position-relative">
      <Iconx
        size="1.22rem"
        icon="$expand"
        class="position-absolute top-1/2 -translate-y-[50%] end-4 z-[1] opacity-50 pointer-events-none"
        v-bind="propsIconExpand"
      />
      <VBtn
        class="!text-lg text-none"
        size="large"
        block
        rounded="pill"
        variant="elevated"
        color="on-surface"
        height="54"
        v-bind="propsBtn"
      >
        <span>{{ displayDate ?? defaultNoValue }}</span>
        <VMenu
          v-model="toggleMenu.isActive.value"
          activator="parent"
          location="center"
          :transition="DEFAULT_TRANSITION"
          :close-on-content-click="false"
          v-bind="propsMenu"
        >
          <VForm @submit.prevent="dateSelected" class="overflow-visible">
            <VDatePicker
              v-model="mDate_"
              :max="new Date().toISOString()"
              :title="label"
              hide-header
              elevation="5"
              color="primary-darken-1"
              v-bind="$attrs"
            >
              <template #actions>
                <VSpacer />
                <VBtn
                  min-width="133px"
                  elevation="1"
                  size="large"
                  rounded="pill"
                  type="submit"
                  >ok</VBtn
                >
                <VSpacer />
              </template>
            </VDatePicker>
          </VForm>
        </VMenu>
      </VBtn>
    </span>
  </span>
</template>
<style lang="scss" scoped>
.grid_ {
  display: grid;
  grid-template-areas: "label" "body";
  gap: 0;
  .label_ {
    grid-area: label;
  }
  .body_ {
    grid-area: body;
  }
}
</style>
<style module></style>
<style lang="scss"></style>
