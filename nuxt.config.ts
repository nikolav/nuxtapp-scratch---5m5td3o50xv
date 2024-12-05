import vitePluginVuetify, { transformAssetUrls } from "vite-plugin-vuetify";

import {
  API_URL,
  // API_URL_production,
  SSR,
  BASE_DIR,
  ENDPOINT_GRAPHQL,
  // URL_APP_PUBLIC,
  PRODUCTION$,
} from "./config";
import { trimEndBase } from "./utils/trim-end-base";

import { IMPORTS } from "./config/imports-package";

type TMeta = Record<string, string>[];

const meta: TMeta = [
  { name: "description", content: "NuxtApp --nuxt.config" },
  { name: "theme-color", content: "#fafafa" },
];
//
// @@https --force
// <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
//
if (API_URL.startsWith("https"))
  meta.push({
    "http-equiv": "Content-Security-Policy",
    content: "upgrade-insecure-requests",
  });
//

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // # client-side rendering;
  //  prerender    .true
  //  no-prerender .false
  ssr: SSR,

  routeRules: {
    //   // Generated at build time for SEO purpose
    //   // "/": { prerender: true },
    // "/aktiva/proizvodi/**": { swr: true },
    // "/aktiva/proizvodi/1": { prerender: true },
    // "/aktiva/proizvodi/2": { prerender: true },
    // "/aktiva/proizvodi/4": { prerender: true },
    // "/aktiva/proizvodi/6": { prerender: true },
    // "/aktiva/proizvodi/7": { prerender: true },
    // "/aktiva/proizvodi/8": { prerender: true },
    // "/aktiva/proizvodi/9": { prerender: true },
    // "/aktiva/proizvodi/10": { prerender: true },
    // "/aktiva/proizvodi/*": { prerender: true },
    //   // Cached for 1 hour
    //   // "/api/*": { cache: { maxAge: 60 * 60 } },
    //   // Redirection to avoid 404
    //   // "/old-page": {
    //   //   redirect: { to: "/new-page", statusCode: 302 },
    //   // },
    // Set prerender to true to configure it to be prerendered
    // "/rss.xml": { prerender: true },
    // Set it to false to configure it to be skipped for prerendering
    // "/this-DOES-NOT-get-prerendered": { prerender: false },
    // Everything under /blog gets prerendered as long as it
    // is linked to from another page
    // "/blog/**": { prerender: true },
    //   // ...
  },

  // #Selective Pre-rendering @nitro
  // #https://nuxt.com/docs/getting-started/prerendering#selective-pre-rendering
  // nitro: {
  //   prerender: {
  //     // routes: ['/user/1', '/user/2'],
  //     // ignore: ["/dynamic"],
  //   },
  // },

  runtimeConfig: {
    // The private keys which are only available server-side
    // apiSecret: '123',
    // Keys within public are also exposed client-side
    public: {
      // fooBar: process.env.var
    },
  },

  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },

  app: {
    ...(BASE_DIR
      ? {
          baseURL: BASE_DIR,
          buildAssetsDir: `${trimEndBase(BASE_DIR, "/")}/_nuxt/`,
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
    pageTransition: { name: "BLUR", mode: "in-out" },
    // transition layouts
    layoutTransition: { name: "BLUR" },
  },

  css: [
    // global, main
    "~/assets/styles/main.scss",

    // https://animate.style/
    "animate.css",

    // vuetify
    "@mdi/font/css/materialdesignicons.css",
    "vuetify/lib/styles/main.sass",

    // lightbox
    "@fancyapps/ui/dist/fancybox/fancybox.css",

    // toasts
    // "~/assets/styles/toasts.scss",

    // quill
    "quill/dist/quill.core.css",
    "quill/dist/quill.snow.css",
  ],

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxtjs/tailwindcss", // https://pinia.vuejs.org/
    "@pinia/nuxt", // https://vueuse.org/
    "@vueuse/nuxt", // https://apollo.nuxtjs.org/getting-started/quick-start
    "@nuxtjs/apollo",
    "@nuxt/icon",
    async (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(
          vitePluginVuetify({
            autoImport: true,
            styles: {
              configFile: "assets/styles/vuetify/settings.scss",
            },
          })
        );
      });
    },
    "@nuxtjs/color-mode",
    "@nuxt/image",
  ],

  build: {
    transpile: ["vuetify"],
    // rollupOptions: {
    //   external: [
    //     /^@vue\/apollo-composable/,
    //     // /^node:.*/,
    //   ],
    // },
  },

  // access style config in preprocessed files
  //   sass, variables, partials, etc.
  //  https://vuetifyjs.com/en/getting-started/installation/#using-nuxt-3
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/globals.scss" as *;',
        },
      },
    },
    define: {
      "process.env.DEBUG": false,
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  hooks: {
    // "pages:extend"
    // "render:html"
    //   // # append dirs, extending default path
    //   // "components:dirs": (dirs) => {
    //   //   dirs.push({
    //   //     path: "/path",
    //   //     prefix: "App",
    //   //   });
    // async "prerender:routes"(ctx) {
    //   // if ("frikom.nikolav.rs" !== new URL(URL_APP_PUBLIC).hostname) return;
    //   if (!PRODUCTION$) return;
    //   const res = await fetch(API_URL);
    //   const d = await res.json();
    //   for (const pid of d.prerender.pids) {
    //     ctx.routes.add(`/aktiva/proizvodi/${pid}`);
    //   }
    // },
  },

  // include auto import dirs
  //  OVERRIDING default path
  // components: [
  //   // {
  //   //   path: "/path",
  //   //   prefix: "App",
  //   // },
  // ],

  // @unimport
  imports: {
    // #disable auto-imports; use explicit imports from #imports
    // autoImport: false

    // additional named exports
    dirs: ["./keys"],

    //
    presets: IMPORTS,
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

  // https://apollo.nuxtjs.org/getting-started/configuration#configuration
  // https://apollo.nuxtjs.org/getting-started/configuration#clients
  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: ENDPOINT_GRAPHQL,
        httpLinkOptions: {
          // Enable sending cookies over cross-origin requests
          credentials: "include",
        },
        tokenName: "@apollo/token:HoARGKAyE7VRBupLHJ",
      },
    },
  },

  // (recommended) install the icon data locally with
  // npm i -D @iconify-json/<collection-name>
  icon: {
    // #https://nuxt.com/modules/icon#server-bundle
    // serverBundle: "auto", // "auto" | "local" | "remote"
    // serverBundle: {
    //   collections: [
    //     "--logos", "--tabler", "--streamline", "--material-symbols", "--ri",
    //     "--mdi", "--ion", "--mingcute", "--basil",
    //     "--jam", "--fluent", ""
    // ],
    // },
    // provider: SSR ? undefined : "server",
    // #https://github.com/nuxt/icon?tab=readme-ov-file#custom-local-collections
    customCollections: [
      {
        prefix: "icons-local",
        dir: "./assets/icons-local",
      },
    ],
    clientBundle: {
      // list of icons to include in the client bundle
      icons: [
        "material-symbols:folder-supervised-sharp",
        "mdi:lightning-bolt",
        "material-symbols:filter-alt",
        "jam:viber",
        "ph:empty",
        "tabler:world",
        "iconoir:page",
        "material-symbols:checklist",
        "mdi:toggle-switch-outline",
        "uil:paragraph",
        "material-symbols:help",
        "material-symbols:person-remove-outline",
        "basil:headset-solid",
        "bi:images",
        "fluent:select-all-off-24-regular",
        "fluent:select-all-on-24-regular",
        "game-icons:cardboard-box-closed",
        "ic:round-storefront",
        "ic:sharp-upload",
        "icon-park-outline:preview-close-one",
        "icon-park-outline:preview-open",
        "ion:ios-cube",
        "ion:paper-plane",
        "ion:social-facebook",
        "jam:rubber",
        "logos:nuxt-icon",
        "logos:vitejs",
        "mage:box-3d-plus",
        "material-symbols-light:group-add-outline",
        "material-symbols-light:key-rounded",
        "material-symbols:account-circle",
        "material-symbols:barcode",
        "material-symbols:delete",
        "material-symbols:filter-alt-off-outline",
        "material-symbols:filter-list",
        "material-symbols:folder-open-outline",
        "material-symbols:group",
        "material-symbols:groups",
        "material-symbols:label-off-outline-sharp",
        "material-symbols:label-outline-sharp",
        "material-symbols:label-sharp",
        "material-symbols:link-rounded",
        "material-symbols:location-on",
        "material-symbols:lock-open-rounded",
        "material-symbols:lock-reset-sharp",
        "material-symbols:mail-outline",
        "material-symbols:new-label-outline-sharp",
        "material-symbols:notifications-active-outline-sharp",
        "material-symbols:photo-camera-rounded",
        "material-symbols:photo-camera",
        "material-symbols:save",
        "material-symbols:search",
        "material-symbols:sms-outline-rounded",
        "mdi:account-multiple",
        "mdi:account-settings-variant",
        "mdi:checkbox-blank-circle-outline",
        "mdi:checkbox-marked-circle",
        "mdi:dots-vertical",
        "mdi:eye-off",
        "mdi:eye",
        "mdi:folder",
        "mdi:information-variant",
        "mdi:key-chain-variant",
        "mdi:share-variant",
        "mdi:tag",
        "mdi:trash-can",
        "mingcute:task-2-fill",
        "ri:hashtag",
        "ri:linkedin-line",
        "ri:messenger-line",
        "ri:twitter-x-fill",
        "ri:user-line",
        "simple-icons:mailboxdotorg",
        "simple-icons:viber",
        "streamline:chat-two-bubbles-oval",
        "streamline:interface-user-add-actions-add-close-geometric-human-person-plus-single-up-user",
        "streamline:interface-user-edit-actions-close-edit-geometric-human-pencil-person-single-up-user-write",
        "tabler:brand-github-filled",
        "tabler:external-link",
        "tdesign:poweroff",
        "uil:github",
        "mdi:star-circle",
        "fa6-regular:thumbs-up",
        "material-symbols:settings",
      ],
      //

      // scan all components in the project and include icons
      scan: true,

      // include all custom collections in the client bundle
      includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      // sizeLimitKb: 256,
    },
    // componentName: "Icon",
  },

  colorMode: {
    // preference: "system", // default value of $colorMode.preference
    // fallback: "light", // fallback value if not system preference found
    // hid: "nuxt-color-mode-script",
    // globalName: "__NUXT_COLOR_MODE__",
    // componentName: "ColorScheme",
    // classPrefix: "",
    classSuffix: "",
    // storageKey: "nuxt-color-mode",
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  experimental: {
    scanPageMeta: true,
    // typedPages: true,
    // inlineRouteRules: true,
  },

  // https://image.nuxt.com/get-started/configuration
  image: {
    // # override at the component level
    quality: 92,
    // # globally initialize an $img helper
    // inject: true,
    // format: ["webp"],
    // # enable image optimization on an external website
    domains: [
      // "frikom.nikolav.rs",
    ],
    //
    // # The screen sizes predefined by `@nuxt/image`:
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      "2xl": 1536,
    },
    // # pre-defined configurations
    // presets: {
    //   avatar: {
    //     modifiers: {
    //       format: "jpg",
    //       width: 50,
    //       height: 50,
    //     },
    //   },
    // },
  },
});
