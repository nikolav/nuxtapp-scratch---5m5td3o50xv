<script setup lang="ts">
// ##imports
import { renderIcon } from "@/components/icons";
import {
  VDataIteratorListData,
  VSnackbarMain,
  VToolbarSecondary,
  VAvatarProfileImage,
} from "@/components/app";
// ##config ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  app: { DEFAULT_NO_USER_IMAGE_AVAILABLE },
} = useAppConfig();
// ##utils
const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g", <any>{}));
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name);
const qenabled_g = computed(() => !!gid.value);
const vars_g = computed(() => ({ gids: [gid.value] }));

const { calcDisplayName } = useAuthUtils();
const itemTo = (user: any) => ({ name: "tim-uid", params: { uid: user?.id } });

const { assetsUGConfigured } = useTopics();

// ##icons
const iconCheckOn = renderIcon("check-on", {});
const iconCheckOff = renderIcon("check-off", {});
// ##refs ##flags ##models
const mSelectionUsers = ref();
const toggleUGConfigStatus = useToggleFlag();
// ##data ##auth ##state
const { users: users_g, reload: usersQueryReload } = useQueryUsersSearch(
  "g",
  vars_g,
  {
    enabled: qenabled_g,
  }
);
const { group: groupsConfig } = useQueryManageAssetsGroups(
  undefined,
  undefined,
  { enabled: false }
);
// ##computed
const ttl = computed(() => `Ažuriraj članove: ${gname.value}`);
const size_g = computed(() => len(users_g.value));
const uids_selected = computed<number[]>(() =>
  isEmpty(mSelectionUsers.value) ? [] : map(mSelectionUsers.value, toIds)
);
const ugConfigure = computed(() =>
  gid.value && 0 < uids_selected.value.length
    ? {
        [`-${gid.value}`]: uids_selected.value,
      }
    : undefined
);
// const members = computed(() => g.value?.users || []);
// ##forms ##helpers ##handlers
const configure_ug_remove = async () => {
  if (
    !get(await groupsConfig(ugConfigure.value!), "data.groupsGUConfigure.error")
  ) {
    // @success:ug --rm
    toggleUGConfigStatus.on();
  }
};
// ##watch
//  clear users selection @users:change
watch(users_g, () => {
  mSelectionUsers.value = undefined;
});
// ##hooks:lifecycle
// ##head ##meta
useHead({ title: ttl });
// ##provide
// ##io
watchEffect(() =>
  useIOEvent(() => assetsUGConfigured(gid.value), usersQueryReload)
);

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-uredi-clanove">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleUGConfigStatus.isActive.value"
    >
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarMain>
    <VToolbarSecondary
      text="🧑🏻 Članovi"
    >
      <template #title="{ text }">
        <VBadge
          :model-value="0 < size_g"
          :content="size_g"
          inline
          color="primary-darken-2"
        >
          <span class="me-1">{{ text }}</span>
        </VBadge>
      </template>
      <template #actions>
        <VBtn
          :to="{
            name: 'aktiva-grupe-gid-dodaj-clanove',
            params: { gid },
          }"
          icon
          variant="text"
        >
          <Iconx icon="$plus" />
        </VBtn>
        <VBtn
          @click="configure_ug_remove"
          :disabled="isEmpty(ugConfigure)"
          icon
          variant="text"
        >
          <Iconx icon="$minus" />
        </VBtn>
        <VBtn @click="usersQueryReload" icon variant="plain">
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
    </VToolbarSecondary>
    <VDataIteratorListData
      v-model="mSelectionUsers"
      :items="users_g"
      :item-title="calcDisplayName"
      :item-to="itemTo"
      :props-list-item="{ class: '*ps-1 mt-2' }"
      :props-list-item-title="{ class: 'ps-4' }"
    >
      <template #list-item-prepend="{ item: user }">
        <VAvatarProfileImage
          :padding="2"
          :size="54"
          :image="user?.profile?.avatarImage || DEFAULT_NO_USER_IMAGE_AVAILABLE"
        />
      </template>
      <template #list-item-append="{ isSelected, toggleSelect }">
        <VCheckboxBtn
          :model-value="isSelected"
          @click.stop="toggleSelect(node)"
          :false-icon="iconCheckOff"
          :true-icon="iconCheckOn"
          density="comfortable"
          color="primary"
          class="scale-[112%]"
        />
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
