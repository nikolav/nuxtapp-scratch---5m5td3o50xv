import { z } from "zod";

import { ENDPOINT_GRAPHQL, VIBER_SET_WEBHOOK_URL } from "@/config";
import {
  M_viberChannelSetupSetWebhook,
  M_viberChannelSetupChannelsDrop,
} from "@/graphql";

const queryViberSendTextMessage = `
  mutation m_viberSendTextMessage($payload: JsonData!) {
    viberSendTextMessage(payload: $payload)
  }
`;

const schemaViberChannelInput = z.object({
  url: z.string().url(),
  auth_token: z.string(),
  is_global: z.optional(z.boolean()),
});
const schemaViberChannelAccount = z.object({
  name: z.string(),
  info: z.object({
    from: z.string(),
    auth_token: z.string(),
    is_global: z.optional(z.boolean()),
  }),
});

export const useViberChannels = () => {
  const auth = useStoreApiAuth();
  const enabled = computed(() => auth.isAuthenticated$);
  const ps = useProcessMonitor();

  const {
    viber: { VIBER_CHANNELS_CACHEID, VIBER_CHANNELS_CACHEID_GLOBAL_CHANNELS },
  } = useAppConfig();
  const channelsCache = useCacheRedis(VIBER_CHANNELS_CACHEID, false);
  const channelsCacheGlobal = useCacheRedis(
    VIBER_CHANNELS_CACHEID_GLOBAL_CHANNELS,
    false
  );
  const { commit: channelsCacheCommit, processing: processingCache } =
    channelsCache;
  const { mutate: mutateViberSetWebhook, loading: setWebhookLoading } =
    useMutation(M_viberChannelSetupSetWebhook);
  const {
    mutate: mutateViberChannelSetupChannelsDrop,
    loading: viberChannelSetupChannelsDropLoading,
  } = useMutation(M_viberChannelSetupChannelsDrop);
  const channels_drop = async (...channelNames: string[]) =>
    await mutateViberChannelSetupChannelsDrop({ channelNames });
  const set_webhook = async (
    channelName: string,
    auth_token: string,
    is_global: any = false,
    onSuccess: any = noop
  ) => {
    try {
      ps.begin();
      const setup_ = await mutateViberSetWebhook(
        schemaViberChannelInput.parse({
          // https://zyeqzw35h4kv5b70k7uqim.site/webhook_viber_channel/<channelName>
          url: `${trimEnd(VIBER_SET_WEBHOOK_URL, "/")}/${channelName}`,
          auth_token,
          is_global,
        })
      );
      if (get(setup_, "data.viberChannelSetupSetWebhook.error"))
        throw "viber:set_webhook:error";
      const ch = schemaViberChannelAccount.parse(
        get(setup_, "data.viberChannelSetupSetWebhook.status.channel")
      );
      if (
        "ok" !==
        get(
          await channelsCacheCommit({ [ch.name]: ch.info }),
          "data.cacheRedisCommit.status"
        )
      )
        throw "viber:set_webhook:error:cache-channel";

      // cache global channel names
      if (ch.info.is_global) {
        await channelsCacheGlobal.commit({ [ch.name]: 1 });
      }
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value) ps.successful(onSuccess);
  };
  // {"channel:name": "message:text"}
  const batchSendText = async (
    channelMessage: Record<string, string>,
    onSuccess: any = noop
  ) => {
    if (enabled.value) {
      try {
        ps.begin();
        if (
          get(
            await $fetch(ENDPOINT_GRAPHQL, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${auth.token$}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: {
                query: queryViberSendTextMessage,
                variables: {
                  payload: channelMessage,
                },
              },
            }),
            "data.viberSendTextMessage.error"
          )
        )
          throw "viber:batchSendText:error";
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value) ps.successful(onSuccess);
    }
  };

  // (globals & active) | (groups & active)
  const channelsAccess = <T = any>(users: T[]) => {
    const chActive = keys(channelsCache.store.value);
    return union(
      intersection(chActive, keys(channelsCacheGlobal.store.value)),
      intersection(
        chActive,
        [].concat(
          ...map(users, (u: any) => keys(get(u, "profile.viber_channels", {})))
        )
      )
    );
  };
  const messageFormat = (userName: string, message: string) =>
    `${userName} -- ${message}`;

  const processing = computed(() =>
    some([
      processingCache.value,
      setWebhookLoading.value,
      viberChannelSetupChannelsDropLoading.value,
      toValue(ps.processing),
    ])
  );

  return {
    enabled,
    processing,
    configure: {
      set_webhook,
      channels_drop,
    },
    send: {
      text: batchSendText,
    },
    cache: {
      ...channelsCache,
      global: {
        ...channelsCacheGlobal,
      },
    },
    utils: {
      channelsAccess,
      messageFormat,
      // alias
      intersectUsersChannels: channelsAccess,
    },
  };
};
