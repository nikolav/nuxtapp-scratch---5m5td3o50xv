export const urlFilename = (url: string) =>
  matchAfterLastSlash(decodeURIComponent(new URL(url).pathname));
