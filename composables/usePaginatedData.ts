import { type Ref } from "vue";
import type { OrNoValue } from "@/types";

export const usePaginatedData = <TData = any>(config: {
  data: OrNoValue<TData[] | Ref<TData[]>>;
  perPage: number;
}) => {
  const page$ = ref(1);
  const length = computed(() => {
    const d = toValue(config.data);
    if (!(0 < config.perPage) || !(d && !isEmpty(d))) return 1;
    return Math.ceil(len(d) / config.perPage);
  });

  return {
    page$,
    length,
    perPage: config.perPage,
  };
};
