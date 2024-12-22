import type { IOrders } from "@/types";
import { Q_assetsAssetsSitesOrders } from "@/graphql";

export const useQuerySiteOrders = (SID?: any) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const sid = computed(() => toValue(SID));
  const qenabled = computed(() => !!sid.value);
  const { result, load, refetch, loading } = useLazyQuery<{
    assetsAssetsSitesOrders: IOrders[];
  }>(
    Q_assetsAssetsSitesOrders,
    {
      sid,
    },
    {
      enabled: qenabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const reload = async () => await refetch();
  const orders = computed(() => result.value?.assetsAssetsSitesOrders || []);

  useOnceMountedOn(qenabled, async () => await load());

  return { orders, reload, loading };
};
