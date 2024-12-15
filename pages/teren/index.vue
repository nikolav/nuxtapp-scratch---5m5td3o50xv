<script setup lang="ts">
// ##imports
import {
  VFabMain,
  VCardDataIterator,
  VCardFormsSubmission,
  VToolbarPrimary,
  VBtnMenuItemPicker,
  VBtnDatePicker,
} from "@/components/app";
import { ssrContextKey } from "vue";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    appClass: "bg-transparent",
    bodyClass: "CLASS--1826dd05-b3c4-51a0-b6b6-3589840fab22",
  },
});

const {
  db: {
    Docs: {
      DocsTags: { SHAREABLE },
    },
  },
} = useAppConfig();

const MENU_items = <any[]>[
  {
    title: "Javni pristup",
    value: "86060d82-a317-5b29-ae53-df6ab62b7542",
    icon: {
      icon: "world",
      size: "1.33rem",
      class: "text-primary opacity-30 -rotate-3",
    },
    handle: async (selection: any) =>
      await handleReportsConfig({ tags: { [SHAREABLE]: true } }, selection),
    props: {},
  },
  {
    title: "Blokiraj javni pristup",
    value: "1660bf16-aa8f-52c5-9dbd-d37652eabfb1",
    icon: {
      emoji: "⛔",
      // icon: "$minus",
      size: "1.22rem",
      class: "text-error opacity-50",
    },
    handle: async (selection: any) =>
      await handleReportsConfig({ tags: { [SHAREABLE]: false } }, selection),
    props: {},
  },
  {
    type: "divider",
    value: "8ee5fe7d-53e3-5d64-b22f-7e368530b08a",
  },
  {
    title: "Obriši izveštaje",
    value: "f4a3073f-d961-58eb-9f31-b3be81c7a4ac",
    icon: {
      icon: "trash",
      size: "1.22rem",
      class: "text-error opacity-50",
    },
    handle: async (selection: any) => {
      try {
        ps.begin();
        const ids = map(selection, toIds);
        if (isEmpty(ids)) throw "reports:manage:no-reports";
        if (get(await reportsDrop(...ids), "data.reportsDrop.error"))
          throw "reports:manage:drop-failed";
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value)
        ps.successful(() => {
          signalIdDeselect();
          nextTick(reload);
        });
    },
    props: {
      class: "mt-1",
    },
  },
];
// ##schemas
// ##utils
const { calcDisplayName } = useAuthUtils();
const ps = useProcessMonitor();
const signalIdDeselect = useUniqueId();
// reset @filters:advanced
const signalIdFilterReset = useUniqueId();
// ##icons
// ##refs ##flags ##models
const dfrom = ref();
const dto = ref();
const datetimeFilterStrategy = ref();
const datetimeFilterArgs = ref();
const DATETIME_FILTERS_no_range = [
  {
    strategy: "today",
    title: "Danas",
  },
  {
    strategy: "_default",
    title: "Ova nedelja",
  },
  {
    strategy: "previous-week",
    title: "Prošla nedelja",
  },
  {
    strategy: "month",
    title: "Ovaj mesec",
  },
  // {
  //   strategy: "date-range",
  //   title: {
  //     from: "Od",
  //     to: "Do",
  //   },
  // },
];
// filtered reports
const submissions$$ = ref();
// group names to apply to submissions
const filterUserGroups = ref();
// filter uids
const filterUidsOnly = ref();
const toggleActiveSearchAdvanced = useToggleFlag();
// ##data ##auth ##state
const { drop: reportsDrop, configure: reportsConfigure } =
  useQueryReportsManage();
const { submissions, reload } = useQueryAssetsFormsSubmissionsSearch(
  () => first(datetimeFilterStrategy.value),
  datetimeFilterArgs
);
// ##computed
// calc union(@users) @submissions$$
const usersFeature = computed(() =>
  isEmpty(submissions.value)
    ? undefined
    : uniqBy(map(submissions.value, "user"), "id")
);
const groupsFeature = computed(() =>
  union(...map(usersFeature.value, "groups"))
);
// ##forms ##handlers ##helpers ##small-utils
// const submissionsFilterClearAll = () => {
//   submissions$$.value = submissions.value;
// };
const handleReportsConfig = async (config: any, selection: any) => {
  try {
    ps.begin();
    const ids = map(selection, toIds);
    if (isEmpty(ids)) throw "reports:config:empty";
    if (
      get(
        await reportsConfigure(config, ...ids),
        "data.reportsConfigurationTags.error"
      )
    )
      throw "reports:config:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      signalIdDeselect();
      nextTick(reload);
    });
};
const itemGroups = (r: any) => [startCase(get(r, "asset.name"))];

const filterSubmissionsUserGroups = (dd: any, ug: any) =>
  filter(dd, (dr: any) => some(dr.user.groups, (g: string) => includes(ug, g)));
const filterSubmissionsUidsOnly = (dd: any, uids: any) =>
  filter(dd, (dr: any) => includes(uids, toIds(dr.user)));
// ##watch
// track last filter @reports to apply at new docs
const lastFilterApllied = ref<any>();
watch(signalIdFilterReset.ID, () => {
  lastFilterApllied.value = undefined;
});

watch(filterUserGroups, (ug) => {
  if (isEmpty(submissions.value)) return;
  if (isEmpty(ug)) return;
  submissions$$.value = filterSubmissionsUserGroups(submissions.value, ug);
  lastFilterApllied.value = { filter: filterSubmissionsUserGroups, arg: ug };
});
watch(filterUidsOnly, (uids) => {
  if (isEmpty(submissions.value)) return;
  if (isEmpty(uids)) return;
  submissions$$.value = filterSubmissionsUidsOnly(submissions.value, uids);
  lastFilterApllied.value = { filter: filterSubmissionsUidsOnly, arg: uids };
});
watch(submissions, (ss) => {
  const filter_ = lastFilterApllied.value;
  submissions$$.value = filter_
    ? filter_.filter(ss, filter_.arg)
    : submissions.value;
});

watch([dfrom, dto], ([dfrom, dto]) => {
  if (!dfrom || !dto) return;
  if (!dto.isAfter(dfrom)) return;
  datetimeFilterStrategy.value = ["date-range"];
  datetimeFilterArgs.value = [
    dfrom.local().add(-1, "d").endOf("d").unix(),
    dto.local().add(1, "d").startOf("d").unix(),
  ];
});
// ##hooks ##lifecycle
useOnceMountedOn(
  // load reppors @no-empty @mounted
  submissions,
  () => {
    submissions$$.value = submissions.value;
  }
);
// ##head ##meta
useHead({ title: "📝 Izveštaji" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren">
    <VCardDataIterator
      :item-groups="itemGroups"
      item-title="key"
      :items="submissions$$"
      :per-page="-1"
      :reload="reload"
      hide-pagination
      :signal-id-deselect="signalIdDeselect.ID.value"
      :props-list="{ class: 'py-0 bg-transparent' }"
      :props-dots-menu-icon="{ size: '1.5rem' }"
      @toolbar-secondary-closed="toggleActiveSearchAdvanced.off"
    >
      <template #prepend>
        <VToolbarPrimary
          v-if="toggleActiveSearchAdvanced.isActive.value"
          color="primary-lighten-2"
        >
          <template #append>
            <VBtn
              @click="signalIdFilterReset"
              icon
              size="small"
              variant="plain"
            >
              <Iconx size=".95rem" icon="filter-off" />
            </VBtn>
          </template>
          <VToolbarItems class="*bg-red grow justify-end pe-2">
            <VSpacer />
            <span
              class="d-inline-flex items-center gap-px me-1 -translate-y-px"
            >
              <VBtnDatePicker
                v-model="dfrom"
                default-no-value="📅 Od..."
                :format-display-date="(d) => d.local().format('D/M/YY')"
                :props-btn="{
                  block: false,
                  height: undefined,
                  size: 'small',
                  class: '!text-sm pa-2',
                  color: 'on-surface',
                }"
                :props-menu="{
                  location: 'bottom center',
                }"
                :props-icon-expand="{ class: 'd-none' }"
              />
              <VBtnDatePicker
                v-model="dto"
                default-no-value="Do... 📅"
                :format-display-date="(d) => d.local().format('D/M/YY')"
                :props-btn="{
                  block: false,
                  height: undefined,
                  size: 'small',
                  class: '!text-sm px-2 pa-2',
                  color: 'on-surface',
                }"
                :props-menu="{
                  location: 'bottom center',
                }"
                :props-icon-expand="{ class: 'd-none' }"
              />
            </span>
            <!-- records timeset picker  -->
            <VBtnMenuItemPicker
              v-model="datetimeFilterStrategy"
              :items="DATETIME_FILTERS_no_range"
              :item-value="(node) => node.strategy"
              :item-title="(node) => node.title"
              icon
              density="default"
              variant="plain"
              :signal-id-selection-reset="signalIdFilterReset.ID.value"
              :reset-strategy="() => ['_default']"
            >
              <Iconx icon="$calendar" size="1.33rem" />
            </VBtnMenuItemPicker>

            <!-- users picker  -->
            <VBtnMenuItemPicker
              v-model="filterUidsOnly"
              :items="usersFeature"
              :item-value="toIds"
              :item-title="calcDisplayName"
              icon
              density="default"
              variant="plain"
              reset-strategy="all"
              :signal-id-selection-reset="signalIdFilterReset.ID.value"
            >
              <Iconx icon="user" size="1.22rem" />
            </VBtnMenuItemPicker>
            <!-- user groups picker  -->
            <VBtnMenuItemPicker
              v-model="filterUserGroups"
              :items="groupsFeature"
              :item-title="startCase"
              icon
              density="default"
              variant="plain"
              reset-strategy="all"
              :signal-id-selection-reset="signalIdFilterReset.ID.value"
            >
              <Iconx icon="folder-user" size="1.5rem" />
            </VBtnMenuItemPicker>
          </VToolbarItems>
        </VToolbarPrimary>
        <VToolbarPrimary
          flat
          text="Predati izveštaji"
          hide-default-close
          :props-title="{ class: 'text-body-2 text-start font-italic' }"
        />
      </template>
      <template #toolbar-secondary-actions>
        <VBtn
          @click="toggleActiveSearchAdvanced"
          icon
          density="comfortable"
          variant="plain"
          class="me-1"
        >
          <Iconx size="1.22rem" icon="lightning" />
        </VBtn>
      </template>
      <template #menu="{ selection }">
        <VList class="VList--4PflZkOzfb65oIwWbz py-0">
          <template v-for="item in MENU_items" :key="item.value">
            <VDivider
              v-if="'divider' == item?.type"
              class="border-opacity-100"
              v-bind="item.props"
            />
            <VListItem
              v-else
              link
              @click="item.handle(selection)"
              v-bind="item.props"
            >
              <template #prepend>
                <span v-if="item.icon?.emoji" v-bind="item.icon">{{
                  item.icon.emoji
                }}</span>
                <Iconx v-else v-bind="item.icon" />
              </template>
              <span>{{ item.title }}</span>
            </VListItem>
          </template>
        </VList>
      </template>
      <template #list-item="{ node, i, select, isSelected }">
        <VCardFormsSubmission
          rounded
          :submission="node.raw"
          :i="i"
          :select="(flag = true) => select([node], flag)"
          :isSelected="() => isSelected([node])"
          class="ma-2"
        />
      </template>
    </VCardDataIterator>
    <VFabMain :to="{ name: 'teren-izvestaji' }">
      <template #icon>
        <Iconx size="1.52rem" icon="$edit" />
      </template>
    </VFabMain>
    <VSpacer class="mt-32" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.VList--4PflZkOzfb65oIwWbz .v-list-item__prepend .v-list-item__spacer {
  width: 1.22rem !important;
}
</style>
