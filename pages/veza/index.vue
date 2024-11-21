<script setup lang="ts">
// ##imports
import {
  VFabMain,
  VCardDataIterator,
  VBtnTopicChatToggle,
  VMenuComposeChatMessage,
  VSnackbarSuccess,
} from "@/components/app";
import type { IAsset } from "@/types";

// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  app: { BODY_ADD_CLASS },
} = useAppConfig();
// ##schemas
// ##utils
const { assetsDigitalChannel } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const chatsSelected = ref();
const toggleMessageCompose = useToggleFlag();
const toggleNotificationsSendSuccess = useToggleFlag();
const toggleChatsDeletedSuccess = useToggleFlag();
const resetIdMessage = useUniqueId();
// ##data ##auth ##state
// const auth = useStoreApiAuth();
const {
  assets: channels,
  reload,
  remove: chatsRemove,
} = useQueryManageAssetsComms(undefined, true);
const {
  title: messaging_default_title,
  notificationSendChats,
  responseOkChats,
} = useMessagingNotification();
// ##computed
// ##forms ##handlers ##helpers
const toId = (node: any) => Number(node?.id);
const itemTo = (ch: IAsset) => ({
  name: "veza-cid",
  params: { cid: ch.id },
});
const topicCH = (ch: any) =>
  topicWithTitle(assetsDigitalChannel(ch.key), ch.name);
const fmtTitle = (ch: IAsset) => startCase(ch.name);
const handleDelete = async (selection: any) => {
  try {
    ps.begin(toggleChatsDeletedSuccess.off);
    const rm_aids = map(selection, toId);
    if (isEmpty(rm_aids)) throw "--assets:chats:remove-failed";
    if (get(await chatsRemove(rm_aids), "data.assetsRemove.error"))
      throw "--assets:chats:remove-failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      toggleChatsDeletedSuccess.on();
    });
};
const onMessage = async (message: any) => {
  try {
    ps.begin(toggleNotificationsSendSuccess.off);
    if (!message) throw "--notificatoinsChats:error";
    if (
      !responseOkChats(
        await notificationSendChats(
          map(chatsSelected.value, toId),
          {
            title: messaging_default_title.value,
            body: message,
          },
          // skip this_user
          false
        )
      )
    )
      throw "--notificatoinsChats:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      // clear/close menu/form
      resetIdMessage();
      toggleMessageCompose.off();
      // notify success
      toggleNotificationsSendSuccess.on();
    });
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Veza" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--veza">
    <VSnackbarSuccess v-model="toggleNotificationsSendSuccess.isActive.value">
      <p>Obaveštenje je uspešno poslato.</p>
    </VSnackbarSuccess>
    <VMenuComposeChatMessage
      v-model="toggleMessageCompose.isActive.value"
      :activator="undefined"
      :attach="`.${BODY_ADD_CLASS}`"
      topic="ac19719e-27eb-5ad8-895d-2211b9d89156"
      notification
      @message="onMessage"
      positioned
      :reset-id="resetIdMessage.ID.value"
    />
    <VCardDataIterator
      v-model="chatsSelected"
      :items="channels"
      :reload="reload"
      :item-to="itemTo"
      item-title="name"
      item-value="id"
      :card-props="{ class: 'pa-0 ma-0' }"
      :props-list="{ class: 'ps-0 ms-0' }"
      :props-list-item="{
        class: 'ps-3',
      }"
      :props-title="{ class: 'ms-3' }"
      :format-title="fmtTitle"
    >
      <template #list-item-append="{ item: channel_ }">
        <VBtnTopicChatToggle
          :topic="topicCH(channel_)"
          elevation="1"
          density="comfortable"
          variant="text"
        />
      </template>
      <template #menu="{ selection }">
        <VList
          class="VList--AeyE0Sqk3yw py-0"
          :items="[
            {
              title: 'Obaveštenje',
              value: '04417230-4a5a-5f7f-b45e-1158f4b1c011',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: 'notification',
                  size: '1.22rem',
                  class: '*text-error opacity-30',
                },
                handle: toggleMessageCompose.on,
              },
            },
            {
              type: 'divider',
            },
            {
              title: 'Obriši kanale',
              value: 'c8789474-64b2-544a-8edf-6c1c353ee853',
              props: {
                class: 'ms-4 text-body-1',
                icon: {
                  icon: 'trash',
                  size: '1.122rem',
                  class: 'text-error opacity-30',
                },
                handle: () => handleDelete(selection),
              },
            },
          ]"
        >
          <template #divider>
            <VDivider class="border-opacity-100" length="100%" />
          </template>
          <template #item="{ props: d }">
            <VListItem @click="d.handle" link :disabled="d.disabled">
              <template #prepend>
                <Iconx v-bind="d.icon" />
              </template>
              <template #title>
                <VListItemTitle class="ms-3">{{
                  startCase(d.title)
                }}</VListItemTitle>
              </template>
            </VListItem>
          </template>
        </VList>
      </template>
    </VCardDataIterator>
    <VFabMain :to="{ name: 'veza-nov-kanal' }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.VList--AeyE0Sqk3yw .v-list-item__prepend {
  min-width: 22px;
}
</style>
