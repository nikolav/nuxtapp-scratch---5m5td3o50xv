export const trimEndBase = (text: string, charsRight: string) => {
  const m = text.match(
    new RegExp(`^(.*?)[${charsRight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]+$`)
  );
  return m ? m[1] : text;
};
