const REPORTS_PUBLIC_PATH = "teren/izvestaj";
export const useReportsUtils = () => {
  const {
    db: {
      Docs: {
        DocsTags: { SHAREABLE },
      },
    },
    urls: { appPublic },
  } = useAppConfig();
  const isPublic = (r: any) => (r?.tags || []).includes(SHAREABLE);
  const publicUrl = (r: any) =>
    r
      ? [
          trim(new URL(appPublic).origin, "/"),
          trim(REPORTS_PUBLIC_PATH, "/"),
          encodeURIComponent(r.id),
        ].join("/")
      : "";
  return {
    isPublic,
    publicUrl,
  };
};
