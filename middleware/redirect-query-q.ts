export default defineNuxtRouteMiddleware((to) => {
  const { pid } = to.params;
  if (pid) {
    return navigateTo({ name: "aktiva-proizvodi-detaljno", query: { q: pid } });
  }
});
