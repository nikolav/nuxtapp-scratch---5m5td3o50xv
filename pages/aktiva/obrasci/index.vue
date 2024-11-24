<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import { VFabMain, VCardDataIterator } from "@/components/app";
import { Dump } from "@/components/dev";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const { smAndUp } = useDisplay();

// ##icons
// ##refs ##flags ##models
const formsSelected = ref();

// ##data ##auth ##state
const {
  assets: forms,
  processing,
  reload: formsReload,
} = useQueryManageAssetsForms();

// ##computed
// ##forms ##handlers ##helpers ##small-utils
const itemLinkToForm = (item: any) => ({
  name: "aktiva-obrasci-fid",
  params: { fid: item?.id },
});
const fmtTitle = (f: any) => startCase(f?.name);

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "🎫 Obrasci" });

// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-obrasci">
    <VCardDataIterator
      v-model="formsSelected"
      :items="forms"
      :card-props="{ disabled: processing }"
      item-title="name"
      :item-to="itemLinkToForm"
      :reload="formsReload"
      :per-page="-1"
      hide-pagination
      :format-title="fmtTitle"
    >
      <template #menu> forms:active </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-obrasci-nov' }"
    />
    <Dump :data="{ forms }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
