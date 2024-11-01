import { M_usersTagsManage } from "@/graphql";
import type { IUser } from "@/types";

interface IConfigureTags {
  [ID: number]: { [key: string]: boolean };
}

export const useMutationUsersTags = () => {
  const { usersTags, USERS_TAGS_prefix } = useTopics();
  const re_ = new RegExp(`^${escapeRegExp(USERS_TAGS_prefix)}(.*)$`);
  const { mutate } = useMutation(M_usersTagsManage);
  const getUserTags = (u: IUser) =>
    transform(
      u?.tags || [],
      (res: string[], t: string) => {
        const tag = get(t.match(re_), "[1]");
        if (tag) res.push(tag);
        return res;
      },
      <string[]>[]
    );
  const commit = async (tags: IConfigureTags) =>
    await mutate({
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
  return { commit, getUserTags };
};
