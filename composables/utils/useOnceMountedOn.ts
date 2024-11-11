export const useOnceMountedOn = (VALUE$: any, callback: () => void) => {
  const initialized = ref(false);
  const mounted = useMounted();
  watch([mounted, () => toValue(VALUE$)], ([isMounted, value]) => {
    if (initialized.value) return;
    if (!isMounted) return;
    if (!value) return;
    try {
      callback();
    } catch (error) {
      throw error;
    } finally {
      initialized.value = true;
    }
  });
  return readonly(initialized);
};
