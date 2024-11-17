// assetsList(
//   aids           : [ID!],
//   type           : String,
//   own            : Boolean,
//   aids_subs_only : [ID!],
//   aids_subs_type : String):
// [Asset!]!
export const useQueryManageAssetsComms = (
  CIDS?: any,
  OWN?: any,
  OPTIONS?: any,
  VARS_ADDITIONAL?: any
) => {
  const {
    db: {
      Assets: {
        type: { DIGITAL_CHAT },
      },
    },
  } = useAppConfig();
  return useQueryManageAssets(
    DIGITAL_CHAT,
    CIDS,
    OWN,
    OPTIONS,
    VARS_ADDITIONAL
  );
};
