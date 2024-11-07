import type { IObjectUrlWithError } from "@/types";
export const parseObjectURL = (b64data: string, mimetype: string) => {
  const r: IObjectUrlWithError = { error: null, url: null };
  try {
    const d = b64data.split(",")[1] || b64data || "";
    r.url = b64tob(d, mimetype);
  } catch (error) {
    // pass
    r.error = error;
  }
  return r;
};
