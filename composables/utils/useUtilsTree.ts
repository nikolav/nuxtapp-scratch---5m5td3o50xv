import { tree } from "nikolav-treets";
export const useUtilsTree = () => {
  const t = ref(new tree());
  return t;
};
