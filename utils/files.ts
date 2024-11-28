import { typeCore } from "./type-core";

const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".tiff",
  ".svg",
];
export const filesIsImage = (f: File) =>
  f.type.startsWith("image/") ||
  some(imageExtensions, (ext: string) => f.name.toLowerCase().endsWith(ext));

export const filesIsPdf = (f: File) =>
  f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

export const filesIsFile = (node: any) => "[object File]" === typeCore(node);
