<script setup lang="ts">
// ##imports
import { VChipUserAvatar } from "@/components/app";
// ##config:const
// ##config ##props
const props = defineProps<{ form: any }>();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// const itemTitle = (f: any) => startCase(f.name);
const itemTitle = (f: any) => f.name;
const formSize = (f: any) => len(get(f, "data.fields"));
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// useHead({ title: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard
    :to="{
      name: 'teren-rid-popuni',
      params: { rid: get(form, 'id') },
    }"
    link
    elevation="1"
    rounded="ts-lg"
  >
    <VCardItem>
      <template #append>
        <VBadge color="info" inline :content="formSize(form)" />
      </template>
      <VCardTitle class="text-body-1">
        <span class="me-3 opacity-85 -translate-y-1 d-inline-block">✍🏻</span>
        <span>
          {{ itemTitle(form) }}
        </span>
      </VCardTitle>
    </VCardItem>
    <VCardText v-if="form.notes">
      <p class="text-medium-emphasis text-body-2 line-clamp-3">
        {{ form.notes }}
      </p>
    </VCardText>
    <VCardText>
      <VChipUserAvatar tooltip="Autor" :user="get(form, 'author')" />
    </VCardText>
  </VCard>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
