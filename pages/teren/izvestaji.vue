<script setup lang="ts">
// ##imports
import { VCardDataIterator, VCardItemFormsSubmit } from "@/components/app";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const { calcDisplayName } = useAuthUtils();
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
      :items="forms"
      :item-groups="itemGroups"
      hide-pagination
      :per-page="-1"
      :reload="formsReload"
    >
      <template #list-item="{ node }">
        <VCardItemFormsSubmit :form="node.raw" class="ma-3" />
      </template>
    </VCardDataIterator>
  </section>
</template>
<style lang="scss" scoped>
.CLASS--zPik9wFa9O0XaNl {
}
</style>
<style module></style>
<style lang="scss"></style>
