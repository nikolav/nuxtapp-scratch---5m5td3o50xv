import { URL_APP_PUBLIC, ASSETS_PATH_proizvodi } from "@/config";
export const usePublicUrlAssetProduct = (PID?: any, HOST = URL_APP_PUBLIC) => {
  const pid = ref();
  watchEffect(() => {
    pid.value = toValue(PID);
  });
  const path = computed(() =>
    publicUrlAssetProduct(pid.value, HOST, ASSETS_PATH_proizvodi)
  );
  return readonly(path);
};
