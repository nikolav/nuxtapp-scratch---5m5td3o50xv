import { z } from "zod";

import { ENDPOINT_GRAPHQL, VIBER_SET_WEBHOOK_URL } from "@/config";
import { M_viberChannelSetupSetWebhook } from "@/graphql";

const queryViberSendTextMessage = `
  mutation m_viberSendTextMessage($payload: JsonData!) {
    viberSendTextMessage(payload: $payload)
  }
`;

const schemaViberChannelInput = z.object({
  url: z.string().url(),
  auth_token: z.string(),
});
const schemaViberChannelAccount = z.object({
  name: z.string(),
  info: z.object({
    from: z.string(),
    auth_token: z.string(),
  }),
});

export const useViberChannels = () => {
  const auth = useStoreApiAuth();
  const enabled = computed(() => auth.isAuthenticated$);
  const ps = useProcessMonitor();

  const {
    viber: { VIBER_CHANNELS_CACHEID },
  } = useAppConfig();
  const { commit: channelsCacheCommit, processing: processingCache } =
    useCacheRedis(VIBER_CHANNELS_CACHEID, false);
  const { mutate: mutateViberSetWebhook, loading: setWebhookLoading } =
    useMutation(M_viberChannelSetupSetWebhook);
  const set_webhook = async (
    channelName: string,
    auth_token: string,
    onSuccess: any = noop
  ) => {
    try {
      ps.begin();
      const setup_ = await mutateViberSetWebhook(
        schemaViberChannelInput.parse({
          // https://zyeqzw35h4kv5b70k7uqim.site/webhook_viber_channel/<channelName>
          url: `${trimEnd(VIBER_SET_WEBHOOK_URL, "/")}/${channelName}`,
          auth_token,
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
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value) ps.successful(onSuccess);
  };
  // {"channel:name": "message:text"}
  const batchSendText = async (channelMessage: Record<string, string>) => {
    let res: any;
    if (enabled.value) {
      try {
        ps.begin();
        res = await $fetch(ENDPOINT_GRAPHQL, {
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
        });
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value) ps.successful();
    }
    return res;
  };

  const processing = computed(() =>
    some([
      processingCache.value,
      setWebhookLoading.value,
      toValue(ps.processing),
    ])
  );

  return {
    enabled,
    processing,
    configure: {
      set_webhook,
    },
    send: {
      text: batchSendText,
    },
  };
};
