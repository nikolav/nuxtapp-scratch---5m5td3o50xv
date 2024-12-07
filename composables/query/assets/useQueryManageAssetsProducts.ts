export const useQueryManageAssetsProducts = (
  PIDS?: any,
  OWN: any = false,
  OPTIONS?: any,
  VARS_ADDITIONAL?: any
) => {
  const {
    db: {
      Assets: {
        type: { PHYSICAL_PRODUCT },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(
    PHYSICAL_PRODUCT,
    PIDS,
    OWN,
    OPTIONS,
    VARS_ADDITIONAL
  );
};
