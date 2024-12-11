import { URL_APP_PUBLIC } from "@/config";
export const usePublicUrlAsset = (
  AKEY?: any,
  APATH?: any,
  HOST = URL_APP_PUBLIC
) =>
  computed(() => publicUrlAsset({ key: toValue(AKEY) }, toValue(APATH), HOST));
