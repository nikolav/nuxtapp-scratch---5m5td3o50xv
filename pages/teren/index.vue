<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import {
  VFabMain,
  VCardDataIterator,
  VCardFormsSubmission,
} from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
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
      class: "text-success-darken-1 opacity-75",
    },
    handle: async (selection: any) =>
      await handleReportsConfig({ tags: { [SHAREABLE]: true } }, selection),
    props: {},
  },
  {
    title: "Blokiraj javni pristup",
    value: "1660bf16-aa8f-52c5-9dbd-d37652eabfb1",
    icon: {
      icon: "$minus",
      size: "1.33rem",
      class: "text-error opacity-75",
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
      size: "1.122rem",
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
    props: {},
  },
];
// ##schemas
// ##utils
const ps = useProcessMonitor();
const signalIdDeselect = useUniqueId();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const { drop: reportsDrop, configure: reportsConfigure } =
  useQueryReportsManage();
const { submissions, reload } = useQueryAssetsFormsSubmissionsSearch();
// ##computed
// ##forms ##handlers ##helpers ##small-utils
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

// ##watch
// ##hooks ##lifecycle
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
      :items="submissions"
      :per-page="-1"
      :reload="reload"
      hide-pagination
      :props-list="{ class: 'py-0' }"
      :signal-id-deselect="signalIdDeselect.ID.value"
    >
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
                <Iconx v-bind="item.icon" />
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
    <VFabMain :to="{ name: 'teren-izvestaji' }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.VList--4PflZkOzfb65oIwWbz .v-list-item__prepend .v-list-item__spacer {
  width: 1.22rem !important;
}
</style>
