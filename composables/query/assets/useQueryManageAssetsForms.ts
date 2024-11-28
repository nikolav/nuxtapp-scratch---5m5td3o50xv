import { M_assetsFormsSubmission } from "@/graphql";
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
  const { mutate: mFormsSubmission } = useMutation(M_assetsFormsSubmission);
  // assetsFormsSubmission(data: JsonData!, fid: ID!, key: String): JsonData!
  const submission = async (data: any, fid: any, key?: any) =>
    await mFormsSubmission({ data, fid, key });

  const q = useQueryManageAssets(
    DIGITAL_FORM,
    FIDS,
    OWN,
    OPTIONS,
    VARS_ADDITIONAL
  );

  return {
    ...q,
    submission,
  };
};
