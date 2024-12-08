export const useWindowScrollYAndUp = (Y?: any) => {
  const {
    app: { SCROLL_TOP_BTN_YTRESHOLD },
  } = useAppConfig();
  const yTreshold = computed(() => toValue(Y) || SCROLL_TOP_BTN_YTRESHOLD);
  const { y } = useWindowScroll({ behavior: "smooth" });
  const isActive = computed(() => yTreshold.value < y.value);
  const scrollTop = () => {
    y.value = 0;
  };
  return {
    isActive,
    scrollTop,
  };
};
