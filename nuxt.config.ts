import { API_URL, SSR, BASE_DIR } from "./config";
import { trimEndBase as trimEnd } from "./utils/trim-end-base";

type TMeta = Record<string, string>[];

const meta: TMeta = [
  { name: "description", content: "NuxtApp --nuxt.config" },
  { name: "theme-color", content: "#fafafa" },
];
//
// @@https --force
// <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
//
// if (API_URL.startsWith("https"))
//   meta.push({
//     "http-equiv": "Content-Security-Policy",
//     content: "upgrade-insecure-requests",
//   });
//

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  ssr: SSR,

  app: {
    ...(BASE_DIR
      ? {
          baseURL: BASE_DIR,
          buildAssetsDir: `${trimEnd(BASE_DIR, "/")}/_nuxt/`,
        }
      : {}),

    //
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1.0, shrink-to-fit=no, minimum-scale=1",
      title: "app",
      // titleTemplate: "%s | tereni:frikom",
      // https://www.geeksforgeeks.org/meta-tags-in-nuxt-js/
      meta,
      //
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
      ],
      bodyAttrs: {
        //  class: "dark:selection:bg-white/20 scrollbar-thin-light",
      },
      noscript: [{ children: "JavaScript is required" }],
    },
    // transition pages
    pageTransition: { name: "BLUR", mode: "out-in" },
    // transition layouts
    layoutTransition: { name: "BLUR", mode: "out-in" },
  },

  css: [
    // global, main
    "~/assets/styles/main.scss",

    // https://animate.style/
    "animate.css",
  ],

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/tailwindcss",
    // https://pinia.vuejs.org/
    "@pinia/nuxt",
    // https://vueuse.org/
    "@vueuse/nuxt",
  ],

  imports: {
    // @unimport
    // #disable auto-imports; use explicit imports from #imports
    // autoImport: false

    dirs: ["./keys"],
    presets: [
      {
        from: "lodash/get",
        imports: [
          {
            name: "default",
            as: "get",
          },
        ],
      },
      // {
      //   from: "lodash/identity",
      //   imports: [{ name: "default", as: "identity" }],
      // },
      // {
      //   from: "lodash/range",
      //   imports: [{ name: "default", as: "range" }],
      // },
      // {
      //   from: "lodash/pullAll",
      //   imports: [{ name: "default", as: "pullAll" }],
      // },
      // {
      //   from: "lodash/size",
      //   imports: [{ name: "default", as: "len" }],
      // },
      // {
      //   from: "lodash/differenceBy",
      //   imports: [{ name: "default", as: "differenceBy" }],
      // },
      // {
      //   from: "lodash/union",
      //   imports: [{ name: "default", as: "union" }],
      // },
      // {
      //   from: "lodash/sortBy",
      //   imports: [{ name: "default", as: "sortBy" }],
      // },
      // {
      //   from: "lodash/difference",
      //   imports: [{ name: "default", as: "difference" }],
      // },
      // {
      //   from: "lodash/sampleSize",
      //   imports: [{ name: "default", as: "sampleSize" }],
      // },
      // {
      //   from: "lodash/findKey",
      //   imports: [{ name: "default", as: "findKey" }],
      // },
      // {
      //   from: "lodash/unset",
      //   imports: [{ name: "default", as: "unset" }],
      // },
      // {
      //   from: "lodash/forEach",
      //   imports: [{ name: "default", as: "forEach" }],
      // },
      // {
      //   from: "lodash/each",
      //   imports: [{ name: "default", as: "each" }],
      // },
      // {
      //   from: "lodash/cloneDeep",
      //   imports: [{ name: "default", as: "cloneDeep" }],
      // },
      // {
      //   from: "lodash/clone",
      //   imports: [{ name: "default", as: "clone" }],
      // },
      // {
      //   from: "lodash/isString",
      //   imports: [{ name: "default", as: "isString" }],
      // },
      // {
      //   from: "lodash/has",
      //   imports: [{ name: "default", as: "hasPath" }],
      // },
      // {
      //   from: "lodash/pick",
      //   imports: [{ name: "default", as: "pick" }],
      // },
      // {
      //   from: "lodash/omit",
      //   imports: [{ name: "default", as: "omit" }],
      // },
      // {
      //   from: "lodash/keys",
      //   imports: [{ name: "default", as: "keys" }],
      // },
      // {
      //   from: "lodash/isEqual",
      //   imports: [{ name: "default", as: "isEqual" }],
      // },
      // {
      //   from: "lodash/sample",
      //   imports: [{ name: "default", as: "sample" }],
      // },
      // {
      //   from: "lodash/take",
      //   imports: [{ name: "default", as: "take" }],
      // },
      // {
      //   from: "lodash/takeRight",
      //   imports: [{ name: "default", as: "takeRight" }],
      // },
      // {
      //   from: "lodash/startCase",
      //   imports: [{ name: "default", as: "startCase" }],
      // },
      // {
      //   from: "lodash/camelCase",
      //   imports: [{ name: "default", as: "camelCase" }],
      // },
      // {
      //   from: "lodash/kebabCase",
      //   imports: [{ name: "default", as: "kebabCase" }],
      // },
      // {
      //   from: "lodash/snakeCase",
      //   imports: [{ name: "default", as: "snakeCase" }],
      // },
      // {
      //   from: "lodash/assign",
      //   imports: [{ name: "default", as: "assign" }],
      // },
      // {
      //   from: "lodash/trimEnd",
      //   imports: [{ name: "default", as: "trimEnd" }],
      // },
      // // export { isEmail, isMobilePhone, isURL } from "validator";
      {
        from: "validator/lib/isEmail",
        imports: [{ name: "default", as: "isEmail" }],
      },
      // {
      //   from: "validator/lib/isMobilePhone",
      //   imports: [{ name: "default", as: "isMobilePhone" }],
      // },
      // {
      //   from: "validator/lib/isURL",
      //   imports: [{ name: "default", as: "isURL" }],
      // },
      {
        from: "uuid",
        imports: [{ name: "v4", as: "uuid" }],
      },
    ],
  },

  // #https://google-fonts.nuxtjs.org
  googleFonts: {
    families: {
      "Open+Sans": {
        wght: [100, 300, 400, 500, 700, 900],
        ital: [100, 300, 400, 500, 700, 900],
      },
      Roboto: {
        wght: [100, 300, 400, 500, 700, 900],
        ital: [100, 300, 400, 500, 700, 900],
      },
    },
    useStylesheet: true,
    download: false,
  },
  tailwindcss: {
    cssPath: "~/assets/tailwind.css",
    configPath: "~/config/tailwind.config.ts",
    // # Import fully resolved config
    // # import tailwindConfig from '#tailwind-config'
    exposeConfig: true,
    // # Extend the Tailwind config
    // config: {},
    // injectPosition: 0,
    viewer: false,
  },
});
