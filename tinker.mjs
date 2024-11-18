import ld from "lodash";

const { transform, map, escapeRegExp, get } = ld;

(async () => {
  const res = await fetch("https://zyeqzw35h4kv5b70k7uqim.site");
  const d = await res.json();
  for (const pid of d.prerender.pids) {
    // ctx.routes.add(`/aktiva/proizvodi/${pid}`);
    console.log(`/aktiva/proizvodi/${pid}`);
  }
})();
