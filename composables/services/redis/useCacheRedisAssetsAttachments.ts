import { schemaFileInfo } from "@/schemas";
export const useCacheRedisAssetsAttachments = (
  AID?: any,
  enableWatchIO: any = true
) => {
  const { assetsAttachments } = useTopics();
  const cc = useCacheRedis(
    () => assetsAttachments(toValue(AID)),
    enableWatchIO
  );
  const keys = computed(() =>
    Object.keys(cc.cache.value).filter((key) => null != cc.cache.value[key])
  );
  const size = computed(() => keys.value.length);
  const remove = async (key: string) => await cc.commit({ [key]: null });
  const cache_ = computed(() =>
    transform(
      cc.cache.value,
      (res: any, node: any) => {
        if (includes(keys.value, node?.key)) {
          res[node.key] = node;
        }
      },
      <any>{}
    )
  );
  const keygen = (prefix: any = "") =>
    `${prefix ? String(prefix) + ":" : ""}${uuid()}`;
  const attachmentMake = async (file: File, uploaded_at: any = Date.now()) => ({
    ...schemaFileInfo.parse(file),
    dataurl: await dataUrl(file),
    key: keygen(uploaded_at),
    uploaded_at,
  });

  return {
    ...cc,
    files: cache_,
    remove,
    keys,
    size,
    keygen,
    attachmentMake,
  };
};
