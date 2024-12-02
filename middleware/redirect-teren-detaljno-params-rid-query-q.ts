export default defineNuxtRouteMiddleware((to) => {
  const { rid } = to.params;
  if (rid) {
    return navigateTo({ name: "teren-detaljno", query: { q: rid } });
  }
});
