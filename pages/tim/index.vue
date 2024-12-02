<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { IUser, OrNoValue } from "@/types";
import { renderIcon, Iconx } from "@/components/icons";
import {
  // VChipPlus,
  VBtnFilterClear,
  VFabMain,
  // VBadgeUserAvailability,
  // VBtnShowLocation,
  VMenuComposeChatMessage,
  VSnackbarSuccess,
  VDialogManageUsersTags,
  VListItemTimShowUser,
  VSheetPinCodeRequired,
  VEmptyStateNoData,
} from "@/components/app";

definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

// @config
useHead({
  title: "Tim",
});
const { smAndUp } = useDisplay();
const {
  app: {
    TOOLTIPS_OPEN_DELAY,
    SEARCH_DEBOUNCE_DELAY,
    DEFAULT_TRANSITION,
    BODY_ADD_CLASS,
  },
  layout: { toolbarMainHeight },
  APP_NAME,
  io: { IOEVENT_ACCOUNTS_UPDATED },
} = useAppConfig();

const { calcDisplayName } = useAuthUtils();
const headers = [
  {
    title: "",
    key: "data-table-select",
  },
  {
    title: "Osoba",
    key: "fullname",
    value: calcDisplayName,
  },
  {
    title: "Grupe",
    key: "groups",
    value: (node: any) => get(node, "groups", []).join(", "),
    sortable: false,
  },
];

// @icons
const iconCheckOff = renderIcon("check-off");
const iconCheckOn = renderIcon("check-on");
const iconSearch = renderIcon("search", {
  class: "opacity-50",
});

// ##utils
const toUid = toIds;
const ps = useProcessMonitor();

// @data
const auth = useStoreApiAuth();
const { drop: accountDrop } = useMutationAccountsManage();
const {
  users,
  reload: usersReload,
  reload: reloadUsers,
  // } = useQueryUsers();
  // } = useQueryUsersSearch("tagged", { tags: ["foo", "bar"], ALL: true });
} = useQueryUsersSearch("groups-shared");
const { messageMany } = useQueryComms();
const { notificationSend, responseOk: notificationResponseOk } =
  useMessagingNotification();

// ##refs ##flags
const usersSearch = ref();
const usersDataFilter = ref();
const groupsSelected = ref<string[]>();
const groupSelectionMany = ref<string[]>([]);
const selection = ref<any[]>([]);
const somePicked = computed(() => !isEmpty(selection.value));

const usersFilteredGroups = computed(() =>
  isEmpty(groupsSelected.value)
    ? users.value
    : filter(users.value, (user: IUser) =>
        some(groupsSelected.value, (g: string) => user.groups?.includes(g))
      )
);
const toggleMessageManyPosted = useToggleFlag();
const toggleNotificationPosted = useToggleFlag();
const toggleMenuIsActiveMessageMany = useToggleFlag();
const toggleMenuIsActiveNotification = useToggleFlag();
const toggleDialogUsersTagsIsActive = useToggleFlag();
const userDisplayName = inject(key_USER_DISPLAY_NAME);

const toggleMenuPinCodeRequiredOnAccountRemove = useToggleFlag();

const uidsSelectedKEY = useUniqueId();
const uidsSelected = ref<OrNoValue<number[]>>();
const uidsSelect = (selectionUsers: OrNoValue<any[]>) => {
  uidsSelected.value = map(selectionUsers, toUid) || [];
};
const onModelValueDataTable = (selection: OrNoValue<IUser[]>): void => {
  uidsSelect(selection);
  uidsSelectedKEY();
};

// @computed
const noUsers = computed(() => isEmpty(usersFilteredGroups.value));
const sizeUsers = computed(() => len(usersFilteredGroups.value));
const isEmptyGroupsSelected = computed(() => isEmpty(groupsSelected.value));
const groupsAll = computed(() =>
  sortBy(union(...map(users.value, "groups")), upperCase)
);
const selectionUids = computed(() => map(selection.value, toUid));
const disabledBtnAccountsRemove = computed(
  () => !auth.isAdmin$ || 1 !== len(selection.value)
);

// ##utils
const toggleToolbarSecondary = useToggleFlag();
const placement_JRK4nyTV6J = usePanelPlacedViewport();

// ##forms ##helpers
const filterClear = () => {
  usersSearch.value = undefined;
  groupsSelected.value = groupSelectionMany.value = [];
};
const usersSelectAll = () => {
  selection.value = usersFilteredGroups.value;
};
const usersSelectAllOff = () => {
  selection.value = [];
};
const usersSelectToggle = () => {
  selection.value = differenceBy(
    usersFilteredGroups.value,
    selection.value,
    "id"
  );
};

// ##forms
const onSubmitApplyGroupFiler = () => {
  groupsSelected.value = groupSelectionMany.value;
};
const onMessageMany = async (message: string) => {
  if (
    !isEmpty(
      get(
        await messageMany({ message, uids: selectionUids.value }),
        "data.commsMessageMany.status.uids"
      )
    )
  ) {
    // message published
    toggleMessageManyPosted.on();
  }
};
const onNotification = async (body: string) => {
  if (
    notificationResponseOk(
      await notificationSend(selectionUids.value, {
        title: [
          "Obaveštenje",
          APP_NAME,
          userDisplayName?.value ? "@" + userDisplayName.value : "",
        ]
          .filter(Boolean)
          .join(" | "),
        body,
      })
    )
  ) {
    // notification published
    toggleNotificationPosted.on();
  }
};

// @@
const handleAccountOnRemove = async () => {
  try {
    ps.begin();
    const uid_ = first(selectionUids.value);
    if (get(await accountDrop(uid_), "data.accountsDrop.error"))
      throw "--account:remove:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      // usersSelectAllOff();
      toggleMenuPinCodeRequiredOnAccountRemove.off();
    });
  console.log({ error: ps.error.value });
};

// @watch
watch(
  usersSearch,
  debounce((search: string) => {
    usersDataFilter.value = search || undefined;
  }, SEARCH_DEBOUNCE_DELAY)
);
watch(toggleMessageManyPosted.isActive, (isActive) => {
  if (isActive) {
    toggleMenuIsActiveMessageMany.off();
  }
});
watch(toggleNotificationPosted.isActive, (isActive) => {
  if (isActive) {
    toggleMenuIsActiveNotification.off();
  }
});
// @on:selection:manual/soft
//  update .uidsSelected
watch(selection, uidsSelect);
// @on-users
//  re-select active
watch(users, () => {
  if (!isEmpty(uidsSelected.value)) {
    selection.value = filter(users.value, (u: any) =>
      uidsSelected.value!.includes(Number(u.id))
    );
  }
});

// @io
useIOEvent(IOEVENT_ACCOUNTS_UPDATED, reloadUsers);

// @@eos
</script>
<template>
  <section class="page--tim">
    <VMenu
      v-model="toggleMenuPinCodeRequiredOnAccountRemove.isActive.value"
      :activator="undefined"
      :attach="`.${BODY_ADD_CLASS}`"
      :close-on-content-click="false"
      v-bind="placement_JRK4nyTV6J"
    >
      <VSheetPinCodeRequired
        :max-width="undefined"
        :message="`Pin za brisanje naloga [${calcDisplayName(
          first(selection)
        )}]:`"
      >
        <template #actions="{ text, pin }">
          <VBtn
            @click="handleAccountOnRemove"
            color="error"
            variant="tonal"
            :disabled="text != pin"
            rounded="pill"
            class="px-3"
          >
            <Iconx icon="trash" size="1.22rem" class="opacity-85" />
            <span class="ms-1">Obriši nalog</span>
          </VBtn>
        </template>
      </VSheetPinCodeRequired>
    </VMenu>

    <VMenuComposeChatMessage
      v-model="toggleMenuIsActiveMessageMany.isActive.value"
      :activator="undefined"
      @message="onMessageMany"
      :class="[
        '!top-[33%] -translate-y-[33%]',
        smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
      ]"
      :width="smAndUp ? 395 : '92%'"
      topic="message@tim"
    />
    <VMenuComposeChatMessage
      notification
      v-model="toggleMenuIsActiveNotification.isActive.value"
      :activator="undefined"
      @message="onNotification"
      :class="[
        '!top-[33%] -translate-y-[33%]',
        smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
      ]"
      :width="smAndUp ? 395 : '92%'"
      topic="notification@tim"
    />
    <VSnackbarSuccess v-model="toggleMessageManyPosted.isActive.value">
      <span>Poruka je uspešno poslata.</span>
    </VSnackbarSuccess>
    <VSnackbarSuccess v-model="toggleNotificationPosted.isActive.value">
      <p>Obaveštenje je uspešno poslato.</p>
    </VSnackbarSuccess>
    <VDialogManageUsersTags
      :key="uidsSelectedKEY.ID.value"
      v-model:uids="uidsSelected"
      v-model="toggleDialogUsersTagsIsActive.isActive.value"
    />
    <VCard id="ID--P8jDb" density="comfortable" variant="text" rounded="0">
      <!-- # https://vuetifyjs.com/en/components/data-tables/basics/#items -->
      <VDataTable
        id="ID--1QknrimP7"
        v-model="selection"
        @update:model-value="onModelValueDataTable"
        :headers="headers"
        :items="usersFilteredGroups"
        :search="usersDataFilter"
        :items-per-page="-1"
        hide-default-footer
        hide-default-header
        hover
        color="primary"
        density="comfortable"
        return-object
        class="CLASS--VDataTable--no-row-divider"
      >
        <template #no-data>
          <VEmptyStateNoData class="opacity-50" />
        </template>
        <template #top>
          <!-- @@toolbar:1 -->
          <VToolbar
            v-if="!toggleToolbarSecondary.isActive.value"
            :height="toolbarMainHeight"
            color="primary"
            class="px-0 *:space-x-1"
          >
            <!-- @@toolbar:start -->
            <!-- selection.count, divider -->
            <template v-if="!noUsers">
              <span class="d-flex items-center gap-2 ps-2">
                <em class="opacity-50">{{ selection.length }}</em>
                <span>&#47;</span>
                <VBadge
                  color="primary-lighten-2"
                  inline
                  :content="sizeUsers"
                  class="opacity-50 mx-0 px-0 -translate-x-1"
                />
              </span>
              <VDivider vertical inset />
            </template>
            <VBtn
              @click="usersSelectAllOff"
              density="comfortable"
              icon
              variant="plain"
              color="on-primary"
            >
              <Icon name="fluent:select-all-off-24-regular" size="1.55rem" />
              <VTooltip
                activator="parent"
                text="Poništi"
                location="bottom"
                :open-delay="TOOLTIPS_OPEN_DELAY"
              />
            </VBtn>
            <VBtn
              @click="usersSelectAll"
              density="comfortable"
              icon
              variant="plain"
              color="on-primary"
            >
              <Icon name="fluent:select-all-on-24-regular" size="1.55rem" />
              <VTooltip
                activator="parent"
                text="Svi"
                location="bottom"
                :open-delay="TOOLTIPS_OPEN_DELAY"
              />
            </VBtn>
            <VBtn
              @click="usersSelectToggle"
              density="comfortable"
              icon
              variant="plain"
              color="warning-lighten-1"
            >
              <Icon name="fluent:select-all-on-24-regular" size="1.55rem" />
              <VTooltip
                activator="parent"
                text="Suprotno"
                location="bottom"
                :open-delay="TOOLTIPS_OPEN_DELAY"
              />
            </VBtn>
            <VBtn
              @click="toggleToolbarSecondary"
              density="comfortable"
              icon
              variant="plain"
            >
              <Icon name="material-symbols:search" size="1.55rem" />
              <VTooltip
                activator="parent"
                text="Traži"
                location="bottom"
                :open-delay="TOOLTIPS_OPEN_DELAY"
              />
            </VBtn>
            <VSpacer />
            <!-- @@filter:clear -->
            <VBtnFilterClear
              v-if="usersDataFilter || !isEmptyGroupsSelected"
              @click="filterClear"
            />
            <VBtn
              size="small"
              @click="usersReload"
              density="comfortable"
              icon
              variant="plain"
              class="-ms-[4px]"
            >
              <VIcon icon="$loading" />
            </VBtn>
            <!-- @@dots coommands:rest -->
            <VBtn density="comfortable" icon variant="text">
              <Icon name="mdi:dots-vertical" size="1.35rem" />
              <!-- @@commands:menu -->
              <VMenu
                activator="parent"
                location="bottom end"
                max-width="392"
                :transition="DEFAULT_TRANSITION"
              >
                <VList class="py-0">
                  <!-- @@users:tags -->
                  <VListItem
                    @click="toggleDialogUsersTagsIsActive"
                    :disabled="!somePicked"
                    value="users-tags:GGn1YO3"
                  >
                    <template #prepend>
                      <Iconx
                        icon="label"
                        class="me-3 opacity-30"
                        size="1.25rem"
                      />
                    </template>
                    <VListItemTitle>
                      <span> Označi </span>
                    </VListItemTitle>
                  </VListItem>
                  <!-- @@message:many -->
                  <VListItem
                    @click="toggleMenuIsActiveMessageMany"
                    :disabled="!somePicked"
                    value="message:p5EtuiJpan"
                  >
                    <template #prepend>
                      <Iconx
                        icon="chat"
                        class="me-3 opacity-30"
                        size="1.25rem"
                      />
                    </template>
                    <VListItemTitle>
                      <span> Poruka </span>
                    </VListItemTitle>
                  </VListItem>
                  <!-- @@notification:users -->
                  <VListItem
                    @click="toggleMenuIsActiveNotification"
                    :disabled="!somePicked"
                    value="notification:8I30hrhUs"
                  >
                    <template #prepend>
                      <Iconx
                        icon="notification"
                        class="me-2 opacity-20 -translate-x-[2px]"
                        size="1.5rem"
                      />
                    </template>
                    <VListItemTitle>
                      <span> Obaveštenje </span>
                    </VListItemTitle>
                  </VListItem>
                  <VDivider class="border-opacity-100" />
                  <!-- @@account:drop -->
                  <VListItem
                    :disabled="disabledBtnAccountsRemove"
                    @click="toggleMenuPinCodeRequiredOnAccountRemove.on"
                    value="account:drop:JkncubP"
                  >
                    <template #prepend>
                      <Iconx
                        icon="account-remove"
                        size="1.5rem"
                        class="me-3 opacity-20 -translate-x-[2px] text-error"
                      />
                    </template>
                    <VListItemTitle>
                      <span> Obriši nalog </span>
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </VToolbar>
          <!-- @@toolbar:2 -->
          <VToolbar
            v-else
            :height="toolbarMainHeight"
            color="primary-lighten-2"
            floating
          >
            <template #prepend>
              <VBtn
                @click="toggleToolbarSecondary"
                variant="text"
                icon="$prev"
                density="comfortable"
              />
            </template>
            <VToolbarItems class="min-w-[13.55rem] CLASS--eGTtZYfHxr4Epde9o">
              <!-- @@search:users -->
              <VTextField
                v-model="usersSearch"
                autofocus
                center-affix
                density="compact"
                placeholder="Pretraga"
                single-line
                class="scale-[82%] -translate-x-3"
                variant="solo"
                rounded="pill"
                :append-inner-icon="iconSearch"
                clearable
              />
            </VToolbarItems>
            <VSpacer />
            <!-- @@filter:clear -->
            <VBtnFilterClear
              v-if="usersDataFilter || !isEmptyGroupsSelected"
              @click="filterClear"
            />
            <!-- @@groups:select -->
            <VBtn v-if="0 < groupsAll?.length" icon density="comfortable">
              <Icon size="1.33rem" name="material-symbols:filter-list" />
              <VMenu activator="parent" location="bottom end">
                <VSheet density="compact">
                  <VForm
                    @submit.prevent="onSubmitApplyGroupFiler"
                    autocomplete="off"
                  >
                    <VList
                      min-width="192"
                      class="py-0"
                      variant="flat"
                      density="compact"
                    >
                      <VListItem
                        v-for="groupName in groupsAll"
                        lines="one"
                        :key="groupName"
                        class="ps-1"
                        @click="
                          groupsSelected = groupSelectionMany = [groupName]
                        "
                      >
                        <template #prepend>
                          <VCheckboxBtn
                            v-model="groupSelectionMany"
                            :value="groupName"
                            color="primary"
                            density="comfortable"
                            @click.stop
                          />
                        </template>
                        <VListItemTitle class="ps-1">
                          {{ groupName }}
                        </VListItemTitle>
                      </VListItem>
                    </VList>
                    <VBtn
                      type="submit"
                      class="mt-2"
                      rounded="0"
                      block
                      variant="tonal"
                      >ok</VBtn
                    >
                  </VForm>
                </VSheet>
              </VMenu>
            </VBtn>
          </VToolbar>
          <VSpacer class="mb-1" />
        </template>

        <!-- render row --custom-strategy -->
        <template #item="{ internalItem, item, isSelected, toggleSelect }">
          <div class="__spacer my-3 ms-1">
            <VListItemTimShowUser :user="item" :props-avatar="{ size: 54 }">
              <template #selection>
                <VCheckboxBtn
                  class="px-0 mx-0 ms-1 scale-[122%] *-translate-y-px"
                  @click.stop
                  :model-value="isSelected(internalItem)"
                  @update:model-value="toggleSelect(internalItem)"
                  density="compact"
                  :false-icon="iconCheckOff"
                  :true-icon="iconCheckOn"
                  color="primary"
                  base-color="secondary-lighten-1"
                />
              </template>
            </VListItemTimShowUser>
          </div>
        </template>
      </VDataTable>
    </VCard>
    <!-- fab:action -->
    <VFabMain class="translate-y-2" :to="{ name: 'nalog-nov' }" />
  </section>
</template>
<style lang="scss">
#ID--1QknrimP7 table {
  table-layout: auto;
}
.CLASS--eGTtZYfHxr4Epde9o .v-input__append {
  margin-inline-start: 8px !important;
}
.CLASS--VDataTable--no-row-divider .v-table__wrapper tr > td {
  border-bottom: unset !important;
}
</style>
<style lang="scss" scoped>
.TH--CLASS-3FNdyoZPFwLjgg7fM0XU td {
  height: auto !important;
}
</style>
