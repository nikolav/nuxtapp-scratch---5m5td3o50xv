<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import {
  VFabMain,
  VCardDataIterator,
  ProvideAssetImages,
  VBtnOpenGallery,
  VSheetPinCodeRequired,
} from "@/components/app";
import { Iconx } from "@/components/icons";
import { query } from "firebase/database";
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { DEFAULT_TRANSITION, TOOLTIPS_OPEN_DELAY },
} = useAppConfig();
const { smAndUp } = useDisplay();

const productsSelected = ref();
const {
  assets: products,
  reload,
  // remove: assetsRemove,
  processing,
} = useQueryManageAssetsProducts();
const itemLinkTo = (item: any) => ({
  to: {
    name: "aktiva-proizvodi-pid",
    params: { pid: item?.id },
  },
  external: true,
  target: "_blank",
});
const { categoryNodeByTag, categoryTagByAsset } = useCategoryAssets();
// @@items-groups
const productGrops = (p: any) =>
  [categoryNodeByTag(categoryTagByAsset(p))?.value().title].filter(Boolean);
const getid = (node: any) => get(node, "id");
const assetNameById = (id: any) => get(find(products.value, { id }), "name");

// ##utils
const itemTo = (item: IAsset) => ({
  name: "aktiva-proizvodi-uredi-pid",
  params: { pid: item.id },
});
// ##on:asset-removed
const route = useRoute();
const $$pidRemoved = useGlobalVariable("$$pidRemoved");
useOnceMountedOn(
  () => !isEmpty(products.value),
  async () => {
    if (some(products.value, (p: any) => $$pidRemoved.value == p.id)) {
      $$pidRemoved.value = "";
      console.log("@asset:removed --list-reload");
      await reload();
    }
  }
);
// ##head
useHead({ title: "Roba" });

// @@eos
</script>
<template>
  <section class="page--aktiva-proizvodi">
    <VCardDataIterator
      v-model="productsSelected"
      :items="products"
      item-title="name"
      item-value="id"
      :item-to="itemTo"
      :reload="reload"
      :per-page="6"
      :item-groups="productGrops"
      :card-props="{ disabled: processing }"
      :props-list-item="{ class: 'ps-2' }"
    >
      <template #menu>
        <pre>{{ productsSelected?.length }}</pre>
      </template>
      <template #list-item-title="{ item, title }">
        <span class="d-inline-flex items-center translate-y-[2px]">
          <!-- @@btn:assets:images -->
          <ProvideAssetImages :aid="getid(item)" v-slot="{ images }">
            <VBtnOpenGallery
              :hide-if-empty="true"
              :slides="images.map((src) => ({ src }))"
              :show-badge="false"
              variant="text"
              color="secondary"
              density="comfortable"
              class="pa-0 ma-0"
            />
          </ProvideAssetImages>
          <NuxtLink v-bind="itemLinkTo(item)">
            <VBtn
              @click.stop
              icon
              variant="text"
              size="small"
              density="comfortable"
              color="secondary"
              class="ms-2"
            >
              <Iconx
                icon="tabler:external-link"
                size="1.33rem"
                class="*-translate-y-px"
              />
            </VBtn>
          </NuxtLink>
          <span class="ps-4">{{ title }}</span>
        </span>
      </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-proizvodi-nov' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
