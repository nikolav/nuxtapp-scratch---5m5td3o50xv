<script setup lang="ts">
import { useDisplay } from "vuetify";
import { URL_PRODUCT_PREVIEW_HOST } from "@/config";
import type { IAsset } from "@/types";
import {
  VFabMain,
  VCardDataIterator,
  ProvideAssetImages,
  VBtnOpenGallery,
  NavProductCategories,
} from "@/components/app";

const DEFAULT_PRODUCTS_PER_PAGE = 25;

definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

// user .query slug:robna-grupa to switch categories
const route = useRoute();
const {
  CATEGORY_KEY_ASSETS_prefix,
  products: { categories_select_menu: categories_p, menu: menu_p },
} = useCategoryAssets();
// slug from query
const category_slug = computed(() => get(route.query, "robna-grupa"));
// category:full from slug
const category = computed(() =>
  category_slug.value
    ? `${CATEGORY_KEY_ASSETS_prefix}${get(
        menu_p.first(
          (node: any) => category_slug.value === kebabCase(node.model.title)
        ),
        "model.key"
      )}`
    : undefined
);
const enabled = computed(() => !!category.value);

const { smAndUp } = useDisplay();

const productsSelected = ref();

const {
  assets: products,
  reload,
  // remove: assetsRemove,
  processing,
} = useQueryManageAssetsProducts(
  undefined,
  undefined,
  { enabled },
  { category }
);

const itemLinkTo = (itemP: any) => ({
  // to: {
  //   name: "aktiva-proizvodi-pid",
  //   params: { pid: itemP?.id },
  // },
  href: publicUrlAssetProduct(itemP, URL_PRODUCT_PREVIEW_HOST),
  // external: true,
  target: "_blank",
});
// const { categoryNode } = useCategoryAssets();
// @@items-groups
// const productGrops = (p: any) =>
//   [get(categoryNode(p), "model.title")].filter(Boolean);

// ##utils
const itemTo = (item: IAsset) => ({
  name: "aktiva-proizvodi-uredi-pid",
  params: { pid: item.id },
});
// ##on:asset-removed
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
// ## helpers
const fmtTitle = (p: IAsset) => startCase(p.name);
// ##head
useHead({ title: "Roba" });

// @@eos
</script>
<template>
  <section class="page--aktiva-proizvodi">
    <template v-if="!enabled">
      <NavProductCategories />
    </template>
    <VCardDataIterator
      v-else
      v-model="productsSelected"
      :items="products"
      item-title="name"
      item-value="id"
      :item-to="itemTo"
      :reload="reload"
      :per-page="DEFAULT_PRODUCTS_PER_PAGE"
      :item-groups="null"
      :card-props="{ disabled: processing }"
      :props-list-item="{ class: 'ps-2' }"
      :format-title="fmtTitle"
      hide-categories-available
      enabled-dots-menu
      :props-dots-menu-icon="{ size: '1.5rem' }"
      :menu-props="{ offset: -22 }"
    >
      <template #menu>
        <!-- render nav, category picker -->
        <VList>
          <VListItem
            v-for="node in categories_p"
            :key="node.value"
            :to="{
              name: 'aktiva-proizvodi',
              query: {
                'robna-grupa': kebabCase(node.title),
              },
            }"
            :active="false"
          >
            <template #prepend>
              <pre>{{ node.emoji }}</pre>
            </template>
            <VListItemTitle class="ps-4">
              <span>
                {{ node.title }}
              </span>
            </VListItemTitle>
          </VListItem>
        </VList>
      </template>

      <template #list-item-title="{ item, title }">
        <span class="d-inline-flex items-center translate-y-[2px]">
          <!-- @@btn:assets:images -->
          <ProvideAssetImages :aid="toIds(item)" v-slot="{ images }">
            <VBtnOpenGallery
              :hide-if-empty="true"
              :slides="images.map((src) => ({ src }))"
              :show-badge="false"
              variant="text"
              color="secondary"
              density="comfortable"
              class="pa-0 ma-0 ms-1"
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
