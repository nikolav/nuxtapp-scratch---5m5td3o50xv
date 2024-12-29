<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  ProvideAssetsChildren,
  VChipAssetAvatar,
  VChipUserAvatar,
  VBtnTopicChatToggle,
  VBadgeSelectedOfTotal,
} from "@/components/app";
import { Redirect } from "@/components/utils";
import { _tasks } from "process";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "default",
  // middleware: "",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const route = useRoute();
const tkey = computed(() => route.query?.q);
const enabled = computed(() => !!tkey.value);

const {
  db: {
    Assets: {
      type: { DIGITAL_TASKS, PEOPLE_GROUP_TEAM },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const ps = useProcessMonitor();
const { topicWithTitle } = useGlobalVariableChatActive();
const { chatAssets, assetsUpdated } = useTopics();
const { isShareable } = useTasksUtils();
// ##icons
// ##refs ##flags ##models
const isBlocked$ = ref();
// ##data ##auth ##state
const auth = useStoreApiAuth();
const search = computed(() => ({
  strategy: "one_by_key",
  args: { key: tkey.value },
}));
const { assets, assetsPatchData, reload, processing } = useQueryManageAssets(
  DIGITAL_TASKS,
  undefined,
  false,
  { enabled },
  {
    search,
  }
);
// ##computed
const task = computed(() => first(assets.value));
const subtasks = computed(() => get(task.value, "data.tasks", []));
const hasSubtasks = computed(() => !isEmpty(subtasks.value));
const topicTaskChat = computed(() =>
  task.value?.key
    ? topicWithTitle(chatAssets(task.value.key), task.value?.name)
    : ""
);
const sizeSubtasks = computed(() => len(subtasks.value) || 0);
const totSubtasksCompleted = computed(
  () => len(filter(subtasks.value, "complete")) || 0
);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
useOnceMountedOn(task, () => {
  if (!auth.isAuthenticated$) {
    if (!isShareable(task.value)) {
      isBlocked$.value = true;
    }
  }
});
const toggleSubtaskCompleted = async (t: any) => {
  if (!hasSubtasks.value) return;
  const tasks = map(subtasks.value, (st: any) =>
    t.key == st.key ? { ...st, complete: !st.complete } : st
  );
  try {
    ps.begin();
    if (
      get(
        await assetsPatchData(toIds(task.value), { tasks }),
        "data.assetsPatchData.error"
      )
    )
      throw "@error:subtask-toggle:Tigmgp03xf0JHOJA4Sk";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful();
  console.log("@debug:subtask-toggle", ps.error.value);
};

// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✅ Zadaci" });
// ##provide
// ##io
watchEffect(() => useIOEvent(() => assetsUpdated(toIds(task.value)), reload));

// @@eos
</script>
<template>
  <section class="page--deli-zadaci">
    <Redirect :to="{ name: 'index' }" v-if="isBlocked$" />
    <template v-else>
      <VToolbarPrimary
        hide-default-close
        :text="task?.name"
        :props-title="{ class: 'text-body-1 text-start ps-0 ms-0 ps-3' }"
        class="CLASS--bd8e07aa-6a10-50ea-aa15-05b7278bd1cb"
      >
        <template #actions>
          <VBtnTopicChatToggle :topic="topicTaskChat" />
        </template>
        <template #title="{ text }">
          <span class="d-flex items-baseline gap-2">
            <small class="opacity-40 text-xs">#{{ task?.id }}</small>
            <span>{{ text }}</span>
          </span>
        </template>
        <template #prepend>
          <Iconx icon="task-alt" size="1.33rem" class="opacity-20 mx-1" />
        </template>
      </VToolbarPrimary>
      <VSpacer class="mt-3" />
      <div class="__spacer ps-2">
        <VChipUserAvatar
          size="large"
          :props-avatar="{ size: 33 }"
          :user="task?.author"
          class="ps-1 ms-0"
        />
      </div>
      <div class="__spacer pa-2 d-inline-flex items-center gap-1 flex-wrap">
        <ProvideAssetsChildren
          :asset="task"
          :type="PEOPLE_GROUP_TEAM"
          v-slot="{ assets: groups }"
        >
          <VChipAssetAvatar
            v-for="g in groups"
            :key="g?.key"
            :asset="g"
            :item-to="{ name: 'aktiva-grupe-gid', params: { gid: toIds(g) } }"
          />
        </ProvideAssetsChildren>
      </div>
      <VSpacer class="mt-5" />
      <VCard flat elevation="0" rounded="0">
        <VCardText>
          <VTextField
            :model-value="task?.name"
            label="Naziv"
            variant="underlined"
            readonly
          >
            <template #prepend-inner>
              <Iconx icon="tag" size="1.22rem" class="opacity-20" />
            </template>
          </VTextField>
          <VTextarea
            v-if="task?.notes"
            :model-value="task.notes"
            rows="4"
            label="Opis"
            variant="underlined"
            readonly
          >
            <template #prepend-inner>
              <Iconx icon="$edit" size="1.22rem" class="opacity-20" />
            </template>
          </VTextarea>
        </VCardText>
      </VCard>
      <template v-if="hasSubtasks">
        <VSpacer class="*mt-3" />
        <VCard :disabled="processing" rounded="lg" class="mx-2">
          <VCardItem class="bg-slate-400/10">
            <VCardTitle class="opacity-50 text-body-1">Zadaci:</VCardTitle>
            <template #append>
              <VBadgeSelectedOfTotal
                :model-value="totSubtasksCompleted"
                :length="sizeSubtasks"
                color="success-darken-1"
              />
            </template>
          </VCardItem>
          <VList class="CLASS--VList-item-spacer-none">
            <VListItem
              link
              v-for="t in subtasks"
              :key="t.key"
              @click="toggleSubtaskCompleted(t)"
              class="ps-3"
            >
              <template v-if="!t.complete" #append>
                <Iconx
                  icon="task-alt"
                  size="1.92rem"
                  class="text-success-darken-1"
                />
              </template>
              <template v-if="t.complete" #prepend>
                <Iconx icon="$complete" class="text-success-darken-2" />
              </template>
              <VListItemTitle
                class="ps-3"
                :class="[t.complete ? 'line-through' : '']"
                >{{ t.title }}</VListItemTitle
              >
            </VListItem>
          </VList>
        </VCard>
      </template>
      <VSpacer class="mt-20" />
      <p class="text-center opacity-20 text-xl">•</p>
      <VCard flat elevation="0" rounded="0">
        <VCardText>
          <VTextField
            :model-value="task?.key"
            label="Ključ"
            variant="underlined"
            readonly
            disabled
          >
            <template #prepend-inner>
              <Iconx icon="hashtag" size="1rem" class="opacity-20" />
            </template>
          </VTextField>
        </VCardText>
      </VCard>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.CLASS--bd8e07aa-6a10-50ea-aa15-05b7278bd1cb {
  .v-toolbar__append {
    margin-inline-end: 0;
  }
}
</style>
