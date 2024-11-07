export const useWindowOpenDataUrl = () => {
  const mounted = useMounted();
  return (b64text: string, mimetype: string) => {
    const objurl = parseObjectURL(b64text, mimetype).url;
    return mounted.value && objurl
      ? window.open(URL.createObjectURL(objurl))
      : undefined;
  };
};
