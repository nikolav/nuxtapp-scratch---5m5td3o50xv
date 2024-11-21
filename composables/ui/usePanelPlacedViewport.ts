// @@positioned
// :class="[
//         '!top-[33%] -translate-y-[33%]',
//         smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
//       ]"
//       :width="smAndUp ? 412 : '92%'"

import { useDisplay } from "vuetify";

const TOP_class = "!top-[33%] -translate-y-[33%]";
const DEFALT_WIDTH_LG = 345;

const WIDTH_SM_PERCENT = "94%";
const OFFSET_SM_PERCENT_class = "translate-x-[3%]";

export const usePanelPlacedViewport = (top_class = TOP_class) => {
  const { smAndUp } = useDisplay();
  return computed(() => ({
    class: [
      top_class,
      smAndUp.value ? "!start-1/2 -translate-x-1/2" : OFFSET_SM_PERCENT_class,
    ].join(" "),
    width: smAndUp.value ? DEFALT_WIDTH_LG : WIDTH_SM_PERCENT,
  }));
};
