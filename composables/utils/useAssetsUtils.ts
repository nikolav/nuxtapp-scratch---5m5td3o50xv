
export const useAssetsUtils = () => {
  const {
    db: {
      Assets: {
        AssetsStatus: { ACTIVE },
      },
    },
  } = useAppConfig();
  const assetsIsActive = (a: any) => ACTIVE === a.status;
  return {
    assetsIsActive,
  };
};
