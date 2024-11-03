import type { OrNoValue } from "@/types";
export const useStoreCacheRedis = defineStore(
  "cache:redis:1fb0f7f9-a4f3-5b5b-a4c1-6bcfc77aa3ba",
  <TStore = any>() => {
    const store = ref<OrNoValue<{ key: string; value: TStore }>>();
    const use = async () => {};
    const commit = async (patch?: any) => {};
    return {
      store,
      use,
      commit,
    };
  }
);
