<script setup lang="ts">
// ##imports
import {
  VCardDataIterator,
  VCardItemFormsSubmit,
  VToolbarPrimary,
} from "@/components/app";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const { calcDisplayName } = useAuthUtils();
const { assetsIsActive } = useAssetsUtils();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const {
  assets: forms,
  // processing,
  reload: formsReload,
  // remove: formsRemove,
} = useQueryManageAssetsForms();

// ##computed
const formsActive = computed(() => filter(forms.value, assetsIsActive));
// ##forms ##handlers ##helpers ##small-utils
const itemGroups = (f: any) => [calcDisplayName(f?.author)];
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📃 Izveštaji | Izbor" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-izvestaji">
    <VCardDataIterator
      :items="formsActive"
      :item-groups="itemGroups"
      hide-pagination
      :per-page="-1"
      :reload="formsReload"
    >
      <template #prepend>
        <VToolbarPrimary
          flat
          text="Obrasci za popunjavanje"
          hide-default-close
          :props-title="{ class: 'text-body-2 text-center font-italic pe-3' }"
        />
      </template>
      <template #list-item="{ node }">
        <VCardItemFormsSubmit
          :disabled="!assetsIsActive(node.raw)"
          :form="node.raw"
          class="ma-3"
        />
      </template>
    </VCardDataIterator>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
