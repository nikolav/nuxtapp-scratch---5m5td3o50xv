import { M_reportsDrop } from "@/graphql";

// reportsDrop(ids: [ID!]!): JsonData!
export const useQueryReportsManage = () => {
  const { mutate: mutateDrop, loading: loadingDrop } =
    useMutation(M_reportsDrop);

  const drop = async (...ids: any[]) => await mutateDrop({ ids });
  const processing = computed(() => some([loadingDrop.value]));

  return {
    drop,
    processing,
  };
};
