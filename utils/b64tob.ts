// convert base64 to Blob
export const b64tob = (dBase64: string, mimetype = "", sliceSize = 512) => {
  // Decode base64 string to binary string
  const byteCharacters = atob(dBase64);
  const byteArrays = [];
  // Process in chunks
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    // Map each character to its UTF-16 code unit
    const byteNumbers = Array.from(slice, (char) => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  // Create a Blob from Uint8Array chunks
  return new Blob(byteArrays, { type: mimetype });
};
// @@usage
// // Convert base64 string to a Blob
// const pdfBlob = b64tob(base64PDF, "application/pdf");
// // Create a URL for the Blob
// const pdfUrl = URL.createObjectURL(pdfBlob);
