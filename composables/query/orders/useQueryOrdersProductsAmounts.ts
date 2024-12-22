import type { OrNoValue, IAsset, IOrders } from "@/types";
import { Q_ordersProductsAmounts } from "@/graphql";

// ordersProductsAmounts(ooid: ID!): OrderItems!
export const useQueryOrdersProductsAmounts = (OOID?: any) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const auth = useStoreApiAuth();
  const ooid = computed(() => toValue(OOID));
  const qenabled = computed(() => !!ooid.value && auth.isAuth$);
  const { result, load, loading, refetch } = useLazyQuery<{
    ordersProductsAmounts: {
      order: OrNoValue<IOrders>;
      items: { amount: number; product: IAsset }[];
    }[];
  }>(
    Q_ordersProductsAmounts,
    { ooid },
    {
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
      enabled: qenabled,
    }
  );
  const reload = async () => await refetch();
  const order = computed(() =>
    get(result.value, "ordersProductsAmounts.order")
  );
  const items = computed(() =>
    get(result.value, "ordersProductsAmounts.items", [])
  );

  useOnceMountedOn(qenabled, async () => await load());

  return {
    items,
    order,
    reload,
    loading,
  };
};
