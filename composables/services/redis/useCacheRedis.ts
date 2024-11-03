import type { OrNoValue, RecordJson } from "@/types";
import { Q_cacheRedisGetCacheByKey, M_cacheRedisCommit } from "@/graphql";
export const useCacheRedis = (CACHE_KEY?: any) => {
  const {
    redis: { defaultCacheKey },
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const { ioeventRedisCacheKey } = useTopics();
  const auth = useStoreApiAuth();
  const cache_key = ref<any>();
  watchEffect(() => {
    cache_key.value = toValue(CACHE_KEY) || defaultCacheKey;
  });
  const enabled = computed(() => !!(cache_key.value && auth.isAuthenticated$));
  const {
    load: qStart,
    result,
    refetch,
    loading,
  } = useLazyQuery<{
    cacheRedisGetCacheByKey: {
      error: any;
      status: { cache: { [key: string]: RecordJson } };
    };
  }>(
    Q_cacheRedisGetCacheByKey,
    {
      cache_key,
    },
    {
      enabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const store = computed(() =>
    get(
      result.value,
      `cacheRedisGetCacheByKey.status.cache[${cache_key.value}]`,
      {}
    )
  );
  useOnceMountedOn(enabled, () => qStart());
  const reload = async () => await refetch();
  // @patch
  const { mutate: mutateCacheCommit, loading: mutateLoading } =
    useMutation(M_cacheRedisCommit);
  const commit = async (patch?: OrNoValue<RecordJson>, merge = true) =>
    enabled.value
      ? await mutateCacheCommit({
          cache_key: cache_key.value,
          patch,
          merge,
        })
      : undefined;
  // @io
  const ioevent_ = computed(() => ioeventRedisCacheKey(cache_key.value));
  watchEffect(() => useIOEvent(ioevent_.value, reload));
  // @processing
  const processing = computed(() => loading.value || mutateLoading.value);
  //
  return {
    cache_key,
    store,
    commit,
    enabled,
    reload,
    processing,
  };
};