import { Q_assetsCount } from "@/graphql";
import type { RecordJson } from "@/types";
export const useQueryAssetsCount = (
  ASSET_TYPE?: any,
  OWN: any = false,
  CATEGORY?: any
) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const asset_type = computed(() => toValue(ASSET_TYPE));
  const category = computed(() => toValue(CATEGORY));
  const own = computed(() => toValue(OWN));
  const enabled = computed(() => !!asset_type.value);
  const { result, load: qStart } = useLazyQuery<{ assetsCount: RecordJson }>(
    Q_assetsCount,
    {
      asset_type,
      own,
      category,
    },
    {
      enabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  useOnceMountedOn(enabled, () => qStart());
  const count = computed(
    () =>
      Number(
        get(result.value, `assetsCount.status.count.${asset_type.value}`)
      ) || 0
  );
  return count;
};
