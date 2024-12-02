import type { IAsset } from "@/types";
import { Q_groupsByUser } from "@/graphql";

export const useQueryGroupsByUser = (UID?: any) => {
  const uid = computed(() => toValue(UID));
  const enabled = computed(() => !!uid.value);
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const { result, load, loading, refetch } = useLazyQuery<{
    groupsByUser: IAsset[];
  }>(
    Q_groupsByUser,
    { uid },
    {
      enabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const reload = async () => await refetch();
  const groups = computed(() => result.value?.groupsByUser || []);
  useOnceMountedOn(enabled, async () => await load());

  return {
    groups,
    loading,
    reload,
  };
};
