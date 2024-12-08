import type { IAsset } from "@/types";
import { Q_assetsPostsReadable } from "@/graphql";

export const useQueryAssetsPostsReadable = () => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const { result, load, loading, refetch } = useLazyQuery<{
    assetsPostsReadable: IAsset[];
  }>(
    Q_assetsPostsReadable,
    { uids: null },
    {
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const posts = computed(() => result.value?.assetsPostsReadable || []);
  const reload = async () => await refetch();

  useOnceMountedOn(true, () => load());

  return {
    posts,
    reload,
    loading,
  };
};
