import { URL_APP_PUBLIC, ASSETS_PATH_proizvodi } from "@/config";
export const usePublicUrlAssetProduct = (PID?: any, HOST = URL_APP_PUBLIC) =>
  computed(() =>
    publicUrlAssetProduct({ id: toValue(PID) }, HOST, ASSETS_PATH_proizvodi)
  );
