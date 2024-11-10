<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VDataIteratorListData,
  VSnackbarSuccess,
} from "@/components/app";
// ##config ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
// ##utils
const attrs = useAttrs();
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name);
const qenabled_g = computed(() => !!gid.value);
const vars_g = computed(() => ({ gids: [gid.value] }));

const { calcDisplayName } = useAuthUtils();
const itemTo = (user: any) => ({ name: "tim-uid", params: { uid: user?.id } });
const toId = (node: any) => Number(node.id);

const { assetsUGConfigured } = useTopics();

// ##icons
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
  () => [gid.value],
  undefined,
  { enabled: qenabled_g }
);
// ##computed
const ttl = computed(() => `Ažuriraj članove: ${gname.value}`);
const size_g = computed(() => len(users_g.value));
const uids_selected = computed<number[]>(() =>
  isEmpty(mSelectionUsers.value) ? [] : map(mSelectionUsers.value, toId)
);
const ugConfigure = computed(() =>
  gid.value && 0 < uids_selected.value.length
    ? {
        [`-${gid.value}`]: uids_selected.value,
      }
    : undefined
);
// const members = computed(() => g.value?.users || []);
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid",
  params: { gid: gid.value },
}));
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
const ioevent_ug = computed(() => assetsUGConfigured(gid.value));
watchEffect(() => useIOEvent(ioevent_ug.value, usersQueryReload));

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-uredi-clanove">
    <VSnackbarSuccess v-model="toggleUGConfigStatus.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>
    <div class="__spacer pt-1 px-2">
      <VToolbarPrimary
        text="Članovi"
        :route-back-to="routeBackTo"
        rounded="pill"
        color="primary-lighten-1"
        :divider-start="false"
        :props-title="{ class: 'text-body-1 text-start ms-2' }"
      >
        <template #title="{ text }">
          <span class="d-flex items-center gap-1">
            <span>{{ text }}</span>
            <VBadge
              inline
              color="primary-darken-2"
              v-if="size_g"
              :content="size_g"
            />
          </span>
        </template>
        <template #prepend>
          <VBtn
            :to="routeBackTo"
            size="small"
            density="comfortable"
            icon
            variant="plain"
          >
            <Iconx icon="$prev" size="large" />
          </VBtn>
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
            <VTooltip text="Dodaj članove u grupu" />
          </VBtn>
          <VBtn
            @click="configure_ug_remove"
            :disabled="isEmpty(ugConfigure)"
            icon
            variant="text"
          >
            <Iconx icon="$minus" />
            <VTooltip text="Izbaci iz grupe" />
          </VBtn>
          <VBtn
            @click="usersQueryReload"
            icon
            density="comfortable"
            variant="plain"
            size="small"
            class="ms-1"
          >
            <Iconx icon="$loading" />
          </VBtn>
        </template>
      </VToolbarPrimary>
    </div>
    <VDataIteratorListData
      v-model="mSelectionUsers"
      :items="users_g"
      :item-title="calcDisplayName"
      :item-to="itemTo"
      :props-list-item="{ class: '*ps-1' }"
      :props-list-item-title="{ class: 'ps-4' }"
    />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
