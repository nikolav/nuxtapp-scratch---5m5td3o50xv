export const useTasksUtils = () => {
  const {
    db: {
      Assets: {
        tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
        AssetsStatus,
      },
    },
  } = useAppConfig();
  const isShareable = (task: any) =>
    includes(task?.tags, TAG_ASSETS_SHAREABLE_GLOBALY);
  const isStatusDone = (task: any) => AssetsStatus.DONE === task?.status;
  return { SHAREABLE: TAG_ASSETS_SHAREABLE_GLOBALY, isShareable, isStatusDone };
};
