import { Q_reportsSearch } from "@/graphql";
// reportsSearch(query_strategy: String!, query_strategy_args: JsonData): JsonData!
export const useQueryReportsSearch = (STRATEGY?: any, ARGS?: any) => {
  const query_strategy = computed(() => toValue(STRATEGY));
  const query_strategy_args = computed(() => toValue(ARGS));
  const enabled = computed(() => !!query_strategy.value);
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const { result, load, loading, refetch } = useLazyQuery(
    Q_reportsSearch,
    {
      query_strategy,
      query_strategy_args,
    },
    {
      enabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const reload = async () => await refetch();
  useOnceMountedOn(enabled, async () => await load());

  const reports = computed(() =>
    get(result.value, "reportsSearch.status.reports", [])
  );
  return {
    reports,
    reload,
    loading,
  };
};
