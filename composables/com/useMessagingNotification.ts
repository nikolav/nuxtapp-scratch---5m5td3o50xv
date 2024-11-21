import type { OrNoValue } from "@/types";
import {
  M_cloudMessagingNotifications,
  M_cloudMessagingNotificationsChats,
} from "@/graphql";
export const useMessagingNotification = () => {
  const auth = useStoreApiAuth();
  const { mutate } = useMutation(M_cloudMessagingNotifications);
  const { mutate: mutateSendChats } = useMutation(
    M_cloudMessagingNotificationsChats
  );
  const responseOk = (response: any) =>
    !isEmpty(
      get(response, "data.cloudMessagingNotifications.status.responses")
    );
  const notificationSend = async (
    uids: number[],
    payload: { title: string; body: string; image?: string | undefined }
  ) => await mutate({ uids, payload });
  const responseOkChats = (response: any) =>
    !get(response, "data.cloudMessagingNotificationsChats.error");
  const notificationSendChats = async (
    cids: number[],
    payload: { title: string; body: string; image?: OrNoValue<string> },
    AND_THIS = true
  ) => await mutateSendChats({ cids, payload, AND_THIS });
  const messageTitle_default = computed(
    () => `Obaveštenje | ${auth.displayName} | teren:frikom`
  );

  return {
    title: messageTitle_default,
    notificationSend,
    notificationSendChats,
    responseOk,
    responseOkChats,
  };
};
