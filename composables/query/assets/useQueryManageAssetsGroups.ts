export const useQueryManageAssetsGroups = (GIDS?: any, OWN?: any) => {
  const {
    db: {
      Assets: {
        type: { PEOPLE_GROUP_TEAM },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(PEOPLE_GROUP_TEAM, GIDS, OWN);
};
