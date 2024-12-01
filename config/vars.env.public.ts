import { trimEndBase } from "../utils/trim-end-base";
import { PRODUCTION$ } from "./vars.env";

export const APP_NAME = "TEREN.FRIKOM";

export const URL_APP_PUBLIC_production = "https://frikom.nikolav.rs/";
export const URL_APP_PUBLIC_dev = "http://localhost:3000/";
export const URL_APP_PUBLIC = PRODUCTION$
  ? // "https://qdeiymppite.web.app/"
    // "https://morning-ocean-24984-2ae2dd559da2.herokuapp.com/"
    URL_APP_PUBLIC_production
  : // "http://140.82.39.170/"
    // "https://nikolav.rs/"
    // ? "https://qdeiymppite.web.app/"
    URL_APP_PUBLIC_dev;

export const URL_PRODUCT_PREVIEW_HOST = URL_APP_PUBLIC;

const LOGGING_: boolean = true;

// export const THEME_ACCENT_SHIFT = 33;
export const THEME_ACCENT_SHIFT = 44;
export const DEBUG$ = !PRODUCTION$ && LOGGING_;

export const URL_PASSWORD_RESET_FORM_LINK = `${trimEndBase(
  URL_APP_PUBLIC,
  "/"
)}/auth-password-reset-form`;

export const URL_VERIFY_EMAIL = `${trimEndBase(
  URL_APP_PUBLIC,
  "/"
)}/auth-verify-email`;

export { SSR } from "./vars.env";

export const CATEGORY_KEY_ASSETS_prefix = "CATEGORY_KEY:ASSETS:hhPDiM:";
export const DEFAULT_NO_IMAGE_AVAILABLE = "/no-image.jpg";

export const ASSETS_PATH_proizvodi = "aktiva/proizvodi";
// export const ASSETS_PATH_proizvodi = "aktiva/proizvodi/detaljno";

export const TOPIC_CHAT_CALENDAR_MAIN =
  "TOPIC_CHAT_CALENDAR_MAIN:1132d3ce-5ed9-5f3f-9604-eb11041e1658";
