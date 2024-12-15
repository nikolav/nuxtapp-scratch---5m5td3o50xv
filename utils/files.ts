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

export const blobToFile = (blob: any, fileName: string) =>
  new File([blob], fileName, {
    type: blob.type,
    lastModified: Date.now(),
  });

export const isImageBlob = (blob: any) =>
  new Promise((resolve, _reject) => {
    try {
      if (!String(blob.type).startsWith("image/")) throw "!image";
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };
      img.src = url;
    } catch (error) {
      resolve(false);
    }
  });
