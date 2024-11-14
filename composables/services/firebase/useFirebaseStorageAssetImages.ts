import type { OrNoValue, IInputFileUpload } from "@/types";
export const useFirebaseStorageAssetImages = (AID?: any) => {
  const aid = ref();
  const images = ref();
  const { firebasePathAssets } = useTopics();
  watchEffect(() => {
    aid.value = toValue(AID);
  });
  const storage = useFirebaseStorage(() => firebasePathAssets(aid.value));
  const { ls, url, upload } = storage;
  const imagesLoad = async () => {
    images.value = await Promise.all(
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
  watch(aid, async (ID) => {
    if (!ID) return;
    await imagesLoad();
  });

  return {
    id: aid,
    images,
    reload: imagesLoad,
    uploadAll,
    uploadCollection: uploadAll,
    ...storage,
  };
};
