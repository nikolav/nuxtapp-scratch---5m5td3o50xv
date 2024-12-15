<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import { VBtnPanelClose } from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const mIsActive = defineModel<any>();
const props = withDefaults(
  defineProps<{
    propsBtnClose?: any;
    showClose?: boolean;
  }>(),
  {
    showClose: true,
  }
);

const {
  app: { BODY_ADD_CLASS, DEFAULT_TRANSITION },
} = useAppConfig();
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
// ##icons
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
  <VDialog
    v-model="mIsActive"
    :attach="`.${BODY_ADD_CLASS}`"
    :fullscreen="!smAndUp"
    location="center center"
    persistent
    no-click-animation
    :transition="DEFAULT_TRANSITION"
    :scrim="smAndUp"
    class="component--VDialogPrimary"
    v-slot="{ isActive }"
  >
    <VBtnPanelClose
      v-if="showClose"
      @click="
        () => {
          isActive.value = false;
        }
      "
      class="z-[1]"
      v-bind="propsBtnClose"
    />
    <slot :isActive="isActive" />
  </VDialog>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
