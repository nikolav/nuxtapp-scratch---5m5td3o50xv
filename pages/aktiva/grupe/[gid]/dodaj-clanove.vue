<script setup lang="ts">
// ##imports
import { renderIcon } from "@/components/icons";
import { useDisplay } from "vuetify";
import { z } from "zod";
import type { OrNoValue, RecordJson } from "@/types";
import {
  VDataIteratorListData,
  VFabMain,
  VSnackbarMain,
  VAvatarProfileImage,
} from "@/components/app";

// ##config:const
const DEFAULT_q_limit = 10;
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { SEARCH_DEBOUNCE_DELAY_longer, DEFAULT_NO_USER_IMAGE_AVAILABLE },
} = useAppConfig();
// ##schemas
const schemaSearchNotEmpty = z.object({
  search: z.string().min(1),
});
// ##utils
const { smAndUp } = useDisplay();
const attrs = useAttrs();
const g = computed(() => get(attrs, "route-data.g"));
const gid = computed(() => g.value?.id);

const { calcDisplayName } = useAuthUtils();

// ##icons
const iconCheckOn = renderIcon("check-on", {});
const iconCheckOff = renderIcon("check-off", {});
// ##refs ##flags ##models
const mUsersSelected = ref();
const q = ref("");
const vars_q = computed(() => ({ q: q.value, limit: DEFAULT_q_limit }));
const enabled_q = computed(() => !!q.value);
// const enabled_g = computed(() => !!gid.value);
const toggleUGConfigStatus = useToggleFlag();
// ##data ##auth ##state
//   group({'+22': [1, 2], '-3': [5], '+3': [45]})
const { group: groupsConfig } = useQueryManageAssetsGroups(
  undefined,
  undefined,
  { enabled: false }
);
const { users: users_q } = useQueryUsersSearch("q", vars_q, {
  enabled: enabled_q,
});
// ##computed
const uidsSelected = computed(() =>
  isEmpty(mUsersSelected.value) ? [] : map(mUsersSelected.value, toIds)
);
const gConfiguration = computed<OrNoValue<RecordJson>>(() =>
  gid.value && 0 < uidsSelected.value.length
    ? {
        [`+${gid.value}`]: uidsSelected.value,
      }
    : undefined
);
// ##forms ##handlers ##helpers
const form = useFormModel(
  "f0e525c8-dc85-5fad-9ed2-942d9b345d69",
  {
    search: {},
  },
  {
    schema: schemaSearchNotEmpty,
    model: { search: "" },
    onSubmit: (d: any) => {
      q.value = get(d, "search", "");
    },
  }
);
const itemTo = (user: any) => ({ name: "tim-uid", params: { uid: user?.id } });
const configure_g = async () => {
  if (
    !get(
      await groupsConfig(gConfiguration.value!),
      "data.groupsGUConfigure.error"
    )
  ) {
    // @success:ug
    toggleUGConfigStatus.on();
  }
};
// ##watch
watch(
  () => form.data.search.value,
  debounce(form.submit, SEARCH_DEBOUNCE_DELAY_longer)
);
//  clear model @selected-users:change
watch(users_q, () => {
  mUsersSelected.value = undefined;
});
// ##hooks ##lifecycle
//   load if !empty form; @navigate-page:back
onMounted(form.submit);
// ##head ##meta
useHead({ title: "Dodaj članove" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-dodaj-clanove">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleUGConfigStatus.isActive.value"
    >
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarMain>
    <div class="__spacer mt-2 px-5">
      <VForm @submit.prevent="form.submit">
        <VTextField
          v-model="form.data.search.value"
          variant="underlined"
          placeholder="Traži korisnike..."
          clearable
          autofocus
        >
          <template #append-inner>
            <Iconx size="1.22rem" icon="link" class="mt-1 opacity-20" />
          </template>
          <template #prepend-inner>
            <Iconx
              size="1.22rem"
              class="opacity-20 translate-y-px me-1"
              icon="search"
            />
          </template>
        </VTextField>
      </VForm>
    </div>
    <VDataIteratorListData
      v-model="mUsersSelected"
      :items="users_q"
      :item-title="calcDisplayName"
      :item-to="itemTo"
      :props-list="{ class: '*py-0' }"
      :props-list-item="{ class: '*ps-1 mt-2' }"
      :props-list-item-title="{ class: 'ps-4' }"
      :disabled-skeleton-loader="!enabled_q"
    >
      <template #list-item-prepend="{ item: user }">
        <VAvatarProfileImage
          :padding="2"
          :size="51"
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

    <VFabMain
      v-if="!isEmpty(gConfiguration)"
      :class="[smAndUp ? '-translate-x-12' : '-translate-y-8 translate-x-2']"
      @click="configure_g"
    >
      <template #icon>
        <Iconx size="1.5rem" icon="link" />
      </template>
    </VFabMain>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.page--aktiva-grupe-gid-dodaj-clanove .v-field__input {
  @include placeholder-with-prefix {
    font-style: italic;
    font-size: 0.95rem;
    opacity: 0.33;
  }
}
</style>
