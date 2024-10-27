export const useAuthUtils = () => {
  const calcDisplayName = (user: any) =>
    startCase(
      get(user, "profile.displayName") ||
        [get(user, "profile.firstName"), get(user, "profile.lastName")]
          .filter(Boolean)
          .join(" ") ||
        matchEmailStart(user?.email)
    );

  return { calcDisplayName };
};
