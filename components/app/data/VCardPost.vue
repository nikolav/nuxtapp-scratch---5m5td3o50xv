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
  VSnackbarMain,
  VSheetPinCodeRequired,
  VDialogPrimary,
  PRenderHtml,
  SpanTruncateCharsLength,
} from "@/components/app";

// ##config:const
// attach vmenu to this card-id for easy placement
const cardID = `ID--${idGen()}`;
// ##config ##props ##route ##attrs ##form-fields
const emit = defineEmits<{
  removed: [post: any];
}>();
const props = defineProps<{
  post?: any;
  i?: any;
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
  assetsPostLinkShareable,
} = useAssetsUtils();
const { smAndUp } = useDisplay();
const { chatAssets, likesAssets, ratingAssets } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
const keyChatName = computed(() => chatAssets(props.post?.key));

// use global var to signal post remove success
//  ..snackbar gets wiped out @component:rerender after cache update
const flagPostRemovedSuccess = useGlobalFlag(
  "post:removed:success:9d1eccf9-4bd4-53f3-a833-1b9f6ed63484"
);
const toggleDialogPreviewContent = useToggleFlag();
const togglePromtActivePostDelete = useToggleFlag();
const togglePostConfigSuccess = useToggleFlag();
const uid = inject(key_UID);
// ##data ##auth ##state
const clientCache = useCacheRedis(keyChatName);
const clientStorage = useFirebaseStorageAssetImages(() => props.post?.key);
// load api; dont send query
const client = useQueryManageAssetsPosts(() => [props.post?.id], undefined, {
  enabled: false,
});
// ##computed
const blocked_ = computed(() => assetsPostBlocked(props.post));
const active_ = computed(() => assetsPostActive(props.post));
const shareable_ = computed(() => assetsPostsShareableNetworks(props.post));
const shareableLink_ = computed(() => assetsPostLinkShareable(props.post));
const open_ = computed(() => assetsPostOpen(props.post));
const imagesPoster = computed(() => sample(clientStorage.images.value));
const postChatTopic = computed(() =>
  topicWithTitle(keyChatName.value, props.post?.name)
);
const topicPostLikes = computed(() => likesAssets(props.post?.key));
const topicPostsRating = computed(() => ratingAssets(props.post?.key));
const postImagesSlides = computed(() =>
  map(clientStorage.images.value, (src: string) => ({
    src,
  }))
);
const postChatlastMessage = computed(() =>
  get(clientCache.store.value, "message.data.message")
);
const postChatlastMessageSenderName = computed(() =>
  get(clientCache.store.value, "message.data.name")
);
// ##forms ##handlers ##helpers ##small-utils
const MENU_items = [
  {
    title: "Blokiran post",
    value: "blocked",
    "title-small": "vidim samo ja",
    emoji: "🔴",
    handle: async () =>
      await client.commit(
        { status: AssetsStatus.POSTS_BLOCKED },
        props.post.id
      ),
  },
  {
    title: "Aktivan post",
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
    value: "shared",
    emoji: "🌐",
    handle: async () =>
      await client.tags(props.post.id, {
        [TAG_ASSETS_SHAREABLE_GLOBALY]: true,
      }),
  },
  {
    title: "Blokiraj javni pristup",
    "title-small": "",
    value: "shared-off",
    emoji: "⛔",
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
    title: "Ažuriraj post",
    value: "update",
    icon: {
      icon: "$edit",
      size: "1.22rem",
      class: "opacity-50 me-1",
    },
    props: {
      to: {
        name: "app-objave-oid",
        params: { oid: props.post?.id },
      },
    },
    handle_custom: true,
    handle: noop,
  },
  {
    title: "Obriši post",
    "title-small": "",
    value: "delete",
    icon: {
      icon: "trash",
      size: "1.122rem",
      class: "text-error opacity-50 me-1",
    },
    props: {},
    handle_custom: true,
    handle: togglePromtActivePostDelete.on,
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
  // if (includes(["update", "delete"], node?.value)) {
  if (true === node?.handle_custom) {
    // custom strategy for deletes/updates
    return node.handle();
  }
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
const handlePostDelete = async () => {
  try {
    ps.begin();
    // remove record
    const res = await client.remove(props.post.id);
    if (get(res, "data.assetsRemove.error")) throw "@error --posts-rm";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) {
    ps.successful(async () => {
      togglePromtActivePostDelete.off();
      emit("removed", props.post);
      nextTick(() => {
        flagPostRemovedSuccess.value = true;
      });
      try {
        // @success remove images from firebase
        await clientStorage.rma();
      } catch (error) {
        console.debug(error);
      }
    });
  }
  console.debug("@debug:post:remove", ps.error.value);
};

// ##watch
watchEffect(() => useIOEvent(() => clientCache.IO.value, clientCache.reload));
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard rounded="lg" class="component--VCardPost" :id="cardID">
    <VDialogPrimary v-model="toggleDialogPreviewContent.isActive.value">
      <VSheet>
        <VSpacer class="mt-12" />
        <VCardText>
          <PRenderHtml :html="post?.data.content.html" class="prose" />
        </VCardText>
      </VSheet>
    </VDialogPrimary>
    <VSnackbarMain color="success-darken-1" v-model="flagPostRemovedSuccess">
      <p>Post je uspešno obrisan.</p>
    </VSnackbarMain>
    <VMenu
      v-model="togglePromtActivePostDelete.isActive.value"
      :activator="undefined"
      :attach="`#${cardID}`"
      :close-on-content-click="false"
      class="justify-center items-center"
    >
      <VSheetPinCodeRequired :min-width="278" message="Pin za brisanje posta:">
        <template #actions="{ pin, text }">
          <span class="d-flex flex-col">
            <VBtn
              @click="handlePostDelete"
              :disabled="pin != text"
              :max-width="164"
              :height="40"
              variant="tonal"
              color="error"
              rounded="pill"
              class="mx-auto px-3"
            >
              <template #prepend>
                <Iconx icon="trash" size="1.122rem" class="" />
              </template>
              <span>Obriši post</span>
            </VBtn>
            <em class="mt-1 text-sm text-error opacity-50">
              <SpanTruncateCharsLength :text="post?.name" :length="24" />
            </em>
          </span>
        </template>
      </VSheetPinCodeRequired>
    </VMenu>
    <VSnackbarMain
      color="success-darken-1"
      v-model="togglePostConfigSuccess.isActive.value"
    >
      <p><strong class="me-1">👍🏻</strong> Post je uspešno ažuriran.</p>
    </VSnackbarMain>
    <VImg cover :height="192" :src="imagesPoster || DEFAULT_NO_IMAGE_AVAILABLE">
      <div class="__spacer d-flex flex-wrap items-center pa-2">
        <VChipUserAvatar
          :user="post?.author"
          variant="elevated"
          color="surface"
          :props-avatar="{ size: '1.66rem' }"
          class="ps-1"
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
            <VList
              activatable
              elevation="5"
              rounded
              class="CLASS--VList-item-spacer-none"
            >
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
      <span
        class="d-inline-flex items-center translate-y-[2px] opacity-50 align-top"
      >
        <Iconx
          v-if="shareable_"
          icon="world"
          size="1.22rem"
          class="opacity-50 text-info -rotate-6"
        />
        <em v-if="emojiStatus" class="z-[1] text-sm">{{ emojiStatus }}</em>
      </span>
      <a
        @click.prevent.stop="toggleDialogPreviewContent.on"
        class="link--prominent text-primary-darken-1 ps-1"
      >
        {{ post?.name }}
      </a>
    </VCardTitle>
    <VCardText class="!prose indent-2">
      <p class="line-clamp-3">
        {{ get(post, "data.content.text") }}
      </p>
    </VCardText>
    <VCardActions class="ps-5" :class="[postChatlastMessage ? 'pb-10' : '']">
      <VBtnGroupTopicLikeDislike :topic="topicPostLikes" light />
      <NuxtLink v-if="shareable_" :href="shareableLink_" target="_blank">
        <VBtn icon variant="plain">
          <Iconx icon="external-link" size="1.22rem" />
        </VBtn>
      </NuxtLink>
      <VSpacer />
      <span
        class="position-relative d-flex flex-col items-end overflow-visible"
      >
        <VBtnTopicChatToggle
          color="on-surface"
          :topic="postChatTopic"
          :props-icon="{ size: '1.44rem' }"
          class="*ms-auto opacity-50"
        />
        <span
          v-if="postChatlastMessage"
          class="items-end d-flex flex-col text-medium-emphasis font-italic pe-4 position-absolute -bottom-7"
        >
          <SpanTruncateCharsLength
            :length="33"
            :text="postChatlastMessage"
            class="whitespace-nowrap"
            v-slot="{ text }"
          >
            <small>{{ text }}</small>
          </SpanTruncateCharsLength>
          <small class="whitespace-nowrap">{{
            postChatlastMessageSenderName
          }}</small>
        </span>
      </span>
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
