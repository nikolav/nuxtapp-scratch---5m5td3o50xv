export default defineNuxtRouteMiddleware((mwTo) => {
  console.log({ "@access-log.global --route-to": mwTo });
});
