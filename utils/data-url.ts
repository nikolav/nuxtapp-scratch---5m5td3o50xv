export const dataUrl = (file: File) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result);
    reader.readAsDataURL(file);
  });

export const dataBase64 = async (file: File) => {
  const d = String(await dataUrl(file)) || "";
  return d.split(",")[1] || "";
};
