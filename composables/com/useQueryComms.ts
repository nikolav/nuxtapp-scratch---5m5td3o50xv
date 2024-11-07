import { z } from "zod";
import { M_commsMessageMany, M_commsGroupMessageMany } from "@/graphql";

const schemaMessageMany = z.object({
  message: z.string().trim().min(1),
  uids: z.array(z.coerce.number()).nonempty(),
});
const schemaGroupMessageMany = z.object({
  gids: z.array(z.coerce.number()).nonempty(),
  message: z.string().trim().min(1),
});
export const useQueryComms = () => {
  const uid = inject(key_UID);
  const userDisplayName = inject(key_USER_DISPLAY_NAME);
  const messageMake = (message: string) => ({
    uid: uid?.value,
    name: userDisplayName?.value,
    message,
  });

  const { watchProcessing } = useStoreAppProcessing();
  const pc = useProcessMonitor();

  const { mutate: mutateCommsMessageMany } = useMutation(M_commsMessageMany);
  const { mutate: mutateCommsGroupMessageMany } = useMutation(
    M_commsGroupMessageMany
  );

  // commsGroupMessageMany(gids: [ID!]!, message: JsonData!): JsonData!
  const groupMessageMany = async (config?: any) => {
    // config { message: string; gids: number[] }
    let res;
    try {
      pc.begin();
      const msg = schemaGroupMessageMany.parse(config);
      res = await mutateCommsGroupMessageMany({
        gids: msg.gids,
        message: messageMake(msg.message),
      });
    } catch (error) {
      pc.setError(error);
    } finally {
      pc.done();
    }
    if (!pc.error.value) pc.successful();
    return res;
  };
  const responseOkGroupMessageMany = (res: any) =>
    !isEmpty(get(res, "data.commsGroupMessageMany.status.gids"));

  // commsMessageMany(uids: [ID!]!, message: JsonData!): JsonData!
  const messageMany = async (
    // config { message: string; uids: number[] }
    // config?: OrNoValue<z.infer<typeof schemaMessageMany>>
    config?: any
  ) => {
    let res;
    try {
      pc.begin();
      const msg = schemaMessageMany.parse(config);
      res = await mutateCommsMessageMany({
        uids: msg.uids,
        message: messageMake(msg.message),
      });
    } catch (error) {
      pc.setError(error);
    } finally {
      pc.done();
    }
    if (!pc.error.value) pc.successful();
    return res;
  };
  const responseOkMessageMany = (res: any) =>
    !isEmpty(get(res, "data.commsMessageMany.status.uids"));

  watchProcessing(pc.processing);

  return {
    processing: pc.processing,
    // send
    messageMany,
    groupMessageMany,
    // message response status-check
    responseOkGroupMessageMany,
    responseOkMessageMany,
  };
};
