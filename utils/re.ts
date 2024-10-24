
// re
export const re_email_start_group = /^([^@]+)@.*/;
export const re_jwt =
  /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)$/;
export const reAfterLastColon = /\:([^:]*)$/;
export const reAfterLastDot = /\.([^.]+)$/;

// funcs
export const matchEmailStart = (val: any) =>
  get(String(val).match(re_email_start_group), "[1]") || "";
