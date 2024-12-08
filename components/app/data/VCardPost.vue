<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VChipUserAvatar,
  VBtnTopicChatToggle,
  VBtnGroupTopicLikeDislike,
  VRatingTopicRating,
  VBtnOpenGallery,
  VBtnDotsMenuList,
  VSnackbarSuccess,
} from "@/components/app";
import { partialRight } from "lodash";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const props = defineProps<{
  post?: any;
  i?: any;
  select?: any;
  isSelected?: boolean;
}>();

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
  db: {
    Assets: {
      AssetsStatus,
      tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const ps = useProcessMonitor();
const {
  assetsPostsShareableNetworks,
  assetsPostBlocked,
  assetsPostActive,
  assetsPostOpen,
} = useAssetsUtils();
const { smAndUp } = useDisplay();
const { chatAssets, likesAssets, ratingAssets } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
const togglePostConfigSuccess = useToggleFlag();
const uid = inject(key_UID);
// ##data ##auth ##state
const clientStorage = useFirebaseStorageAssetImages(() => props.post?.key);
// load api; dont send query
const client = useQueryManageAssetsPosts(() => [props.post?.id], undefined, {
  enabled: false,
});
// ##computed
const shareable_ = computed(() => assetsPostsShareableNetworks(props.post));
const blocked_ = computed(() => assetsPostBlocked(props.post));
const active_ = computed(() => assetsPostActive(props.post));
const open_ = computed(() => assetsPostOpen(props.post));
const imagesPoster = computed(() => sample(clientStorage.images.value));
const postChatTopic = computed(() =>
  topicWithTitle(chatAssets(props.post?.key), props.post?.name)
);
const topicPostLikes = computed(() => likesAssets(props.post?.key));
const topicPostsRating = computed(() => ratingAssets(props.post?.key));
const postImagesSlides = computed(() =>
  map(clientStorage.images.value, (src: string) => ({
    src,
  }))
);
// ##forms ##handlers ##helpers ##small-utils
const MENU_items = [
  {
    title: "Blokiran post",
    value: "blocked",
    "title-small": "vidim samo ja",
    emoji: "⛔",
    handle: async () =>
      await client.commit(
        { status: AssetsStatus.POSTS_BLOCKED },
        props.post.id
      ),
  },
  {
    title: "Post aktivan",
    value: "active",
    "title-small": "vide moje grupe",
    emoji: "🟢",
    handle: async () => await client.commit({ status: null }, props.post.id),
  },
  {
    title: "Otvoren post",
    "title-small": "vide svi korisnici",
    value: "open",
    emoji: "🏨",
    handle: async () =>
      await client.commit({ status: AssetsStatus.POSTS_OPEN }, props.post.id),
  },
  {
    type: "divider",
    props: {
      class: "border-opacity-100 my-0 py-0",
    },
  },
  {
    title: "Deljiv na mrežama",
    "title-small": "",
    emoji: "🌐",
    handle: async () =>
      await client.tags(props.post.id, {
        [TAG_ASSETS_SHAREABLE_GLOBALY]: true,
      }),
  },
  {
    title: "Blokiraj javni pristup",
    "title-small": "",
    emoji: "🚫",
    handle: async () =>
      await client.tags(props.post.id, {
        [TAG_ASSETS_SHAREABLE_GLOBALY]: false,
      }),
  },
  {
    type: "divider",
    props: {
      class: "border-opacity-100 my-0 py-0 mb-2",
    },
  },
  {
    title: "Obriši post",
    "title-small": "",
    icon: {
      icon: "trash",
      size: "1.122rem",
      class: "text-error opacity-50 me-1",
    },
    props: {},
  },
];
const emojiStatus = computed(() => {
  const ss = <any>{ blocked: blocked_, active: active_, open: open_ };
  return get(
    find(MENU_items, (it: any) =>
      it?.value in ss ? true === ss[it.value].value : undefined
    ),
    "emoji"
  );
});

const handleManagePost = async (node: any) => {
  // data.assetsUpsert.error
  // data.assetsManageTags.error
  try {
    ps.begin(togglePostConfigSuccess.off);
    const res = await node.handle();
    if (
      some(
        ["data.assetsUpsert.error", "data.assetsManageTags.error"],
        (path: string) => get(res, path)
      )
    )
      throw "assets:config-setup:error";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      // @success
      togglePostConfigSuccess.on();
    });
};

// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard rounded="lg">
    <VSnackbarSuccess v-model="togglePostConfigSuccess.isActive.value">
      <p><strong class="me-1">👍🏻</strong> Post je uspešno ažuriran.</p>
    </VSnackbarSuccess>
    <VImg cover :height="192" :src="imagesPoster || DEFAULT_NO_IMAGE_AVAILABLE">
      <div class="__spacer d-flex flex-wrap items-center pa-2">
        <VChipUserAvatar
          :user="post?.author"
          variant="elevated"
          color="surface"
          :props-avatar="{ size: '1.44rem' }"
        />
        <VSpacer />
        <VChip
          size="small"
          variant="elevated"
          color="surface"
          elevation="1"
          :text="$dd.utc(post?.created_at).fromNow(true)"
          class="opacity-50"
        />
        <VBtnDotsMenuList
          v-if="uid == post?.author.id"
          color="on-surface"
          :props-icon="{ size: '1.44rem' }"
          :props-menu="{ 'max-width': undefined }"
          class="ms-2"
        >
          <template #list>
            <VList activatable elevation="5" rounded>
              <template v-for="node in MENU_items" :key="node.title">
                <VDivider v-if="'divider' == node.type" v-bind="node.props" />
                <VListItem
                  v-else
                  @click="() => handleManagePost(node)"
                  v-bind="node.props"
                >
                  <template #prepend>
                    <strong v-if="node?.emoji">{{ node.emoji }}</strong>
                    <Iconx v-else-if="node?.icon" v-bind="node.icon" />
                  </template>
                  <VListItemTitle
                    class="ps-3 d-flex justify-between items-baseline gap-3"
                  >
                    <span>{{ node.title }}</span>
                    <small
                      v-if="node['title-small']"
                      class="text-medium-emphasis"
                      >({{ node["title-small"] }})</small
                    >
                  </VListItemTitle>
                </VListItem>
              </template>
            </VList>
          </template>
        </VBtnDotsMenuList>
      </div>
      <div
        class="__spacer position-absolute inset-x-0 bottom-0 z-[1] d-flex items-center"
      >
        <VSpacer />
        <VBtnOpenGallery
          hide-if-empty
          variant="plain"
          color="on-surface"
          :slides="postImagesSlides"
          :props-icon="{ size: '1.44rem' }"
          :props-badge="{ 'offset-x': 55, id: 'ID--36orgIHUKpvnpYQSBVy' }"
          class="opacity-50"
        />
      </div>
    </VImg>
    <VCardTitle>
      <VRatingTopicRating :small="!smAndUp" :topic="topicPostsRating" />
    </VCardTitle>
    <VCardTitle class="overflow-visible ps-2">
      <span class="d-inline-flex items-center translate-y-[2px] opacity-50 align-top">
        <Iconx
          v-if="shareable_"
          icon="world"
          size="1.22rem"
          class="opacity-50 text-info -rotate-6"
        />
        <em v-if="emojiStatus" class="z-[1] text-sm">{{ emojiStatus }}</em>
      </span>
      <NuxtLink
        :to="{ name: 'app-objave-oid', params: { oid: post?.id } }"
        class="ps-1"
      >
        <a class="link--prominent text-primary-darken-1">
          {{ post?.id }} -- {{ post?.name }}
        </a>
      </NuxtLink>
    </VCardTitle>
    <VCardText class="!prose indent-2">
      <p class="line-clamp-3">
        {{ get(post, "data.content.text") }}
      </p>
    </VCardText>
    <VCardActions class="ps-5 pb-4">
      <VBtnGroupTopicLikeDislike :topic="topicPostLikes" light />

      <VBtnTopicChatToggle
        color="on-surface"
        :topic="postChatTopic"
        :props-icon="{ size: '1.44rem' }"
        class="ms-auto opacity-50"
      />
    </VCardActions>
  </VCard>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--36orgIHUKpvnpYQSBVy .v-badge__badge {
  opacity: 0.33;
}
</style>
