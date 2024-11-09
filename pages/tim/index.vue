<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { IUser, OrNoValue } from "@/types";
import { renderIcon, Iconx } from "@/components/icons";
import {
  VChipPlus,
  VBtnFilterClear,
  VFabMain,
  VBadgeUserAvailability,
  VBtnShowLocation,
  VMenuComposeChatMessage,
  VSnackbarSuccess,
  VDialogManageUsersTags,
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
  app: { TOOLTIPS_OPEN_DELAY, SEARCH_DEBOUNCE_DELAY, DEFAULT_TRANSITION },
  layout: { toolbarMainHeight },
  APP_NAME,
  io: { IOEVENT_ACCOUNTS_UPDATED },
} = useAppConfig();
const headers = [
  {
    title: "",
    key: "data-table-select",
  },
  {
    title: "Osoba",
    key: "fullname",
    value: (node: any) =>
      get(node, "profile.displayName", "") ||
      [get(node, "profile.lastName", ""), get(node, "profile.firstName", "")]
        .filter(Boolean)
        .join(", ") ||
      get(node, "email"),
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

// @utils
const toUid = (u: any) => Number(u.id);

// @data
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

// @refs @flags
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

// @utils
const toggleToolbarSecondary = useToggleFlag();
const {
  page$,
  length: totPages,
  perPage,
} = usePaginatedData({
  // data: users,
  data: usersFilteredGroups,
  perPage: 6,
});

// @helpers
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

// show @@user screen
const { showUserScreen } = useNavigationUtils();
const calcValueOf = (maybeCallableOrValue: any, node: any) =>
  isFunction(maybeCallableOrValue)
    ? maybeCallableOrValue(node)
    : maybeCallableOrValue;

// @forms
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
      <span>Obaveštenje je uspešno poslato.</span>
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
        :headers="headers"
        :items="usersFilteredGroups"
        v-model="selection"
        :search="usersDataFilter"
        :items-per-page="perPage"
        :page="page$"
        show-select
        hide-default-footer
        hover
        return-object
        color="primary"
        density="comfortable"
        class="CLASS--VDataTable--no-row-divider"
        @update:model-value="onModelValueDataTable"
      >
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
                <VList>
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
                  <VDivider class="border-opacity-100" />
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
        </template>

        <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
          <tr class="text-body-2">
            <template v-for="column in columns" :key="column.key">
              <td>
                <span class="d-flex items-center">
                  <VIcon
                    v-if="isSorted(column)"
                    :size="14"
                    :icon="getSortIcon(column)"
                    class="-translate-y-px"
                  />
                  <small
                    class="ms-1 opacity-50"
                    :class="[column.sortable ? 'cursor-pointer' : undefined]"
                    @click="() => column.sortable && toggleSort(column)"
                    >{{ column.title }}</small
                  >
                </span>
              </td>
            </template>
          </tr>
        </template>

        <!-- render row --custom-strategy -->
        <template
          #item="{ internalItem, item, isSelected, toggleSelect, columns }"
        >
          <tr
            @click="showUserScreen(item.id)"
            class="cursor-pointer *:align-middle"
          >
            <template v-for="col in columns" :key="col.key">
              <td
                v-if="'data-table-select' === col.key"
                style="width: 1%"
                class="ps-2 pe-0"
              >
                <VCheckboxBtn
                  class="mx-0 scale-[122%] -translate-y-px"
                  @click.stop
                  :model-value="isSelected(internalItem)"
                  @update:model-value="toggleSelect(internalItem)"
                  density="compact"
                  :false-icon="iconCheckOff"
                  :true-icon="iconCheckOn"
                  color="primary"
                  base-color="secondary-lighten-1"
                />
              </td>
              <td
                v-else-if="col.key == 'groups'"
                :class="[smAndUp ? undefined : 'px-0 ps-1']"
              >
                <VChipPlus
                  :items="item.groups"
                  :size="smAndUp ? undefined : 'small'"
                />
              </td>
              <!-- @@ -->
              <td
                v-else-if="col.key == 'fullname'"
                :class="[smAndUp ? undefined : 'ps-1']"
              >
                <VBadgeUserAvailability class="!translate-y-1" :uid="item.id" />
                <VBtnShowLocation
                  :props-sheet="{ color: 'info' }"
                  :props-menu="{
                    location: 'bottom',
                  }"
                  class="-translate-y-[2px] me-1"
                  :uid="item.id"
                  :props-icon="{ size: '1.55rem' }"
                >
                  <template #location="{ profile }">
                    <strong class="text-lg">{{
                      profile.displayLocation
                    }}</strong>
                  </template>
                </VBtnShowLocation>
                <strong
                  class="text-body-1 ps-1"
                  :class="[
                    item.is_manager ? 'text-primary-darken-1' : undefined,
                  ]"
                  >{{ calcValueOf(col.value, item) }}</strong
                >
              </td>
              <td v-else>
                <span>{{ calcValueOf(col.value, item) }}</span>
              </td>
            </template>
          </tr>
        </template>
      </VDataTable>

      <template #actions>
        <VSpacer />
        <!-- @@ -->
        <VPagination
          v-if="1 < sizeUsers"
          v-model="page$"
          :length="totPages"
          :total-visible="1"
          variant="text"
          color="primary"
          rounded="circle"
          density="comfortable"
        >
          <template #item>
            <small class="opacity-50 pt-2 d-inline-block">{{
              `${page$} / ${totPages}`
            }}</small>
          </template>
        </VPagination>
        <VSpacer />
      </template>
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
<style lang="scss" scoped></style>
