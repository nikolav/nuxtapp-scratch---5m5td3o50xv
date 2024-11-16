import type { IAsset } from "@/types";
import { Q_assetsSearchQ } from "@/graphql";
export const useQueryAssetsSearch = (Q?: any, TYPE?: any, LIMIT?: any) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const q = ref();
  const type = ref();
  const limit = ref();
  watchEffect(() => {
    q.value = toValue(Q);
  });
  watchEffect(() => {
    type.value = toValue(TYPE);
  });
  watchEffect(() => {
    limit.value = toValue(LIMIT);
  });
  const enabled = computed(() => !!q.value);
  const {
    result,
    load: qStart,
    loading,
    refetch,
  } = useLazyQuery<{ assetsSearchQ: IAsset[] }>(
    Q_assetsSearchQ,
    { q, type, limit },
    {
      enabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const reload = async () => await refetch();
  useOnceMountedOn(true, async () => await qStart());

  const assets = computed(() => result.value?.assetsSearchQ || []);
  return { q, assets, reload, loading };
};
