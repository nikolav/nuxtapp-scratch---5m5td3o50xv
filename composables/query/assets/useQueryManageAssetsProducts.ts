export const useQueryManageAssetsProducts = (PIDS?: any, OWN: any = false) => {
  const {
    db: {
      Assets: {
        type: { PHYSICAL_PRODUCT },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(PHYSICAL_PRODUCT, PIDS, OWN);
};
