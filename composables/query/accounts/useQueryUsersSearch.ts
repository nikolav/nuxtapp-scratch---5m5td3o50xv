import {
  Q_users,
  Q_usersSharedGroups,
  Q_usersTagged,
  Q_usersQ,
  Q_usersByGroups,
} from "@/graphql";
interface IQueryWithVariables {
  Q: any;
  variables?: any;
}
// _default
// groups-shared; search by groups in common
// tags;          search by custom user tags: .tags: string[]
// q;             search by text query; .q: string
// g;             search by groups; .gids: number[]
const QUERY = <Record<string, IQueryWithVariables>>{
  _default: { Q: Q_users, variables: { skip_external: true } },
  "groups-shared": { Q: Q_usersSharedGroups },
  tagged: { Q: Q_usersTagged },
  q: { Q: Q_usersQ },
  g: { Q: Q_usersByGroups },
};
export const useQueryUsersSearch = (
  NAME?: any,
  VARIABLES?: any,
  OPTIONS?: any
) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
  } = useAppConfig();
  const Q = ref();
  const variables = ref();
  watchEffect(() => {
    const q_ = toValue(NAME);
    const query_ = QUERY[null != q_ ? q_ : "_default"];
    Q.value = query_.Q;
    variables.value = assign({}, query_.variables, toValue(VARIABLES));
  });

  const { load, result, loading, refetch } = useLazyQuery(Q, variables, {
    pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    ...OPTIONS,
  });
  const users = computed(() => {
    const o = Object(result.value);
    for (let field in o) {
      if (hasOwn(o, field)) {
        return o[field];
      }
    }
    return [];
  });
  const reload = async () => await refetch();
  useOnceMountedOn(true, async () => await load());

  return { users, reload, loading };
};
