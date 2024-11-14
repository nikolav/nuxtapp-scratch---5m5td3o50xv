// get fileName part from full url string
//  https://host.com/path/<file.pdf>?key=122333
export const urlFilename = (url: string) =>
  matchAfterLastSlash(decodeURIComponent(new URL(url).pathname));
