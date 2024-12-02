const DEFAULT_displayName = "Korisnik";
export const useQueryUserData = (UID?: any) => {
  const uidProvided = computed(() => toValue(UID));
  const enabled = computed(() => !!uidProvided.value);
  const { users, reload, loading } = useQueryUsers(
    () => [uidProvided.value],
    enabled
  );
  const user = computed(() => first(users.value));
  const uid = computed(() => user.value?.id);
  const profile = computed(() => user.value?.profile || {});
  const key = computed(() => user.value?.key);

  // ##utils:computed
  const { topicWithTitle } = useGlobalVariableChatActive();
  const { calcDisplayName } = useAuthUtils();
  const { $dd } = useNuxtApp();
  const firstName = computed(() =>
    String(profile.value?.firstName || "").trim()
  );
  const lastName = computed(() => String(profile.value?.lastName || "").trim());
  const phone = computed(() => String(profile.value?.phone || "").trim());
  const address = computed(() => String(profile.value?.address || "").trim());
  const email = computed(() => user.value?.email);
  const groups = computed(() => user.value?.groups || []);
  const { chatUserChannel } = useTopics();
  const {
    app: { DEFAULT_NO_IMAGE_AVAILABLE },
  } = useAppConfig();
  const displayName = computed(() => calcDisplayName(user.value));
  const displayLocation = computed(() => profile.value?.displayLocation);
  const chatChannel = computed(() =>
    topicWithTitle(chatUserChannel(uid.value), displayName.value)
  );
  const avatarImage = computed(
    () => profile.value?.avatarImage || DEFAULT_NO_IMAGE_AVAILABLE
  );
  const job = computed(() => profile.value?.job);
  const joinedAt = computed(() =>
    user.value?.created_at ? $dd.utc(user.value.created_at) : undefined
  );
  const employedAt = computed(() =>
    profile.value?.employed_at ? $dd.utc(profile.value.employed_at) : undefined
  );

  return {
    reload,
    loading,
    //
    uid,
    user,
    profile,
    key,
    //
    firstName,
    lastName,
    phone,
    email,
    address,
    displayName,
    displayLocation,
    chatChannel,
    avatarImage,
    groups,
    job,
    employedAt,
    joinedAt,
    //
    DEFAULT_displayName,
  };
};
