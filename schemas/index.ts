import { z } from "zod";
import validator from "validator";
import { schemaJsonDataRecord, schemaJsonData } from "./json";

export { schemaJsonData, schemaJsonDataRecord } from "./json";
export const authLoginCreds = z.object({
  creds: z.string().refine((s) => {
    try {
      const [email, password] = s.split(":");
      return isEmail(email) && 0 < len(password);
    } catch (error) {
      //
    }
    return false;
  }),
});
export const schemaPassword = z.coerce.string().min(2);
export const schemaAuthCredentials = z.object({
  email: z.string().email(),
  password: schemaPassword,
});
export const schemaPasswordsMatch = z
  .object({
    password1: schemaPassword,
    password2: schemaPassword,
  })
  .refine((d) => d.password1 === d.password2);
export const schemaAuthCredentialsWithPolicies = schemaAuthCredentials.extend({
  policies: z.optional(z.array(z.string())),
});
export const schemaAuthData = z.object({
  // @fields
  id: z.coerce.number(),
  email: z.string().email(),
  profile: z.optional(z.union([z.null(), z.record(schemaJsonData)])),
  key: z.optional(z.string()),
  // @computed
  admin: z.boolean(),
  approved: z.boolean(),
  default: z.boolean(),
  email_verified: z.boolean(),
  external: z.boolean(),
  manager: z.boolean(),
  // groups: z.optional(z.array(z.string())),
  // groups: {id: ID!, name:string}[]
  groups: z
    .array(
      z.object({
        id: z.coerce.number(),
        name: z.string(),
      })
    )
    .nullish(),
  // @ts
  created_at: z.string(),
  updated_at: z.string(),
});
export const schemaAuthAccount = z.object({
  id: z.coerce.number(),
  email: z.string().email(),
  profile: z.optional(z.union([z.null(), schemaJsonDataRecord])),
  key: z.optional(z.string()),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
export const schemaJwt = z.string().refine(validator.isJWT);
export const schemaStorageMeta = z.object({
  title: z.optional(z.coerce.string()),
  description: z.optional(z.coerce.string()),
  public: z.optional(z.coerce.boolean()),
});
export const schemaHasFieldName = z.object({
  name: z.string(),
});
export const schemaAssetsInput = z.object({
  name: z.string(),
  code: z.optional(z.string()),
  barcode: z.optional(z.string()),
  link: z.optional(z.string()),
});
export const schemaFileInfo = z
  .object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    lastModified: z.number(),
  })
  .transform((d) => ({
    ...omit(d, "lastModified"),
    updated_at: d.lastModified,
  }));

export const schemaPaginationInput = z.object({
  page: z.coerce.number().gt(0),
  per_page: z.coerce.number().gt(0),
});
