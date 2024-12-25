import { M_docsRm, M_docsUpsert, Q_docsByTopic, M_docsTags } from "@/graphql";
import type { OrNull, IDoc, TDocData, OrNoValue, RecordJson } from "@/types";

// .useDocs
export const useDocs = <TData = TDocData>(
  INITIAL_TOPIC: any = "",
  initialEnabled = true,
  order?: OrNoValue<number>,
  SEARCH?: OrNoValue<RecordJson>
) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
    io: { IOEVENT_DOCS_CHANGE_JsonData },
  } = useAppConfig();
  const topic$ = ref();
  watchEffect(() => {
    topic$.value = toValue(INITIAL_TOPIC);
  });
  const search = ref();
  watchEffect(() => {
    search.value = toValue(SEARCH);
  });
  const toggleEnabled = useToggleFlag(initialEnabled);
  const auth = useStoreApiAuth();
  const enabled$ = computed(
    () => !!(toggleEnabled.isActive.value && auth.isAuth$ && topic$.value)
  );
  const token_ = inject(key_TOKEN);

  const {
    result,
    refetch,
    load: queryStart,
    loading,
    error,
  } = useLazyQuery<{
    docsByTopic: IDoc<TData>[];
  }>(
    Q_docsByTopic,
    {
      topic: topic$,
      order,
      search,
    },
    {
      enabled: enabled$,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );

  const data$ = computed(
    () => (enabled$.value ? result.value?.docsByTopic : undefined) || []
  );
  const length$ = computed(() => len(data$.value));
  const reload = async () => await refetch();
  useOnceMountedOn(enabled$, queryStart);
  // @auth:change reload
  watchEffect(() => {
    if (token_?.value) reload();
  });

  const ioEvent$ = computed(() =>
    enabled$.value ? `${IOEVENT_DOCS_CHANGE_JsonData}${topic$.value}` : ""
  );

  const { mutate: mutateDocsUpsert, loading: upsertLoading } =
    useMutation<IDoc<TData>>(M_docsUpsert);
  const { mutate: mutateDocsRm, loading: rmLoading } =
    useMutation<OrNull<IDoc<TData>>>(M_docsRm);

  const upsert = async (data: TData, id: OrNoValue<number> = null) => {
    if (enabled$.value)
      return await mutateDocsUpsert({ topic: topic$.value, data, id });
  };

  const remove = async (id: OrNoValue<number> = undefined) => {
    if (id && enabled$.value) await mutateDocsRm({ topic: topic$.value, id });
  };

  const { mutate: mutateDocTags, loading: tagsLoading } =
    useMutation(M_docsTags);
  const tags = async (
    id: OrNoValue<number>,
    argsTags: Record<string, boolean>
  ) =>
    id &&
    (isEmpty(argsTags)
      ? undefined
      : await mutateDocTags({ id, tags: argsTags }));

  const processing = computed(
    () =>
      loading.value ||
      upsertLoading.value ||
      rmLoading.value ||
      tagsLoading.value
  );

  // @io/listen
  watchEffect(() => useIOEvent(ioEvent$.value, reload));

  return {
    // # data params: topic, search
    topic$,
    search,

    // # data
    data: data$,
    length: length$,

    // # crud
    upsert,
    remove,
    reload,
    // # manage doc tags
    tags,

    // # flags
    processing,
    error,
    IO: ioEvent$,
    enabled: enabled$,

    // on/off
    toggleEnabled,

    // # alias
    commit: upsert,
    loading: processing,
    IOEVENT: ioEvent$,
  };
};
