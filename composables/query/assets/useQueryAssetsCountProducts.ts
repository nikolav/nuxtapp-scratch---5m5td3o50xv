export const useQueryAssetsCountProducts = (...args: any[]) => {
  const {
    db: {
      Assets: {
        type: { PHYSICAL_PRODUCT },
      },
    },
  } = useAppConfig();
  return useQueryAssetsCount(PHYSICAL_PRODUCT, ...args);
};
