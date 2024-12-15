import { URL_APP_PUBLIC, ASSETS_PATH_public_forms } from "@/config";
import type { IAsset } from "@/types";

export const useAssetsUtils = () => {
  const {
    db: {
      Assets: {
        AssetsStatus,
        tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
      },
    },
    urls: { appPublic },
  } = useAppConfig();
  const assetsIsActive = (a: any) => AssetsStatus.ACTIVE === a.status;
  const assetIsPublic = (a: any) =>
    includes(a?.tags, TAG_ASSETS_SHAREABLE_GLOBALY);
  const assetsPostsShareableNetworks = assetIsPublic;
  const assetsPostBlocked = (p: any) =>
    AssetsStatus.POSTS_BLOCKED === p?.status;
  const assetsPostActive = (p: any) => !p?.status;
  const assetsPostOpen = (p: any) => AssetsStatus.POSTS_OPEN === p?.status;
  const assetsPostLinkShareable = (p: IAsset) =>
    p?.id
      ? `${trimEnd(appPublic, "/")}/app/objave/pregled?q=${encodeURIComponent(
          p.key!
        )}`
      : undefined;
  const assetsFormsPublicUrl = (a?: any) => {
    // return `http://url/teren/popuni-javni-izvestaj?q=122`;
    const ID = toIds(a);
    return ID
      ? `${[
          trimEnd(URL_APP_PUBLIC, "/"),
          trim(ASSETS_PATH_public_forms, "/"),
        ].join("/")}?q=${ID}`
      : "";
  };

  return {
    assetsIsActive,
    assetIsPublic,
    // posts
    assetsPostsShareableNetworks,
    assetsPostBlocked,
    assetsPostActive,
    assetsPostOpen,
    assetsPostLinkShareable,
    // forms
    assetsFormsPublicUrl,
  };
};
