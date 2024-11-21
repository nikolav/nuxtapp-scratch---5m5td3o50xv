export const useQueryManageAssetsForms = (
  FIDS?: any,
  OWN: any = true,
  OPTIONS?: any
) => {
  const {
    db: {
      Assets: {
        type: { DIGITAL_FORM },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(DIGITAL_FORM, FIDS, OWN, OPTIONS);
};
