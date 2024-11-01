import { M_usersTagsManage, Q_tagsSearchTagLike } from "@/graphql";
import type { IUser, OrNoValue } from "@/types";

interface IConfigureTags {
  [ID: number]: { [key: string]: boolean };
}

const DEBOUNCE_TIMEOUT_TAGS_SEARCH = 345;

// tagsSearchTagLike(search: String!, prefix: String, attach: String): [String!]!
export const useMutationUsersTags = () => {
  const {
    io: { IOEVENT_ACCOUNTS_UPDATED },
  } = useAppConfig();
  const { usersTags, USERS_TAGS_prefix } = useTopics();
  const re_ = new RegExp(`^${escapeRegExp(USERS_TAGS_prefix)}(.*)$`);

  const search = ref<OrNoValue<string>>("");
  const searchTerm = ref();

  const {
    load: qStart,
    result,
    loading,
    refetch,
  } = useLazyQuery<{ tagsSearchTagLike: string[] }>(Q_tagsSearchTagLike, {
    search,
    prefix: USERS_TAGS_prefix,
    attach: "start",
  });
  const reload = async () => await refetch();
  const tags = computed(() => result.value?.tagsSearchTagLike || []);
  useOnceMountedOn(true, async () => await qStart());

  const { mutate: mutateTagsAssign } = useMutation(M_usersTagsManage);

  const dSearchSet = debounce((s: OrNoValue<string>) => {
    search.value = s || "";
  }, DEBOUNCE_TIMEOUT_TAGS_SEARCH);
  watch(searchTerm, dSearchSet);

  //
  const tagShorten = (t: string) => get(t.match(re_), "[1]");
  const getUserTagsFull = (u: IUser) =>
    filter(u.tags || [], (t: string) => t.startsWith(USERS_TAGS_prefix));
  const getUserTags = (u: IUser) =>
    map(getUserTagsFull(u), (t: string) => tagShorten(t));
  const commit = async (tags: IConfigureTags) =>
    await mutateTagsAssign({
      tags: transform(
        tags,
        (res: any, item: any, uid: any) => {
          res[uid] = transform(
            item,
            (res: any, val: any, field: any) => {
              res[usersTags(field)] = val;
              return res;
            },
            <any>{}
          );
        },
        <any>{}
      ),
    });

  useIOEvent(IOEVENT_ACCOUNTS_UPDATED, reload);

  return {
    search: searchTerm,
    tags,
    commit,
    getUserTagsFull,
    getUserTags,
    tagShorten,
    reload,
    loading,
  };
};
