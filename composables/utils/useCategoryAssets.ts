import mp from "~/assets/app/categories.assets.products.json";
import mg from "~/assets/app/categories.assets.groups.json";
import ms from "~/assets/app/categories.assets.sites.json";

import { CATEGORY_KEY_ASSETS_prefix } from "@/config";

//  menu:products
const t_menu = new TreeModel();
const menu = t_menu.parse({ children: mp });
const top = menu;
const categories_select_menu = top
  .all((node: any) => isEmpty(node.children))
  .map((node: any) => ({
    title: node.model.title,
    value: node.model.key,
  }));

// menu:groups
const t_menu_groups = new TreeModel();
const menu_groups = t_menu_groups.parse({ children: mg });
const top_g = menu_groups;
const categories_select_menu_g = top_g
  .all((node: any) => isEmpty(node.children))
  .map((node: any) => ({
    title: node.model.title,
    value: node.model.key,
  }));

// menu:sites
const t_menu_sites = new TreeModel();
const menu_sites = t_menu_sites.parse({ children: ms });
const top_s = menu_sites;
const categories_select_menu_s = top_s
  .all((node: any) => isEmpty(node.children))
  .map((node: any) => ({
    title: node.model.title,
    value: node.model.key,
  }));

//
const re_tag_ = new RegExp(`^${escapeRegExp(CATEGORY_KEY_ASSETS_prefix)}(.*)$`);
const matchTag = (tag: string) => get(tag.match(re_tag_), "[1]", "");

export const useCategoryAssets = () => {
  const isCategoryTag = (value?: any) =>
    value && String(value).startsWith(CATEGORY_KEY_ASSETS_prefix);
  const categoryTagByAsset = (asset?: any) =>
    find(asset?.tags || [], (t: string) =>
      t.startsWith(CATEGORY_KEY_ASSETS_prefix)
    );
  const categoryNodeByTag = (tag?: string, parent: any = top) => {
    if (!isCategoryTag(tag)) return;
    const key_ = matchTag(tag!);
    return parent.first((node: any) => key_ === node.model.key);
  };
  const categoryNode = (asset: any, parent: any = top) =>
    categoryNodeByTag(categoryTagByAsset(asset), parent);

  const sitesCategoriesFormAssetSite = (node: any) =>
    [get(categoryNode(node, top_s), "model.title")].filter(Boolean);

  const groupsCategoriesFormAssetGroup = (node: any) =>
    [get(categoryNode(node, top_g), "model.title")].filter(Boolean);

  const productsCategoriesFormAssetProduct = (node: any) =>
    [get(categoryNode(node, top), "model.title")].filter(Boolean);

  return {
    categoryNodeByTag,
    categoryTagByAsset,
    categoryNode,
    isCategoryTag,
    matchTag,

    // categories:products
    menu,
    top,
    categories_select_menu,

    // categories:products
    products: {
      menu,
      top,
      categories_select_menu,
      itemCategories: productsCategoriesFormAssetProduct,
    },

    // categories:groups
    groups: {
      menu: menu_groups,
      top: top_g,
      categories_select_menu: categories_select_menu_g,
      itemCategories: groupsCategoriesFormAssetGroup,
    },

    // categories:sites
    sites: {
      menu: menu_sites,
      top: top_s,
      categories_select_menu: categories_select_menu_s,
      itemCategories: sitesCategoriesFormAssetSite,
    },
  };
};
