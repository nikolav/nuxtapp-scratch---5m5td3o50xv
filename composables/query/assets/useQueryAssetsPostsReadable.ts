import type { IAsset } from "@/types";
import { Q_assetsPostsReadable } from "@/graphql";
import { schemaPaginationInput } from "@/schemas";

export const useQueryAssetsPostsReadable = (
  PAGINATION?: any,
  ENABLED: any = true
) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const pagination = computed(() => {
    try {
      // passes: schema | null | undefined
      return schemaPaginationInput.nullish().parse(toValue(PAGINATION));
    } catch (error) {
      console.debug(error);
    }
  });
  const enabled = computed(() => toValue(ENABLED));
  const { result, load, loading, refetch } = useLazyQuery<{
    assetsPostsReadable: IAsset[];
  }>(
    Q_assetsPostsReadable,
    { uids: null, pagination },
    {
      enabled,
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
