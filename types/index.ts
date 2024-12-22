import { type Ref } from "vue";
// import { Interaction, type ChartData } from "chart.js";
import type {
  JsonDataRecord as RecordJson,
  TJson,
  TJsonLiteral,
} from "@/schemas/json";

export type { TJson, RecordJson, TJsonLiteral };
export type OrNull<T = any> = T | null;
export type OrNoValue<T = any> = OrNull<T> | undefined;
export type TStoreMain<T = any> = Record<string, T>;
export type TStoreFlags = Record<string, boolean>;
export type TDocData<T = any> = Record<string, T>;
export type TOrPromise<T = any> = T | Promise<T>;
export interface IDoc<T = TDocData> {
  id?: number | undefined;
  data: T;
  key?: string | undefined;
  created_at?: string | undefined;
  updated_at?: string | undefined;
}

export interface IAuthCreds {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token?: string | undefined;
}

export interface IAuthWhoResponse {
  id?: number | undefined;
  email?: string | undefined;
  error?: string | undefined;
}

export interface IAuthLogoutResponse {}

export interface IStorageFileInfo {
  id: number;
  file_id: string;
  title: string;
  description: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

export interface IFilesUpload {
  [name: string]: {
    file: any;
    data?: {
      title?: string | undefined;
      description?: string | undefined;
    };
    meta?: Record<string, any>;
  };
}

export interface IStorageFileDataSaved {
  file_id: string;
  user_id: number;
  title: string;
  description: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  public: boolean;
}

export interface IStorageStatusFileSaved {
  id: number;
  data: IStorageFileDataSaved;
  created_at: string;
  updated_at: string;
}

export interface IConfigDocs {
  autoReload: boolean;
}

export interface IThemeToggle {
  theme: Ref<string>;
  themeToggle: (mode?: string | undefined) => void;
}

export interface IAppData<T = any> {
  [key: string]: T;
}

export interface IUser {
  id: number;
  email: string;
  profile?: RecordJson;
  is_approved?: boolean;
  is_manager?: boolean;
  is_admin?: boolean;
  is_external?: boolean;
  is_available?: boolean;
  email_verified?: boolean;
  tags?: string[];
  groups?: string[];
  created_at: string;
  updated_at: string;
}

export type TGravatars = Record<
  number,
  { src?: OrNoValue<string>; enabled?: OrNoValue<boolean> }
>;

export interface IDataRating {
  [topic: string]: {
    [key: string]: number;
  };
}

export interface IInputSendMail {
  subject: string;
  template: string;
  data?: Record<string, any>;
}

export interface IInputFileUpload {
  [title: string]: {
    // storage filename
    name?: string;
    file: File;
    [key: string]: any;
  };
}

export interface ITranslationQuery {
  q: string;
  target: string;
  source?: string;
  // format?: string;
  format?: "html" | "text";
  model?: string;
  key?: string;
}

export interface IAsset {
  id: number;
  name: string;
  code?: string | undefined;
  type?: string | undefined;
  location?: string | undefined;
  status?: string | undefined;
  condition?: string | undefined;
  data?: Record<string, any> | undefined;
  notes?: string | undefined;
  key?: string | undefined;
  author_id?: number | undefined;

  tags?: string[] | undefined;
  author?: IUser | undefined;
  users?: IUser[] | undefined;
  docs?: RecordJson[] | undefined;
  assets_has?: IAsset[] | undefined;

  created_at?: string | undefined;
  updated_at?: string | undefined;
}

export interface ILightboxSlide {
  src: any;
  caption?: string | undefined;
  thumb?: string | undefined;
  type?: any;
  // type?: "image" | "iframe" | "video" | "pdf" | "inline" | "html"| "ajax" | "youtube" | "vimeo" | undefined;
}

export interface ITopicChatMessage {
  uid?: any;
  name?: any;
  message: string;
}

export interface IFileSizeUnit {
  size: string;
  unit: string;
}
export interface IObjectUrlWithError {
  error: any;
  url: OrNoValue<Blob>;
}

export interface IConfigFields {
  // --options-ui
  type?: string;
  required?: boolean;
  label?: string;
  icon?: {
    name?: string;
    size?: any;
    props?: any;
    [key: string]: any;
  };
  props?: any;

  // --options-model

  // ignore field
  skip?: boolean;

  // flag true|false if new and cached values are equal
  equals?: any;

  // default clear value [undefined]
  nullValue?: any;

  // resolve field from model
  //   model:value by path
  path?: string;
  //   model:value fn
  pull?: any;

  [key: string]: any;
}

export interface IDocs {
  id: number;
  key: string;
  data: RecordJson;
  tags?: OrNoValue<string[]>;
  asset?: OrNoValue<IAsset>;
  user?: OrNoValue<IUser>;
  created_at: string;
  updated_at: string;
}

export interface IOrders {
  id: number;
  key?: OrNoValue<string>;
  status?: OrNoValue<string>;
  data?: OrNoValue<RecordJson>;
  notes?: OrNoValue<string>;

  author_id?: OrNoValue<number>;
  site_id?: OrNoValue<number>;
  
  author?: OrNoValue<IUser>;
  site?: OrNoValue<IAsset>;
  tags?: OrNoValue<string[]>;
  products?: OrNoValue<IAsset[]>;

  created_at?: OrNoValue<string>;
  updated_at?: OrNoValue<string>;
}

