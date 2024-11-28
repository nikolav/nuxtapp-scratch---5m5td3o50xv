export const usePathUtils = () => {
  const auth = useStoreApiAuth();
  const { $dd } = useNuxtApp();
  const { calcDisplayName } = useAuthUtils();
  // format: <KEY>? <[date]> <@user#ID>'
  const assetsFormsSubmissionAttachmentsPath = (
    key_prefix: any,
    field: string,
    userName_force = ""
  ) =>
    `${key_prefix ? `${key_prefix} ` : ""}[${$dd().format(
      "DD. MMMM, YYYY."
    )}] @${userName_force || calcDisplayName(auth.user$)}#${auth.uid}/${field}`;

  return {
    assetsFormsSubmissionAttachmentsPath,
  };
};
