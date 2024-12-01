import type { IDocs } from "@/types";
import { Q_assetsFormsSubmissionsList } from "@/graphql";

export const useQueryAssetsFormsSubmissionsSearch = () => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();

  const { result, load, loading, refetch } = useLazyQuery<{
    assetsFormsSubmissionsList: IDocs[];
  }>(Q_assetsFormsSubmissionsList, undefined, {
    pollInterval: STORAGE_QUERY_POLL_INTERVAL,
  });
  const qStart = async () => await load();
  const reload = async () => await refetch();
  const submissions = computed(
    () => result.value?.assetsFormsSubmissionsList ?? []
  );
  useOnceMountedOn(true, qStart);

  return { submissions, reload, loading };
};
