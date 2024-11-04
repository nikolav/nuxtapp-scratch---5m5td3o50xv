export const useComponentEl = (REF_LOOKUP?: any) =>
  computed(() => {
    const val = toValue(REF_LOOKUP);
    return get(val, "$el", val);
  });
