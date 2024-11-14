import type { OrNoValue, IInputFileUpload } from "@/types";
export const useFirebaseStorageAttachments = (config: {
  ID?: any;
  KEY?: any;
}) => {
  const id = ref();
  const attachmentsKey = config.KEY || identity;
  const attachments = ref();
  watchEffect(() => {
    id.value = toValue(config.ID);
  });
  const storage = useFirebaseStorage(() => attachmentsKey(id.value));
  const { ls, url, upload } = storage;
  const attachmentsReload = async () => {
    attachments.value = await Promise.all(
      map(await ls(), async (node: any) => await url(node.name))
    );
  };
  const uploadAll = async (ls: OrNoValue<File[]>) => {
    if (isEmpty(ls)) return;
    return await upload(
      reduce(
        ls,
        (res: IInputFileUpload, file: File) => {
          res[file.name] = { file };
          return res;
        },
        <IInputFileUpload>{}
      )
    );
  };
  watch(id, async (ID) => {
    if (!ID) return;
    await attachmentsReload();
  });

  return {
    id,
    attachments,
    reload: attachmentsReload,
    uploadAll,
    // alias
    images: attachments,
    uploadCollection: uploadAll,
    // module:main
    ...storage,
  };
};
