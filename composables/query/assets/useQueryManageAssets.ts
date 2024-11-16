// UgaO7qWtC1r1Xg1vl
import type { IAsset, RecordJson } from "@/types";
import {
  Q_assetsList,
  M_assetsUpsert,
  M_assetsRemove,
  M_groupsGUConfigure,
  M_sitesSGConfig,
} from "@/graphql";
import { schemaHasFieldName as sHasName } from "@/schemas";
// @@useQueryManageAssets
export const useQueryManageAssets = (
  ASSETS_TYPE?: any,
  AIDS?: any,
  OWN: any = true,
  OPTIONS?: any,
  VARS_ADDITIONAL?: any
) => {
  const type = ref();
  watchEffect(() => {
    type.value = toValue(ASSETS_TYPE);
  });

  const aids = ref();
  watchEffect(() => {
    aids.value = toValue(AIDS);
  });

  const own = ref();
  watchEffect(() => {
    own.value = toValue(OWN);
  });

  const vars_add = ref();
  watchEffect(() => {
    vars_add.value = toValue(VARS_ADDITIONAL);
  });

  const variables_ = computed(() => ({
    aids: aids.value,
    type: type.value,
    own: own.value,
    ...vars_add.value,
  }));

  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();

  const {
    result,
    load: queryStart,
    refetch,
    loading,
  } = useLazyQuery<{
    assetsList: IAsset[];
  }>(Q_assetsList, variables_, {
    pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    ...OPTIONS,
  });
  const { mutate: mutateAssetsUpsert, loading: loadingUpsert } =
    useMutation(M_assetsUpsert);
  const { mutate: mutateAssetsRemove, loading: loadingAssetsRemove } =
    useMutation(M_assetsRemove);
  const { mutate: mutateGUConfig, loading: loadingGU } =
    useMutation(M_groupsGUConfigure);
  const { mutate: mutateSitesSGConfig, loading: loadingSG } =
    useMutation(M_sitesSGConfig);

  //
  const assets = computed(() => result.value?.assetsList || []);
  const length = computed(() => assets.value.length);
  const reload = async () => await refetch();
  const commit = async (fields: any, aid?: any) =>
    await mutateAssetsUpsert({
      fields: assign({}, aid ? fields : sHasName.passthrough().parse(fields), {
        type: type.value,
      }),
      aid,
    });
  const remove = async (aids: any) => await mutateAssetsRemove({ aids });
  // group({'+22': [1, 2], '-3': [5], '+3': [45]})
  const group = async (guConfig: RecordJson) =>
    await mutateGUConfig({ guConfig });
  const sitesSGConfig = async (sgConfig: any) =>
    await mutateSitesSGConfig({ sgConfig });

  const { watchProcessing } = useStoreAppProcessing();
  const processing = computed(
    () =>
      loading.value ||
      loadingUpsert.value ||
      loadingAssetsRemove.value ||
      loadingGU.value ||
      loadingSG.value
  );
  watchProcessing(processing);

  useOnceMountedOn(true, () => queryStart());

  const ioevent = computed(() => type.value || "");
  watchEffect(() => useIOEvent(ioevent.value, reload));

  return {
    // @refs
    aids,
    type,
    own,

    // @crud
    assets,
    length,
    commit,
    remove,
    reload,

    // @groups:(un)assign
    group,
    // @sites; (un)assign groups
    sitesSGConfig,

    // @flags
    processing,
  };
};
