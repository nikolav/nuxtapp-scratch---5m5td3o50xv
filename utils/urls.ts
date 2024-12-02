import { URL_STORAGE, URL_APP_PUBLIC, ASSETS_PATH_proizvodi } from "../config";

// get fileName part from full url string
//  https://host.com/path/<file.pdf>?key=122333
export const urlFilename = (url: string) =>
  matchAfterLastSlash(decodeURIComponent(new URL(url).pathname));

export const publicUrlAssetProduct = (
  p: any,
  host = URL_APP_PUBLIC,
  path = ASSETS_PATH_proizvodi
) =>
  p
    ? `${trim(host, "/")}/${trim(path, "/")}?q=${encodeURIComponent(p.id)}`
    : "";

// [trim(host, "/"), trim(path, "/"), encodeURIComponent(p.id)].join("/")

export const resourceUrl = (file_id: string = "") =>
  file_id ? `${URL_STORAGE}/${file_id}` : "";
