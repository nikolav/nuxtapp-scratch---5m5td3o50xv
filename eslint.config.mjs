import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt({
  // options here
})
  // ...Prepend some flat configs in front
  .prepend()
  // Override some rules in a specific config, based on their name
  // .override("nuxt/typescript", {
  .override("vue", {
    rules: {
      // ...Override rules, for example:
      // "@typescript-eslint/ban-types": "off",

      "no-v-for-template-key": "off",
    },
  });
// ...you can chain more operations as needed
