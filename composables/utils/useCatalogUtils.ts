export const useCatalogUtils = () => {
  const {
    db: {
      Orders: {
        OrdersTags: { SHAREABLE },
      },
    },
  } = useAppConfig();
  const isShareable = (order: any) => includes(order?.tags, SHAREABLE);
  return { SHAREABLE, isShareable };
};
