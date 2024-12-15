const DEFAULT_OPTIONS = {
  mimeType: "image/jpeg",
  quality: 0.91,
};
export const useResizeImage = (config?: {
  mimeType?: string;
  quality?: number;
}) => {
  const {
    app: {
      imageResize: { width: W, height: H },
    },
  } = useAppConfig();
  const options = { ...DEFAULT_OPTIONS, ...(config || {}) };
  const resized = (file: any, w: number = W, h: number = H) =>
    new Promise(async (resolve, reject) => {
      if (!file) return reject("@error:no-file:3BJszkBigrdT9YsL5RrR");
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("@error:empty-contenxt:nvPJH");

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > w) {
          height = (w / width) * height;
          width = w;
        }
        if (height > h) {
          width = (h / height) * width;
          height = h;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, options.mimeType, options.quality);
      };
      // load image
      img.src = await dataUrl(file);
    });
  return {
    resized,
  };
};
