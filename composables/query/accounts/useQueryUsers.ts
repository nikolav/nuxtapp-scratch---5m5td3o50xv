import type { IUser } from "@/types";
import { Q_users, Q_usersOnly } from "@/graphql";
export const useQueryUsers = (
  UIDS?: any,
  $ENABLED: any = true,
  $EXTERNAL: any = false
) => {
  const {
    graphql: { STORAGE_QUERY_POLL_INTERVAL },
    io: { IOEVENT_AUTH_NEWUSER, IOEVENT_ACCOUNTS_UPDATED },
  } = useAppConfig();
  const uidsProvided = computed(() =>
    map(filter(toValue(UIDS) || [], isNumeric), Number)
  );
  const isAll_ = computed(() => !toValue(UIDS));
  const enabled = computed(() => toValue($ENABLED));
  // include users:external
  const skip_external = computed(() => !toValue($EXTERNAL));
  const {
    result,
    load: queryStart,
    refetch,
    loading,
  } = useLazyQuery<{ users?: IUser[]; usersOnly?: IUser[] }>(
    isAll_.value ? Q_users : Q_usersOnly,
    isAll_.value ? { skip_external } : { uids: uidsProvided },
    {
      enabled,
      pollInterval: STORAGE_QUERY_POLL_INTERVAL,
    }
  );
  const users = computed(() =>
    get(result.value, isAll_.value ? "users" : "usersOnly", [])
  );
  const uids = computed(() => map(users.value, "id") || []);
  const size = computed(() => len(users.value));
  const reload = async () => await refetch();
  useOnceMountedOn(true, queryStart);

  useIOEvent(IOEVENT_AUTH_NEWUSER, reload);
  useIOEvent(IOEVENT_ACCOUNTS_UPDATED, reload);

  return { users, uids, size, reload, enabled, loading };
};
