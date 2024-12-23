import {
  M_catalogOrderAdd,
  M_catalogOrderRemove,
  M_catalogManageTags,
} from "@/graphql";
export const useMutationCatalog = () => {
  const { mutate: mutateCatalogAdd, loading: loadindCatalogAdd } =
    useMutation(M_catalogOrderAdd);
  const { mutate: mutateCatalogRemove, loading: loadindCatalogRemove } =
    useMutation(M_catalogOrderRemove);
  const { mutate: mutateCatalogConfig, loading: loadindCatalogConfig } =
    useMutation(M_catalogManageTags);

  const catalogAdd = async (sid: any, items: any) =>
    await mutateCatalogAdd({ sid, items });
  const catalogRemove = async (ids: any) => await mutateCatalogRemove({ ids });
  const catalogConfigTags = async (id: any, config: any) =>
    await mutateCatalogConfig({ id, config });

  const processing = computed(
    () =>
      loadindCatalogAdd.value ||
      loadindCatalogRemove.value ||
      loadindCatalogConfig.value
  );

  return {
    processing,
    catalogAdd,
    catalogRemove,
    catalogConfigTags,
  };
};
