export const useQueryManageAssetsPosts = (
  OIDS?: any,
  OWN?: any,
  OPTIONS?: any,
  VARS_ADDITIONAL?: any
) => {
  const {
    db: {
      Assets: {
        type: { DIGITAL_POST },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(
    DIGITAL_POST,
    OIDS,
    OWN,
    OPTIONS,
    VARS_ADDITIONAL
  );
};
