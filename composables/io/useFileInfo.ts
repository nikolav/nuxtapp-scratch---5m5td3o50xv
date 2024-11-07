import { schemaFileInfo } from "@/schemas";
import type { OrNoValue, IFileSizeUnit } from "@/types";
const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const LOG1024 = Math.log(1024);
export const useFileInfo = (FILE?: any) => {
  const file = ref<OrNoValue<File>>();
  watchEffect(() => {
    file.value = toValue(FILE);
  });
  const fileSizeForHumans = (
    siteBytes: number,
    decimalPlaces = 0
  ): IFileSizeUnit => {
    if (0 == siteBytes) return { size: "0", unit: units[0] };
    const i = Math.floor(Math.log(siteBytes) / LOG1024);
    const size = (siteBytes / Math.pow(1024, i)).toFixed(decimalPlaces);
    return { size, unit: units[i] };
  };

  const info = computed(() =>
    file.value ? schemaFileInfo.parse(file.value) : undefined
  );
  const sizeh = computed(() =>
    info.value ? fileSizeForHumans(info.value.size) : undefined
  );

  const toDataUrl = async () =>
    file.value ? String(await dataUrl(file.value)) : "";

  return {
    _file: file,
    info,
    sizeh,
    // utils
    toDataUrl,
    fileSizeForHumans,
  };
};
