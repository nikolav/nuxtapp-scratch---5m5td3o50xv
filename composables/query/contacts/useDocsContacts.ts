import type { TDocsContacts } from "@/types";

export const useDocsContacts = (SEARCH?: any) => {
  const {
    db: {
      Docs: {
        DocsTags: { TAGGED_CONTACTS },
      },
    },
  } = useAppConfig();

  const d = useDocs<TDocsContacts>(TAGGED_CONTACTS, undefined, 1, SEARCH);

  return {
    ...d,
    contacts: d.data,
  };
};
