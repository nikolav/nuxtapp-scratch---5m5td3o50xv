import { M_reportsDrop, M_reportsConfigurationTags } from "@/graphql";

// reportsDrop(ids: [ID!]!): JsonData!
// reportsConfigurationTags(ids: [ID!]!, config: JsonData!): JsonData!
export const useQueryReportsManage = () => {
  const { mutate: mutateDrop, loading: loadingDrop } =
    useMutation(M_reportsDrop);
  const { mutate: mutateConfig, loading: loadingConfig } = useMutation(
    M_reportsConfigurationTags
  );

  const drop = async (...ids: any[]) => await mutateDrop({ ids });
  const configure = async (config: any, ...ids: any[]) =>
    await mutateConfig({ ids, config });
  const processing = computed(() =>
    some([loadingDrop.value, loadingConfig.value])
  );

  return {
    drop,
    configure,
    processing,
  };
};
