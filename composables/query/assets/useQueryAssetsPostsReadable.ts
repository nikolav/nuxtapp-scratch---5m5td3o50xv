import type { IAsset } from "@/types";
import { Q_assetsPostsReadable } from "@/graphql";
import { schemaPaginationInput, schemaAssetsRowsInput } from "@/schemas";

export const useQueryAssetsPostsReadable = (
  PAGINATION?: any,
  ASSETS_ROWS?: any,
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
  const assets_rows = computed(() => {
    try {
      // passes: schema | null | undefined
      return schemaAssetsRowsInput.nullish().parse(toValue(ASSETS_ROWS));
    } catch (error) {
      console.debug(error);
    }
  });
  const enabled = computed(() => toValue(ENABLED));
  const { result, load, loading, refetch } = useLazyQuery<{
    assetsPostsReadable: IAsset[];
  }>(
    Q_assetsPostsReadable,
    { uids: null, pagination, assets_rows },
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
