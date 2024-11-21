export default defineNuxtRouteMiddleware(() => {
  console.info("--mw-authorized :admin");
  const auth = useStoreApiAuth();
  const {
    app: { REDIRECT_UNAUTHORIZED_ROUTE_NAME },
  } = useAppConfig();
  if (!auth.isAdmin$)
    return navigateTo({ name: REDIRECT_UNAUTHORIZED_ROUTE_NAME });
});
