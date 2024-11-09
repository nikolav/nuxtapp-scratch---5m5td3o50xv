import type { IConfigFields } from "@/types";

const DEFAULT_equals = (val1: any, val2: any) => val1 === val2;

export const useFormModel = (
  // key.random for value caching
  _key: string,
  // fields definition
  fields: Record<string, IConfigFields>,
  config: {
    // maybeRef<user|product|..>
    model?: any;
    onSubmit?: any;
    schema?: any;
    dump?: any;
  }
) => {
  const resetKEY = useUniqueId();
  const main$ = useStoreMain();
  const index = reduce(
    fields,
    (res: any, item: IConfigFields, field: string) => {
      if (!item.skip) {
        const field_ = `${_key}@${field}`;
        res[field] = computed({
          get: () => main$.get(field_),
          set: (val) => main$.put({ [field_]: val }),
        });
      }
      return res;
    },
    <any>{}
  );
  const clear = () => {
    each(fields, (item: IConfigFields, field: string) => {
      if (!item.skip) {
        index[field].value = item.nullValue;
      }
    });
  };
  // get single field from model
  const pullValue_ = (item: IConfigFields, field: string) =>
    (item.pull || get)(toValue(config.model), item.path || field);
  // pull model
  const reset = () => {
    each(fields, (item: IConfigFields, field: string) => {
      if (!item.skip) {
        index[field].value = pullValue_(item, field);
      }
    });
    resetKEY();
  };
  const dump =
    config.dump ||
    (() =>
      reduce(
        fields,
        (data: any, item: IConfigFields, field: string) => {
          if (!item.skip) {
            data[field] = index[field].value;
          }
          return data;
        },
        <any>{}
      ));
  const valid = computed(
    () => !config.schema || config.schema.safeParse(dump()).success
  );
  const submit = async () => {
    if (!config.onSubmit) return;
    if (!valid.value) return;
    return await config.onSubmit(dump());
  };
  const diff = computed(() =>
    reduce(
      fields,
      (res: any, item: IConfigFields, field: string) => {
        if (!item.skip) {
          const value_ = index[field].value;
          if (
            !(item.equals || DEFAULT_equals)(value_, pullValue_(item, field))
          ) {
            res[field] = value_;
          }
        }
        return res;
      },
      <any>{}
    )
  );
  const isDirty = computed(() => !isEmpty(diff.value));

  return {
    fields,
    index,
    submit,
    clear,
    reset,
    dump,
    valid,
    diff,
    isDirty,
    // alias
    data: index,
    // key
    resetId: resetKEY.ID,
  };
};

//  const FIELDS = <Record<string, any>>{
//   name: {
//     label: "Naziv grupe",
//     icon: {
//       name: "tag",
//       size: "1.122rem",
//     },
//     required: true,
//   },
//   location: {
//     label: "Lokacija",
//     icon: {
//       name: "location",
//       size: "1.122rem",
//     },
//   },
//   category: {
//     type: "select",
//     label: "Region",
//     icon: {
//       name: "folder",
//       size: ".88rem",
//     },
//     required: true,
//     pull: (g) => {
//       const c = find(g?.tags, (tag: string) =>
//         tag.startsWith(CATEGORY_KEY_ASSETS_prefix)
//       );
//       return c && matchAfterLastColon(c);
//     },
//   },
//   notes: {
//     type: "textarea",
//     label: "Opis",
//     icon: {
//       name: "$edit",
//       size: "1.122rem",
//     },
//   },
// };
