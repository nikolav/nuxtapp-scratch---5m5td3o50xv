import { trimEndBase } from "../utils/trim-end-base";

export const PRODUCTION$: boolean = true;
// export const PRODUCTION$: boolean = false;

// generate:static
//   prerender --true
//   spa       --false
export const SSR = true;
// export const SSR = false;

export const BASE_DIR = undefined;
// export const BASE_DIR = "/app/path";
// export const BASE_DIR = "/app/001";

export const MODE_DEBUG = !PRODUCTION$;

// no-policies access
export const TOKEN_DEFAULT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiQCI6IjIwMjQtMTAtMjUgMjI6NDM6NTMuNjU4NDIxKzAwOjAwIn0.Qp1tbqoAyWhmu6d-1LesQGV58OaBgnVVDSLjT8S5ArY";
// #auth
export const USERS_HAS_POLICY_ADMINS = [1];
export const USER_ID_ADMIN = 1;
export const USER_ID_DEFAULT = PRODUCTION$ ? 2 : 2;

// # api
export const API_URL_dev = "http://127.0.0.1:5000";
export const API_URL_production = "https://zyeqzw35h4kv5b70k7uqim.site";
export const API_URL = trimEndBase(
  PRODUCTION$ ? API_URL_production : API_URL_dev,
  "/"
);
export const URL_API_status = API_URL;
export const URL_AUTH_register = `${API_URL}/auth/register`;
export const URL_AUTH_login = `${API_URL}/auth/login`;
export const URL_AUTH_social = `${API_URL}/auth/social`;
export const URL_AUTH_logout = `${API_URL}/auth/logout`;
export const URL_API_who = `${API_URL}/auth/who`;
export const ENDPOINT_GRAPHQL = `${API_URL}/graphql`;
export const URL_STORAGE = `${API_URL}/storage`;
export const URL_PASSWORD_RESET_REQUEST = `${API_URL}/auth/password-reset-email-link`;
export const URL_PASSWORD_RESET_OBNOVA_LOZINKE = `${API_URL}/auth/password-reset-obnova-lozinke`;
export const URL_PASSWORD_RESET_ACTION = URL_PASSWORD_RESET_OBNOVA_LOZINKE;

// # io
export const IO_SERVER = API_URL;

// # goog
export const CLOUD_TRANSLATION_API_KEY =
  "AIzaSyB__hOOMyqxvF1bk3F9L3BOqsD4SCkHilg";
