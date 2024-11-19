// 6Jqd32SG05
// import { type PluginOptions as ToastsPluginOptions } from "vue-toastification";

import type { TStoreMain, TStoreFlags, IConfigDocs, IAppData } from "@/types";

import {
  APP_NAME,
  PRODUCTION$,
  URL_APP_PUBLIC,
  MODE_DEBUG,
  // CLOUD_TRANSLATION_API_KEY,
  URL_VERIFY_EMAIL,
  URL_PASSWORD_RESET_REQUEST,
  URL_PASSWORD_RESET_FORM_LINK,
  URL_PASSWORD_RESET_ACTION,
  CATEGORY_KEY_ASSETS_prefix,
  DEFAULT_NO_IMAGE_AVAILABLE,
} from "@/config";

const themeDark = "dark";
const themeLight = "light";

export default defineAppConfig({
  APP_NAME,
  ADMIN_EMAIL: "admin@nikolav.rs",
  ADMIN_UID: 1,
  DEBUG: true !== PRODUCTION$,
  APP_USER_DEFAULT: {
    email: "korisnik@nikolav.rs",
    password: "korisnik@nikolav.rs",
  },
  vars: {
    FLAG_SHOW_AUTH_BACKGROUND: "0hrfFp7OeZWPQ7wE",
  },
  app: {
    DEFAULT_NO_IMAGE_AVAILABLE,
    COOKIE_ANONYMOS_USER: "ANONYMOS_USER:XFwrJOC6a",
    DEFAULT_TRANSITION: "slide-y-reverse-transition",
    TRANSLATION_ENABLED: true,
    TRANSLATION_DEFAULTS: {
      format: "text",
      // key: CLOUD_TRANSLATION_API_KEY
    },
    LOGOUT_RELOAD_PATH: "/",
    TOOLTIPS_OPEN_DELAY: 345,
    SEARCH_DEBOUNCE_DELAY: 567,
    SEARCH_DEBOUNCE_DELAY_longer: 1234,
    MODE_DEBUG,
    // MODE_DEBUG: true,
    REDIRECT_UNAUTHORIZED_ROUTE_NAME: "index",
  },
  docs: {
    USER_AVAILABILITY_STATUS: "USER_AVAILABILITY_STATUS:TOy5MSh9d7xmo94vvMED",
    CHAT_ORDER_COM_USER_prefix: "e5iT1p1Mmx5HD@",
    COM_PHOTOS_prefix: "@com:photos:",
    LIKEDISLIKE_CACHE_ID: "LIKEDISLIKE_CACHE_ID:Qh8kHQ",
    LIKES_preix: "@likes:",
    PRODUCT_IMAGES: "@images:product:",
    TAG_USERS: "@users",
    USER_PHOTOS_prefix: "@user:photos:",
  },
  ui: {
    components: {
      VCardDataIterator: {},
    },
  },
  //
  key: {
    PRODUCTS_CHANGE: "O36Bjz6COY6i",
    FLAG_CART_OPEN: "OBNwu3k37w3a6H",
    APP_MOUNTED: "Zkcmk4BnXHU",
    APP_PROCESSING: "FlaelfhZddK",
    CHAT_MAIN: "5OLr9wMVacqa",
    CHAT_NAME: "QOPnfTw9",
    COM_LIKES_prefix: "Y9tqzJgln0B::",
    COM_RATING_prefix: "rating:com:SiOobaXI2QXJgHs::",
    DISLIKES_STORE: "HwJ0dv9",
    INJECT_AUTHAPI: "WYvEK29UZIP",
    INJECT_THEME: "Aasnvy2eaxE",
    LIKES_STORE: "hqYqZ31rN4xwfb2qc",
    MAILING_LIST: "cSd5Bq0rtwfHFZtQdu",
    POST_IMAGES_prefix: "CkJmp2R984QY@",
    POSTS_CHAT_prefix: "chat:posts:xztHIGAXy3sicbWP6p:",
    POSTS_LIKES_prefix: "likes:posts:2DvdBZfT7zJvwWIAu:",
    PRODUCT_RATING_prefix: "rating:products:FHj8C6t30equ4D::",
    PRODUCTS_LIKES_prefix: "MEDs6Eov9fHBM5HZ6I1X::",
    PROVIDE_APP_DATA: "Ud8dHoadmBgSr55P6gJ",
    THEME: "I0AOO9BgtWwscK7P",
    TOPIC_CHAT_USER_CHANNEL_prefix:
      "TOPIC_CHAT_USER_CHANNEL:9y2ED1zOBhmz7cIxi0u:",
    TOPIC_CHAT_PRODUCTS_prefix: "chat:products:vyuoiOe3eZW7::",
    TOPIC_RATING_POSTS_prefix: "rating:posts:31p4idFZ7uzT7TKm:",
    TOPIC_RATINGS: "topic-ratings:y0y8ij",
    USER_CONFIG_PREFERENCES: "config:98BAXCnOynhYgm640So:",
    TOPIC_RATING_ASSETS_prefix: "TOPIC_RATING_ASSETS:wWSbCaLd2QXLGdYI:",
    TOPIC_CHAT_ASSETS_prefix: "TOPIC_CHAT_ASSETS:eIFs9HinYG4:",
    TOPIC_CHAT_ACTIVE: "TOPIC_CHAT_ACTIVE:jiGNqK9Rbx1EE",
    TOPIC_CHAT_ACTIVE_name: "TOPIC_CHAT_ACTIVE_name:vdqkf",
    ASSETS_LIKES_prefix: "ASSETS_LIKES:WLbLz4PCh3ijB:",
    DOCS_LIKES_prefix: "DOCS_LIKES:cmb8IRG3QNiA5r:",
    TOPIC_CHAT_ACTIVE_main:
      "TOPIC_CHAT_ACTIVE_main:oYgQb3SHdQiLpHO1Y0cv --title @kanal:frikom:Svi",
    USERS_TAGS_prefix: "USERS_TAGS:6yXEQ5lK4e38jPN1:",
    ASSETS_TAGS_prefix: "ASSETS_TAGS:RmgEwCWtZdzWqg:",
    ASSETS_ATTACHMENTS_FOLDER_prefix: "ASSETS_ATTACHMENTS_FOLDER:24gX3pQdU7fB:",
    ASSETS_DIGITAL_CHANNEL_prefix:
      "ASSETS_DIGITAL_CHANNEL:FDqTCDRMxf7TZ5yqEEuf:",
  },
  //
  FIELDS_OMIT_STORAGE_META: ["id", "created_at", "updated_at", "__typename"],
  //
  DEFAULT_CONFIG_useApiDocs: <IConfigDocs>{ autoReload: true },
  defaults: {
    appData: <IAppData>{
      "admin:email": "admin@nikolav.rs",
    },
  },
  //
  api: {
    TAG_STORAGE: "@storage:",
  },
  //
  graphql: {
    // ~10min autoreload*
    STORAGE_QUERY_POLL_INTERVAL: 712345,
  },
  //
  stores: {
    cart: {
      initial: {
        // `pid:amount` map to store
        items: <Record<number, number>>{},
        // additional order information
        data: <Record<string, any>>{},
      },
    },
    gravatars: {
      BASE_URL: "https://www.gravatar.com/avatar",
      GRAVATARS_CACHE: "gravatars:DKueKjfBLJlRj7k",
      MODE: {
        monsterid: true,
        wavatar: true,
        robohash: true,
      },
      SIZE: 92,
    },
    main: {
      initial: <TStoreMain>{
        "app:name": "tereni:frikom",
        "app:host": "frikom.nikolav.rs",
      },
    },
    flags: {
      initial: <TStoreFlags>{},
    },
    auth: {
      KEY_ACCESS_TOKEN: ":sEe5xYuTL4q",
      KEY_USEFETCH_AUTHDATA: "oDgSc6Xp4kU",
      authDataFields: ["id", "email"],
      initial: () => "",
      authHeaders: (token: string, additional?: Record<string, any>) => ({
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(additional || {}),
      }),
    },
  },
  //
  io: {
    // flag single account updated
    IOEVENT_ACCOUNTS_UPDATED_prefix: "@accounts:updated:sk9wx016CJOUaKZVX:",
    // flag account added/removed
    IOEVENT_ACCOUNTS_UPDATED: "@accounts:updated:1mivIIYL",
    IOEVENT_AUTH_NEWUSER: "@auth:newuser",
    IOEVENT_COM_PHOTOS_CHANGE_prefix: "change:com-photos:",
    IOEVENT_DOC_CHANGE_prefix: "change://doc@",
    IOEVENT_DOCS_CHANGE_JsonData: "change:docs:JsonData:",
    IOEVENT_DOCS_CHANGE: "change:docs",
    IOEVENT_DOCS_TAGS_CHANGE_prefix: "change:docs:tags:",
    IOEVENT_FILES: "@files:updated",
    IOEVENT_ORDER_PRODUCTS_DELIVERY_AT: "5jzXPwQZmSnh2i5NTg:",
    IOEVENT_ORDER_PRODUCTS_STATUS: "GXV5QkH2yjmZ:",
    IOEVENT_ORDER_UPDATED: "@change:orders:xFeTiEWutrmUxHNp:",
    IOEVENT_ORDERS_CHANGE: "@orders:change:",
    IOEVENT_PACKAGES_PROMOTED_prefix: "@packages:promoted:",
    IOEVENT_POST_CHANGE_SINGLE_prefix: "@change:post:4alBPKP:",
    IOEVENT_POSTS_CHANGE: "@change:posts:GCe5RKIXQWDh",
    IOEVENT_PRODUCT_IMAGES_CHANGE_prefix: "change:product-images:",
    IOEVENT_PRODUCTS_CHANGE_prefix: "change:products::",
    IOEVENT_PRODUCTS_CHANGE_SINGLE_prefix: "change:products:DkL11YfpPI:",
    IOEVENT_PRODUCTS_CHANGE: "@change:products:all",
    IOEVENT_STORAGE_CHANGE: "@storage:",
    IOEVENT_STORY_PHOTOS_CHANGE_prefix: "@change:story:images:VDMf82FNKpfl6m:",
    IOEVENT_USER_POSTS_CHANGE_prefix: "@change:posts:rBN5PAj9uZM9wrOq5:",
    IOEVENT_REDIS_CACHE_KEY_UPDATED_prefix:
      "IOEVENT_REDIS_CACHE_KEY_UPDATED:Hvtmg8LbKbeajKb:",
    IOEVENT_PEOPLE_GROUP_TEAM_CONFIGURED_prefix:
      "IOEVENT_PEOPLE_GROUP_TEAM_CONFIGURED:ZNvAgNYKcEG5TNI:",
    IOEVENT_ASSETS_CONFIGRED_prefix: "IOEVENT_ASSETS_CONFIGRED:B11XCb8hAP5:",
  },
  theme: {
    DEFAULT: themeLight,
    DARK: themeDark,
    LIGHT: themeLight,
  },
  layout: {
    // toolbar.height@VDataTable.VCard...
    toolbarMainHeight: 41,
    appBarHeight: 52,
    offsetTop: "1.22rem",
  },
  effect: {
    _default: "headShake",
    duration: 890,
  },
  urls: {
    URL_PASSWORD_RESET_ACTION,
    URL_PASSWORD_RESET_FORM_LINK,
    URL_PASSWORD_RESET_REQUEST,
    URL_VERIFY_EMAIL,
    appPublic: URL_APP_PUBLIC,
    github: "https://github.com/nikolav/nuxtflask",
    QUERY: "q",
    TRANSLATION_ENDPOINT:
      "https://translation.googleapis.com/language/translate/v2",
    comPages: "business",
    storyPages: "story",
  },
  storage: {
    MENU_CATEGORY: "7n0FS9ZxoVN",
  },
  links: {
    external: {
      GOOGLE_CALENDAR_EDIT_PAGE:
        "https://calendar.google.com/calendar/u/0?cid=dnVrb3ZpY25pa29sYTIwMTRAZ21haWwuY29t",
      SRC_GOOGLE_CALENDAR_IFRAME:
        "https://calendar.google.com/calendar/embed?height=480&wkst=2&ctz=Europe%2FBelgrade&bgcolor=%23ffffff&showTitle=0&showTabs=0&showCalendars=0&hl=sr&src=ZW4ucnMjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=ZW4uaXNsYW1pYyNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23D50000&color=%237CB342",
    },
  },
  re: {
    ROUTE_NAMES_SKIP_REDIRECT_APP_ON_AUTHENTICATED: [
      /^auth\-verify\-email$/,
      /^auth\-password\-reset\-form$/,
      /^docs\-/,
      /^aktiva-proizvodi-pid/,
    ],
  },
  SEO: {
    title: "app.rs",
    ogTitle: "app.rs",
    description: "app.rs",
    ogDescription: "app.rs",
    ogImage: "https://nikolav.rs/app-rs-logo.png",
  },
  pdf: {
    DEFAULT_DOWNLOAD_FILENAME: "DEFAULT.pdf",
  },
  date: {
    ISO_FORMAT: "YYYY-MM-DD HH:mm:ss.SSSSSS",
  },
  firebase: {
    storage: {
      PATH_PROFILE_AVATARS: "/media/AVATARS:yenDhzULhtZohA9yo",
      PATH_ASSETS_IMAGES: "/media/ASSETS:ZJYH3/images",
      PATH_ASSETS_ATTACHMENTS_FOLDER: "/media/ASSETS:ATTACH:l8Nn87YIoq9JU2hdUM",
      PATH_ASSETS_AVATARS: "/media/ASSETS:AVATARS:OYDQyknrfYvlUCzFGON",
      PATH_ACCOUNT_ATTACHMENTS: "/media/ACCOUNT:ATTACHMENTS:oQh8cnzHyoJl13g1",
    },
    firestore: {
      COLLECTIONS_PATH: "/app/collections",
      DEFAULT_DOCS_COLLECTION: "docs:8lyrg8edl53",
    },
    messaging: {
      // Web Push certificates
      // Firebase Cloud Messaging can use Application Identity key pairs to connect with external push services.
      // #https://developers.google.com/web/updates/2016/07/web-push-interop-wins#introducing_vapid_for_server_identification
      VAPID_KEY:
        "BA5afVljVVDNRB2hf-lwSFwzAZcgVW1mYFsT65Oszp9qZIWOfZ9HTX_OXZfErx7iMXXZXv37CW8kS2H4xBJ-naE",
      // FCM_TOKEN: "EdVEeoDfdOK1",
      KEY_FCM_DEVICE_TOKENS: "bd4AsY9rIBwAxF:",
      FCM_ONMESSAGE: "FCM_ONMESSAGE:BQAmVfmWSvb",
    },
  },
  // #https://github.com/nuxt/icon/tree/main?tab=readme-ov-file#icon-customization
  icon: {
    // size: "24px", // default <Icon> size applied
    // class: 'icon', // default <Icon> class applied
    // mode: 'css', // default <Icon> mode applied
    // customize: (
    //   content: string,
    //   name: string,
    //   prefix: string,
    //   provider: string
    // ) => {
    //   // ...
    // },

    aliases: {
      "account-user": "ri:user-line",
      "account-user-edit":
        "streamline:interface-user-edit-actions-close-edit-geometric-human-pencil-person-single-up-user-write",
      "people-group": "material-symbols:group",
      "people-groups": "material-symbols:groups",
      "social-chat": "streamline:chat-two-bubbles-oval",
      nuxt: "logos:nuxt-icon",
      github: "tabler:brand-github-filled",
      chat: "streamline:chat-two-bubbles-oval",
      location: "material-symbols:location-on",
      user: "ri:user-line",
      notification: "material-symbols:notifications-active-outline-sharp",
      label: "material-symbols:label-outline-sharp",
      "label-outline": "material-symbols:label-outline-sharp",
      "label-fill": "material-symbols:label-sharp",
      "label-add": "material-symbols:new-label-outline-sharp",
      "label-rm": "material-symbols:label-off-outline-sharp",
      trash: "material-symbols:delete",
      "check-off": "mdi:checkbox-blank-circle-outline",
      "check-on": "mdi:checkbox-marked-circle",
      search: "material-symbols:search",
      "user-add":
        "streamline:interface-user-add-actions-add-close-geometric-human-person-plus-single-up-user",
      eye: "mdi:eye",
      "eye-off": "mdi:eye-off",
      "dots-v": "mdi:dots-vertical",
      "folder-open-outline": "material-symbols:folder-open-outline",
      upload: "ic:sharp-upload",
      tag: "mdi:tag",
      folder: "mdi:folder",
      save: "material-symbols:save",
      rubber: "jam:rubber",
      "account-cog": "mdi:account-settings-variant",
      storefront: "ic:round-storefront",
      hashtag: "ri:hashtag",
      link: "material-symbols:link-rounded",
      headset: "basil:headset-solid",
      envelope: "material-symbols:mail-outline",
      box: "game-icons:cardboard-box-closed",
    },
  },
  acconts: {
    POLICY_ADMINS: "@policy:admins:ext0ZRQE9gmZ8Bvwb8GMq5DNmh8wEF",
    availabilityStatus: <{ [type: string]: string }>{
      available: "AVAILABLE:vmWsUhVctBpu1BAp",
      away: "AWAY:p2oLyHH",
      busy: "BUSY:woxs5B8Slw",
      do_not_disturb: "DO_NOT_DISTURB:eb6Y5nXzlK",
      invisible: "INVISIBLE:EDjVu",
    },
    availabilityUI: <Record<string, any>>{
      available: {
        icon: {
          icon: "$delimiter",
          name: "$delimiter",
          size: "1.22rem",
          color: "green-darken-3",
        },
        title: "Prisutan",
      },
      busy: {
        icon: {
          icon: "$delimiter",
          name: "$delimiter",
          size: "1.22rem",
          color: "red-darken-3",
        },
        title: "Zauzet",
      },
      away: {
        icon: {
          icon: "$delimiter",
          name: "$delimiter",
          size: "1.22rem",
          color: "yellow-darken-4",
        },
        title: "Odsutan",
      },
      do_not_disturb: {
        icon: {
          icon: "$iconBellOffOutline",
          name: "$iconBellOffOutline",
          size: "1.22rem",
          color: "red",
        },
        title: "Ne uznemiravaj",
      },
      invisible: {
        icon: {
          icon: "$delimiter",
          name: "$delimiter",
          size: "1.22rem",
          color: "grey",
        },
        title: "Nepoznato",
      },
    },
  },
  config: {
    // optionsVueToastificationPlugin: <ToastsPluginOptions>{
    //   // options
    //   hideProgressBar: true,
    //   position: "top-center",
    //   timeout: 6954,
    //   // Access global components and plugins inside toasts
    //   shareAppContext: true,
    // },
  },
  db: {
    Assets: {
      categories: {
        CATEGORY_KEY_ASSETS_prefix,
      },
      type: {
        DIGITAL_CHANNEL: "DIGITAL_CHANNEL:YqmefT",
        DIGITAL_CHAT: "DIGITAL_CHAT:4nASbEj8pFvqm",
        DIGITAL_FORM: "DIGITAL_FORM:TzZJs5PZqcWc",
        PEOPLE_GROUP_TEAM: "PEOPLE_GROUP_TEAM:sEdkj9r",
        PHYSICAL_PRODUCT: "PHYSICAL_PRODUCT:u1zDoNxQnYLnHHbp",
        PHYSICAL_STORE: "PHYSICAL_STORE:5btoy9I8IKgT0RJO",
      },
    },
  },
  redis: {
    defaultCacheKey: "_main:2a7b484c-fc40-5d2f-b294-2e33b3b01afd",
    CACHE_KEY_ASSETS_ATTACHMENTS_prefix:
      "CACHE_KEY_ASSETS_ATTACHMENTS:qdSl6XmU1m:",
  },
});
