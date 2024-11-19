export const useQueryManageAssetsProducts = (
  PIDS?: any,
  OWN: any = false,
  OPTIONS?: any
) => {
  const {
    db: {
      Assets: {
        type: { PHYSICAL_PRODUCT },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(PHYSICAL_PRODUCT, PIDS, OWN, OPTIONS);
};
