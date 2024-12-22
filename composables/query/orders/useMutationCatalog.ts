import { M_catalogOrderAdd } from "@/graphql";
export const useMutationCatalog = () => {
  const { mutate: mutateCatalogAdd, loading: loadindCatalogAdd } =
    useMutation(M_catalogOrderAdd);

  const catalogAdd = async (sid: any, items: any) =>
    await mutateCatalogAdd({ sid, items });

  const processing = computed(() => loadindCatalogAdd.value);

  return {
    catalogAdd,
    processing,
  };
};
