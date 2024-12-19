<script setup lang="ts">
// mGboFLwXJpbrJ1T
import { useDisplay } from "vuetify";
import type { IAsset } from "@/types";
import {
  VFabMain,
  VCardDataIterator,
  VMenuComposeChatMessage,
  VSnackbarMain,
  VListItemDisplayGroup,
} from "@/components/app";
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const { APP_NAME } = useAppConfig();

// @utils
const { smAndUp } = useDisplay();
const ps = useProcessMonitor();
const sigID_deselect = useUniqueId();

// @refs @models
const selection = ref();
const toggleMenuActiveMessages = useToggleFlag();
const toggleMenuActiveNotification = useToggleFlag();

const toggleGroupMessageSuccess = useToggleFlag();
const toggleGroupNotificationSuccess = useToggleFlag();
const toggleGroupRemovedSuccess = useToggleFlag();

const suid = inject(key_UID);
const userDisplayName = inject(key_USER_DISPLAY_NAME);

// @data @auth
const {
  assets: groups,
  reload,
  processing,
  remove: gRemove,
} = useQueryManageAssetsGroups();
const { groupMessageMany, responseOkGroupMessageMany } = useQueryComms();
const { notificationSend, responseOk: notificationResponseOk } =
  useMessagingNotification();

// @forms @helpers
const toId = toIds;
const itemTo = (item: any) => ({
  name: "aktiva-grupe-gid",
  params: { gid: item?.id },
});
const {
  categoryNode,
  groups: { top: g_top },
} = useCategoryAssets();
const itemGroups = (g: any) =>
  [get(categoryNode(g, g_top), "model.title")].filter(Boolean);
const onGroupMessageMany = async (message: string) => {
  const gids = map(selection.value, toId);
  if (!isEmpty(gids))
    if (responseOkGroupMessageMany(await groupMessageMany({ gids, message })))
      toggleGroupMessageSuccess.on();
};
const onGroupNotificationMany = async (message: string) => {
  const uids = difference(
    union(...map(selection.value, (g: any) => map(g.users, toId))),
    [Number(suid?.value)]
  );
  if (!isEmpty(uids))
    if (
      notificationResponseOk(
        await notificationSend(uids, {
          title: [
            "Obaveštenje",
            APP_NAME,
            userDisplayName?.value ? "@" + userDisplayName.value : "",
          ]
            .filter(Boolean)
            .join(" | "),
          body: message,
        })
      )
    )
      toggleGroupNotificationSuccess.on();
};
const assetsGroupsRemove = async () => {
  let res;
  if (!isEmpty(selection.value)) {
    try {
      ps.begin();
      res = await Promise.all(
        map(selection.value, async (g: any) => await gRemove([Number(g.id)]))
      );
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (
      !ps.error.value &&
      every(res, (r: any, i: any) => !get(r, `${i}.data.assetsRemove.error`))
    ) {
      ps.successful(sigID_deselect);
      toggleGroupRemovedSuccess.on();
    }
  }
};
const fmtTitle = (g: IAsset, _idx: number) => startCase(g.name);
// @watch
// close message:compose @send:success
watch(toggleGroupMessageSuccess.isActive, (isActive) => {
  if (isActive) toggleMenuActiveMessages.off();
});
watch(toggleGroupNotificationSuccess.isActive, (isActive) => {
  if (isActive) toggleMenuActiveNotification.off();
});

// @head
useHead({ title: "Grupe" });

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleGroupRemovedSuccess.isActive.value"
    >
      <span>Grupe su uspešno ažurirane.</span>
    </VSnackbarMain>
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleGroupMessageSuccess.isActive.value"
    >
      <span>Poruka je uspešno poslata.</span>
    </VSnackbarMain>
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleGroupNotificationSuccess.isActive.value"
    >
      <span>Obaveštenje je uspešno poslato.</span>
    </VSnackbarMain>
    <VMenuComposeChatMessage
      v-model="toggleMenuActiveMessages.isActive.value"
      :activator="undefined"
      @message="onGroupMessageMany"
      :class="[
        '!top-[33%] -translate-y-[33%]',
        smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
      ]"
      :width="smAndUp ? 395 : '92%'"
      topic="message:3e6b99b6-71b4-5aef-8c3a-a5c53aff1ef8"
    />
    <VMenuComposeChatMessage
      v-model="toggleMenuActiveNotification.isActive.value"
      :activator="undefined"
      @message="onGroupNotificationMany"
      :class="[
        '!top-[33%] -translate-y-[33%]',
        smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
      ]"
      :width="smAndUp ? 395 : '92%'"
      topic="notification:15179eac-8483-5b71-8451-ced73b607780"
      notification
    />
    <VCardDataIterator
      v-model="selection"
      :items="groups"
      item-title="name"
      :item-groups="itemGroups"
      :item-to="itemTo"
      :reload="reload"
      :card-props="{ disabled: processing }"
      :menu-props="{ 'max-height': 255 }"
      :props-title="{ class: 'ps-3 *pt-1' }"
      :props-selection="{ class: '-translate-y-[2px]' }"
      :props-list-item="{ class: 'ps-2' }"
      :props-dots-menu-icon="{ size: '1.5rem' }"
      :signal-id-deselect="sigID_deselect.ID.value"
      :format-title="fmtTitle"
    >
      <template #list-item="props_">
        <div class="__space my-1 ps-1">
          <VListItemDisplayGroup
            :to="itemTo(props_.node.raw)"
            rounded="s-pill"
            :props-avatar="{ size: 52 }"
            :props-title="{ class: 'text-h6' }"
            v-bind="props_"
          />
        </div>
      </template>

      <template #menu>
        <VList>
          <VListItem @click="toggleMenuActiveMessages" value="item@1">
            <template #prepend>
              <Iconx class="ms-1 me-4 opacity-30" size="1.22rem" icon="chat" />
            </template>
            <VListItemTitle>Poruka</VListItemTitle>
          </VListItem>
          <VListItem @click="toggleMenuActiveNotification" value="item@2">
            <template #prepend>
              <Iconx
                class="ms-1 me-[12px] opacity-20"
                size="1.5rem"
                icon="notification"
              />
            </template>
            <VListItemTitle>Obaveštenje</VListItemTitle>
          </VListItem>
          <VDivider class="border-opacity-100 mt-3" />
          <VListItem link @click="assetsGroupsRemove">
            <template #prepend>
              <Iconx
                class="ms-1 me-[15px] opacity-20 text-error"
                size="1.33rem"
                icon="trash"
              />
            </template>
            <span>Obriši grupe</span>
          </VListItem>
        </VList>
      </template>
    </VCardDataIterator>
    <VFabMain
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      :to="{ name: 'aktiva-grupe-nova' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
