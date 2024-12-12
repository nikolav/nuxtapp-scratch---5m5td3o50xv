import chroma from "chroma-js";

// interface IInputColorWheel {
//   count: number;
//   lightness?: number;
//   start?: any;
//   append?: any[];
//   prepend?: any[];
// }
// // ##config:const
// export const listColorWheel = (
//   config: IInputColorWheel = { count: 12, lightness: 0.33, start: "#ff0000" }
// ) => [
//   ...(config?.prepend || []),
//   ...Array.from({ length: config.count }, (_c, i) =>
//     chroma(config.start)
//       .set("hsl.h", (360 / config.count) * i)
//       .set("hsl.l", config.lightness!)
//       .hex()
//   ),
//   ...(config?.append || []),
// ];

export const listColorWheel = (
  count = 12,
  lightness = 0.33,
  start = "#ff0000"
) => [
  { c: "", key: ":default" },
  ...Array.from({ length: count }, (_c, i) => ({
    c: chroma(start)
      .set("hsl.h", (360 / count) * i)
      .set("hsl.l", lightness)
      .hex(),
    key: String(i),
  })),
];
