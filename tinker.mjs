import ld from "lodash";

const { transform, map, escapeRegExp, get } = ld;

const x = "FOO:BAR:";

console.log(
  get("FOO:BAR:122".match(new RegExp(`^${escapeRegExp(x)}(.*)$`)), "[1]")
);
