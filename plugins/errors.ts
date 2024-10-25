export default defineNuxtPlugin((nuxtapp) => {
  nuxtapp.hook("vue:error", (error, instance, info) => {
    // handle error, e.g. report to a service
    console.error({ "vue:error": { error, instance, info } });
  });
});
