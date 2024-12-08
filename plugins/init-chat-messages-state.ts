export default defineNuxtPlugin((_nuxtapp) => {
  const {
    key: { CACHE_KEY_CHATS_LATEST_MESSAGES },
  } = useAppConfig();
  // @init plain{}
  useState<any>(CACHE_KEY_CHATS_LATEST_MESSAGES, () => (<any>{}));
});
