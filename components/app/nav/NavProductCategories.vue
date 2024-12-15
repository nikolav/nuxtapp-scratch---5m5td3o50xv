<script setup lang="ts">
// ##imports
import { ProvideAssetsCount } from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
  db: {
    Assets: {
      type: { PHYSICAL_PRODUCT },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const {
  products: { categories_select_menu: categories_p },
} = useCategoryAssets();
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
  <section class="component--NavProductCategories">
    <VContainer fluid :max-width="791" class="mx-auto">
      <VRow dense>
        <VCol v-for="node in categories_p" :key="node.key" cols="6" sm="4">
          <ProvideAssetsCount
            :type="PHYSICAL_PRODUCT"
            :category="node.key"
            v-slot="{ count }"
          >
            <VCard
              link
              :to="{
                name: 'aktiva-proizvodi',
                query: { 'robna-grupa': kebabCase(node.title) },
              }"
            >
              <VImg
                :src="node.navImage || DEFAULT_NO_IMAGE_AVAILABLE"
                :height="122"
                cover
              >
                <VBadge
                  v-if="0 < count"
                  color="info"
                  inline
                  :content="count"
                  class="position-absolute bottom-0 end-0 z-[1] ma-1"
                />
              </VImg>
              <VCardItem class="*pa-0">
                <VCardTitle class="text-body-2 text-center text-wrap">
                  {{ node.title }}
                </VCardTitle>
              </VCardItem>
            </VCard>
          </ProvideAssetsCount>
        </VCol>
      </VRow>
    </VContainer>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
