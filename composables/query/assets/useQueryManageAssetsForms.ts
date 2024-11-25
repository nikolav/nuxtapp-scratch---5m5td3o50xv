export const useQueryManageAssetsForms = (
  FIDS?: any,
  OWN?: any,
  OPTIONS?: any,
  VARS_ADDITIONAL?: any
) => {
  const {
    db: {
      Assets: {
        type: { DIGITAL_FORM },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(
    DIGITAL_FORM,
    FIDS,
    OWN,
    OPTIONS,
    VARS_ADDITIONAL
  );
};
