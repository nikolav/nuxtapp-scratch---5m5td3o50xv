<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VToolbarPrimary,
  VToolbarSecondary,
  VEmptyStateNoData,
  VDataIteratorListData,
  VChipUserAvatar,
  VBadgeSelectedOfTotal,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const {
  app: { ROUTE_NAME_REDIRECT_AUTHENTICATED },
  db: {
    Assets: {
      type: { DIGITAL_TASKS },
      AssetsStatus,
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const ps = useProcessMonitor();
const { SHAREABLE, isShareable, isStatusDone } = useTasksUtils();
const { smAndUp } = useDisplay();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
const signalIdDeselect = useUniqueId();
const mTasksSelection = ref();
const mSetSelectionNone = signalIdDeselect;
// ##data ##auth ##state
const {
  assets: tasks,
  reload,
  tags,
  commit,
  remove,
} = useQueryManageAssets(DIGITAL_TASKS, undefined, undefined, undefined, {
  ordered: "date_desc",
});
// ##computed
const sizeTasksCompleted = computed(() =>
  len(filter(tasks.value, isStatusDone))
);
const someSelected = computed(() => !isEmpty(mTasksSelection.value));
const sizeZadaci = computed(() => len(tasks.value) || 0);
// ##forms ##handlers ##helpers ##small-utils
const itemTo = (task: any) => ({
  name: "deli-zadaci",
  query: { q: task?.key },
});
const itemTitle = (t: any) => t?.name;
const onManageTaskFields = async (fields: any) => {
  if (isEmpty(mTasksSelection.value)) return;
  if (isEmpty(fields)) return;
  try {
    ps.begin();
    if (
      some(
        await Promise.all(
          map(
            mTasksSelection.value,
            async (t: any) => await commit(fields, toIds(t))
          )
        ),
        (res: any) => get(res, "data.assetsUpsert.error")
      )
    )
      throw "@error:tasks-fields:LXMMuUaekbwN";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      // @success:tasks:updated
      mSetSelectionNone();
      reload();
    });
  console.log("@debug:tasks-updated", ps.error.value);
};
const onManageTaskTags = async (config: any) => {
  if (isEmpty(mTasksSelection.value)) return;
  if (isEmpty(config)) return;
  try {
    if (
      some(
        await Promise.all(
          map(
            mTasksSelection.value,
            async (task: any) => await tags(toIds(task), config)
          )
        ),
        (r: any) => get(r, "data.assetsManageTags.error")
      )
    )
      throw "@error:tasks-tags:45KE6ek";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      mSetSelectionNone();
      reload();
    });
  console.log("@debug:tasks-tags", ps.error.value);
};
const onDeleteTasks = async () => {
  if (isEmpty(mTasksSelection.value)) return;
  try {
    ps.begin();
    if (
      get(
        await remove(map(mTasksSelection.value, toIds)),
        "data.assetsRemove.error"
      )
    )
      throw "@error:tasks-rm:WyGmSR8PnNaw4V";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      // @success:rm
      mSetSelectionNone();
      reload();
    });
  console.log("@debug:tasks-rm", ps.error.value);
};
// ##watch
watch(tasks, (tasks) => {
  if (isEmpty(tasks)) {
    mTasksSelection.value = undefined;
  }
});
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✅ Zadaci" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--zadaci">
    <VToolbarPrimary
      text="Zadaci"
      :props-title="{ class: 'text-body-1 text-start font-italic' }"
      :route-back-name="ROUTE_NAME_REDIRECT_AUTHENTICATED"
    >
      <template #title="{ text }">
        <span class="d-inline-flex items-center justify-start gap-3">
          <span>{{ text }}</span>
          <VBadgeSelectedOfTotal
            v-if="0 < sizeZadaci"
            inline
            :model-value="sizeTasksCompleted"
            :length="sizeZadaci"
            color="primary-darken-3"
          />
        </span>
      </template>
      <template #prepend>
        <Iconx icon="task-alt" size="1.22rem" class="opacity-20 mx-1" />
      </template>
    </VToolbarPrimary>
    <VToolbarSecondary>
      <template #actions>
        <VBtn
          :to="{ name: 'zadaci-nov' }"
          color="primary-darken-1"
          icon
          variant="text"
        >
          <Iconx icon="$plus" size="1.44rem" />
        </VBtn>
        <VBtn
          @click="
            () => onManageTaskFields.call(null, { status: AssetsStatus.DONE })
          "
          icon
          :disabled="!someSelected"
          color="success-darken-1"
        >
          <Iconx icon="task-alt" size="1.5rem" />
        </VBtn>
        <VBtn
          @click="() => onManageTaskFields.call(null, { status: null })"
          icon
          :disabled="!someSelected"
          color="warning"
        >
          <span class="text-sm">⏳</span>
        </VBtn>
        <VBtn
          @click="() => onManageTaskTags.call(null, { [SHAREABLE]: true })"
          icon
          :disabled="!someSelected"
        >
          <span>🌐</span>
        </VBtn>
        <VBtn
          @click="() => onManageTaskTags.call(null, { [SHAREABLE]: false })"
          icon
          :disabled="!someSelected"
        >
          <span>⛔</span>
        </VBtn>
        <VBtn
          @click="onDeleteTasks"
          color="error"
          icon
          :disabled="!someSelected"
        >
          <Iconx icon="trash" size="1.122rem" />
        </VBtn>
        <VBtn
          color="primary-darken-1"
          @click="reload"
          icon
          variant="plain"
          density="comfortable"
        >
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
    </VToolbarSecondary>
    <VEmptyStateNoData v-if="isEmpty(tasks)" class="opacity-40" />
    <VDataIteratorListData
      v-else
      v-model="mTasksSelection"
      :items="tasks"
      :item-to="itemTo"
      disabled-skeleton-loader
      :props-list="{ class: 'CLASS--VList-item-spacer-none' }"
      :props-list-item-title="{ class: 'ms-0 ps-1' }"
      :props-list-item="{ class: 'ps-1 mx-0' }"
      :props-selection-check="{ class: '!mx-0 !px-0', density: 'compact' }"
      :signal-id-deselect="signalIdDeselect.ID.value"
    >
      <template #list-item-title="{ item: task }">
        <Iconx
          v-if="isStatusDone(task)"
          icon="$complete"
          size="1.22rem"
          class="-translate-y-[2px] text-success-darken-2 me-1"
        />
        <VBadge color="transparent" inline :model-value="isShareable(task)">
          <template #badge>
            <Iconx
              size="1rem"
              icon="world"
              class="text-info opacity-40 -rotate-3"
            />
          </template>
          <span
            :class="[
              isStatusDone(task)
                ? 'CLASS--c2e51ca3-39bf-51f3-96c9-336ff366f7eb'
                : '',
            ]"
            >{{ itemTitle(task) }}</span
          >
        </VBadge>
      </template>
      <template #list-item-append="{ item: task }">
        <VChipUserAvatar
          :props-avatar="{ size: 31 }"
          :user="get(task, 'author')"
          class="ps-0"
          :class="[smAndUp ? '' : '!max-w-[133px]']"
        />
      </template>
    </VDataIteratorListData>
  </section>
</template>
<style lang="scss" scoped>
.CLASS--c2e51ca3-39bf-51f3-96c9-336ff366f7eb {
  text-decoration: line-through;
}
</style>
<style module></style>
<style lang="scss"></style>
