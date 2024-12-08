import type { ITopicChatMessage } from "@/types";
// chats data interface
export const useDocsTopicChat = <T = ITopicChatMessage>() => {
  const { topic } = useGlobalVariableChatActive();

  // # 0 created_at:asc
  // # 1 created_at:desc
  const d = useDocs<T>(topic, undefined, 0);

  // cache last message for a chat topic
  const client = useCacheRedis(topic);
  watchEffect(async () => {
    if (topic.value) {
      await client.commit({
        message: last(d.data.value) || null,
      });
    }
  });

  return {
    ...d,
    topic,
    // alias
    chat: d.data,
  };
};
