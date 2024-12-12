<script setup lang="ts">
// ##imports
import {
  VFabMain,
  VCardDataIterator,
  VCardPost,
  VBtnTriggerVisible,
} from "@/components/app";
import { renderIcon } from "@/components/icons";

// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  scrollToTop: false,
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    appBarTitle: "Postovi",
  },
});
// ##schemas
// ##utils
const uid = inject(key_UID);
// ##icons
const iconCheckOn = renderIcon("check-on");
const iconCheckOff = renderIcon("check-off");
// ##refs ##flags ##models
const toggleBtnVisibleActive = useToggleFlag();
// ##data ##auth ##state

const onlyMyPosts = useGlobalVariable(
  "posts:my-only:854f930b-f2c2-5e86-ad20-6c87c3ac22a6"
);

// select post dates to load:more
const otd$ = ref();
const page = 1;
const per_page = 3;
// load first page
const client = useQueryAssetsPostsReadable({ page, per_page });
// load more posts older than last post
const clientMorePosts_ = useQueryAssetsPostsReadable(
  undefined,
  () => ({
    strategy: "older_than",
    args: {
      older_than: otd$.value,
    },
    limit: per_page,
  }),
  () => !!otd$.value
);
const { watchProcessing } = useStoreAppProcessing();
watchProcessing(() => client.loading.value);

const asset_keys_ignore = useGlobalVariable(
  "asset_keys_ignore:b47a4912-dd6c-5e7f-8451-be54fc2be6d3",
  <any>{}
);
const posts = ref();
const postsMore = ref();
const postsFiltered = computed(() =>
  onlyMyPosts.value
    ? filter(posts.value, (p: any) => uid?.value == p.author_id)
    : posts.value
);
const postsInitial = computed(() => client.posts.value);
const postsMoreBatch = computed(() => clientMorePosts_.posts.value);
watchEffect(() => {
  posts.value = filter(
    unionBy(postsInitial.value, postsMore.value, "id"),
    (p: any) => !(p.key in asset_keys_ignore.value)
  );
});
watchEffect(() => {
  if (!isEmpty(postsMoreBatch.value)) {
    postsMore.value = compact(cat(postsMore.value, postsMoreBatch.value));
  }
});

// ##computed
// ##forms ##handlers ##helpers ##small-utils
const otdNext = () => {
  otd$.value = minBy(posts.value, (p: any) =>
    new Date(p.created_at).getTime()
  )?.created_at;
};
// ##watch
onMounted(() => {
  watchEffect(() => {
    toggleBtnVisibleActive.isActive.value = !isEmpty(posts.value);
  });
});

// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "👷🏻‍♂️ Frikom teren ", titleTemplate: "" });
// ##provide
// ##io
// listen query-cache-update events to update display list
const {
  app: { EVENT_CACHE_ASSET_UPDATED, EVENT_CACHE_ASSETS_REMOVED },
} = useAppConfig();
const { $emitter } = useNuxtApp();
// update display list:more
$emitter.on(EVENT_CACHE_ASSET_UPDATED, (asset: any) => {
  postsMore.value = map(postsMore.value, (p: any) =>
    asset.id == p.id ? assign({}, p, asset) : p
  );
});
// add removed post .key-s to skip list
$emitter.on(EVENT_CACHE_ASSETS_REMOVED, (ids: any) => {
  assign(
    asset_keys_ignore.value,
    reduce(
      ids,
      (res: any, id: any) => {
        const key_ = find(posts.value, (p: any) => id == p.id)?.key;
        if (key_) {
          res[key_] = true;
        }
        return res;
      },
      <any>{}
    )
  );
});

// @@eos
</script>
<template>
  <section class="page--dashboard">
    <VCardDataIterator
      :items="postsFiltered"
      :per-page="-1"
      :reload="client.reload"
      enabled-dots-menu
      hide-categories-available
      :props-dots-menu-icon="{ size: '1.5rem' }"
    >
      <template #menu>
        <VList>
          <VListItem @click="onlyMyPosts = !onlyMyPosts" class="ps-2">
            <template #prepend>
              <VCheckboxBtn
                color="primary"
                :false-icon="iconCheckOff"
                :true-icon="iconCheckOn"
                :model-value="onlyMyPosts"
              />
            </template>
            <VListItemTitle class="ps-2">Moji postovi</VListItemTitle>
          </VListItem>
        </VList>
      </template>
      <template #items="{ items, select, isSelected }">
        <VResponsive class="__spacer pa-2 mx-auto pt-3" :max-width="456">
          <template v-for="(node, i) in items" :key="node.raw.id">
            <VSpacer v-if="0 < i" class="mt-4" />
            <VCardPost
              @removed="
                ({ id }) => {
                  posts = filter(posts, (p) => id != p.id);
                }
              "
              :post="node.raw"
              :i="i"
              :select="(flag) => select([node], flag)"
              :isSelected="isSelected([node])"
            />
          </template>
        </VResponsive>
      </template>
    </VCardDataIterator>
    <VBtnTriggerVisible
      block
      @visible="otdNext"
      :is-active="toggleBtnVisibleActive.isActive.value"
      class="mt-16"
      variant="plain"
      color="on-surface"
      >•</VBtnTriggerVisible
    >
    <VFabMain
      color="surface"
      elevation="10"
      size="x-large"
      :to="{ name: 'app-objave-nova' }"
    >
      <template #icon>
        <Iconx
          size="1.75rem"
          icon="icons-local:posts-add"
          class="-rotate-3 text-primary-darken-1"
        />
      </template>
    </VFabMain>
    <VSpacer class="mt-32" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
