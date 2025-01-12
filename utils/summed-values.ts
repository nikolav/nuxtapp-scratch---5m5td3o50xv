export const summedValues = (node: any) =>
  reduce(
    node,
    (s: number, x: any) => {
      if (isNumeric(x)) {
        s += Number(x);
      }
      return s;
    },
    0
  );
