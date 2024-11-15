// assetsList(
//   aids           : [ID!],
//   type           : String,
//   own            : Boolean,
//   aids_subs_only : [ID!],
//   aids_subs_type : String):
// [Asset!]!
export const useQueryManageAssetsSites = (
  SIDS?: any,
  OWN?: any,
  OPTIONS?: any,
  VARS_ADDITIONAL?: any
) => {
  const {
    db: {
      Assets: {
        type: { PHYSICAL_STORE },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(
    PHYSICAL_STORE,
    SIDS,
    OWN,
    OPTIONS,
    VARS_ADDITIONAL
  );
};
