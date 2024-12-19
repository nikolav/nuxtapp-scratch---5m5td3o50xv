<script setup lang="ts">
import { useDisplay } from "vuetify";
import { URL_PRODUCT_PREVIEW_HOST } from "@/config";
import type { IAsset } from "@/types";
import {
  VFabMain,
  ProvideAssetImages,
  VBtnOpenGallery,
  NavProductCategories,
  VEmptyStateNoData,
} from "@/components/app";

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
const formatTitle = (p: IAsset) => startCase(p.name);
// ##head
useHead({ title: "Roba" });

// @@eos
</script>
<template>
  <section class="page--aktiva-proizvodi">
    <template v-if="!enabled">
      <NavProductCategories />
    </template>
    <VCard
      v-else
      flat
      variant="text"
      rounded="0"
      elevation="0"
      :disabled="processing"
    >
      <VToolbar density="comfortable" color="surface" class="pa-0">
        <VSheet
          class="grow p-0 !ps-[2px] justify-between d-flex mx-auto"
          max-width="512"
        >
          <VBtn
            v-for="node in categories_p"
            :key="node.title"
            icon
            :to="{
              name: 'aktiva-proizvodi',
              query: {
                'robna-grupa': kebabCase(node.title),
              },
            }"
            :variant="
              category_slug == kebabCase(node.title) ? 'tonal' : 'plain'
            "
            size="small"
            color="primary"
            class="!text-[100%]"
            >{{ node.emoji }}</VBtn
          >
        </VSheet>
      </VToolbar>
      <VDivider class="border-opacity-100 mx-auto" length="66%" />
      <VSpacer class="mt-3" />
      <VEmptyStateNoData v-if="isEmpty(products)" class="opacity-50" />
      <VList v-else variant="text" activatable density="compact" class="py-0">
        <VListItem
          v-for="item in products"
          :key="item.key"
          class="ps-2 pe-1"
          :to="itemTo(item)"
        >
          <template #append>
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
                  size="1.22rem"
                  class="*-translate-y-px"
                />
              </VBtn>
            </NuxtLink>
          </template>
          <span class="d-inline-flex items-center *translate-y-[2px]">
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
            <VListItemTitle class="ps-3 text-body-1">
              {{ formatTitle(item) }}
            </VListItemTitle>
          </span>
        </VListItem>
      </VList>
    </VCard>

    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-proizvodi-nov' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
