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
  const assetsPostsShareableNetworks = (a: any) =>
    includes(a?.tags, TAG_ASSETS_SHAREABLE_GLOBALY);
  const assetsPostBlocked = (p: any) =>
    AssetsStatus.POSTS_BLOCKED === p?.status;
  const assetsPostActive = (p: any) => !p?.status;
  const assetsPostOpen = (p: any) => AssetsStatus.POSTS_OPEN === p?.status;
  const assetsPostLinkShareable = (p: IAsset) =>
    p?.id
      ? `${trimEnd(appPublic, "/")}/app/objave/pregled?q=${encodeURIComponent(
          p.id
        )}`
      : undefined;

  return {
    assetsIsActive,
    // posts
    assetsPostsShareableNetworks,
    assetsPostBlocked,
    assetsPostActive,
    assetsPostOpen,
    assetsPostLinkShareable,
  };
};
