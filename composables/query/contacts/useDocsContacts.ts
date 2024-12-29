import type { TDocsContacts } from "@/types";

export const useDocsContacts = (enabled?: any, SEARCH?: any) => {
  const {
    db: {
      Docs: {
        DocsTags: { TAGGED_CONTACTS },
      },
    },
  } = useAppConfig();

  const d = useDocs<TDocsContacts>(TAGGED_CONTACTS, enabled, 1, SEARCH);

  return {
    ...d,
    contacts: d.data,
  };
};
