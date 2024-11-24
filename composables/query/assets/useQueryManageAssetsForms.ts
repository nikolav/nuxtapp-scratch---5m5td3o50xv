export const useQueryManageAssetsForms = (...args: any[]) =>
  // FIDS?: any,
  // OWN: any = true,
  // OPTIONS?: any,
  // VARS_ADDITIONAL?: any
  {
    const {
      db: {
        Assets: {
          type: { DIGITAL_FORM },
        },
      },
    } = useAppConfig();
    return useQueryManageAssets(DIGITAL_FORM, ...args);
  };
