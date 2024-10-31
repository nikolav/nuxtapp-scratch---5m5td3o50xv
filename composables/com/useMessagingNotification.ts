import { M_cloudMessagingNotifications } from "@/graphql";
export const useMessagingNotification = () => {
  const { mutate } = useMutation(M_cloudMessagingNotifications);
  const responseOk = (response: any) =>
    !isEmpty(
      get(response, "data.cloudMessagingNotifications.status.responses")
    );
  const notificationSend = async (
    uids: number[],
    payload: { title: string; body: string; image?: string | undefined }
  ) => await mutate({ uids, payload });
  return { notificationSend, responseOk };
};
