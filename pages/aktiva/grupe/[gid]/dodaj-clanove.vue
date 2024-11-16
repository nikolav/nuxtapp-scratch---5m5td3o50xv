<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import { z } from "zod";
import type { OrNoValue, RecordJson } from "@/types";
import {
  VToolbarPrimary,
  VDataIteratorListData,
  VFabMain,
  VSnackbarSuccess,
} from "@/components/app";
import { Dump } from "@/components/dev";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
} = useAppConfig();
// ##schemas
const schemaSearchNotEmpty = z.object({
  search: z.string().min(1),
});
// ##utils
const { smAndUp } = useDisplay();
const attrs = useAttrs();
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => g.value?.id);
// const gname = computed(() => g.value?.name);

const { calcDisplayName } = useAuthUtils();
const toId = (node: any) => (null != node ? Number(node.id) : undefined);

// ##icons
// ##refs ##flags ##models
const mUsersSelected = ref();
const q = ref("");
const vars_q = computed(() => ({ q: q.value, limit: 10 }));
const enabled_q = computed(() => !!q.value);
const enabled_g = computed(() => !!gid.value);
const toggleUGConfigStatus = useToggleFlag();
// ##data ##auth ##state
//   group({'+22': [1, 2], '-3': [5], '+3': [45]})
const { group: groupsConfig } = useQueryManageAssetsGroups(
  () => [gid.value],
  undefined,
  { enabled: enabled_g }
);
const { users: users_q } = useQueryUsersSearch("q", vars_q, {
  enabled: enabled_q,
});
// ##computed
const routeBackTo = computed(() => ({
  name: "aktiva-grupe-gid-uredi-clanove",
  params: { gid: gid.value },
}));
const uidsSelected = computed(() =>
  isEmpty(mUsersSelected.value) ? [] : map(mUsersSelected.value, toId)
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
    model: { search: "" },
    schema: schemaSearchNotEmpty,
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
    <VSnackbarSuccess v-model="toggleUGConfigStatus.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>
    <div class="__spacer pt-1 px-2">
      <VToolbarPrimary
        :route-back-to="routeBackTo"
        rounded="pill"
        color="primary-lighten-1"
        :divider-start="false"
        :props-title="{ class: 'text-body-2 text-start ms-2' }"
        floating
      >
        <template #default>
          <VForm @submit.prevent="form.submit" autocomplete="off" class="grow">
            <VTextField
              v-model.trim="form.data.search.value"
              density="compact"
              rounded="pill"
              variant="underlined"
              placeholder="Traži..."
              hide-details
              single-line
              clearable
              autofocus
              class="ma-0 pa-0 pb-2 px-2 text-body-2"
            >
              <template #prepend-inner>
                <Iconx
                  size="1.22rem"
                  class="opacity-20 translate-y-px me-1"
                  icon="search"
                />
              </template>
            </VTextField>
          </VForm>
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
      </VToolbarPrimary>
      <VDataIteratorListData
        v-model="mUsersSelected"
        :items="users_q"
        :item-title="calcDisplayName"
        :item-to="itemTo"
        :props-list="{ density: 'compact', class: '*py-0' }"
        :props-list-item="{ class: '*ps-1' }"
        :props-list-item-title="{ class: 'ps-4' }"
        :disabled-skeleton-loader="!enabled_q"
      />
    </div>
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
