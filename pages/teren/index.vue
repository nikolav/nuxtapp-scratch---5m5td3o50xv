<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import {
  VFabMain,
  VCardDataIterator,
  VCardFormsSubmission,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { submissions, reload } = useQueryAssetsFormsSubmissionsSearch();
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const itemGroups = (r: any) => [startCase(get(r, "asset.name"))];

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📝 Izveštaji" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren">
    <VCardDataIterator
      :item-groups="itemGroups"
      item-title="key"
      :items="submissions"
      :per-page="-1"
      :reload="reload"
      hide-pagination
      :props-list="{ class: 'py-0' }"
    >
      <template #list-item="{ node, i, select, isSelected }">
        <VCardFormsSubmission
          rounded
          :submission="node.raw"
          :i="i"
          :select="() => select([node])"
          :isSelected="() => isSelected([node])"
          class="ma-2"
        />
      </template>
    </VCardDataIterator>
    <VFabMain :to="{ name: 'teren-izvestaji' }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
