<script setup lang="ts">
// ##imports
import { Redirect } from "@/components/utils";
import { useDisplay } from "vuetify";
import {
  VToolbarPrimary,
  VRatingTopicRating,
  VBtnGroupTopicLikeDislike,
  VBtnTopicChatToggle,
  VBtnShareSocialNetworks,
  VChipAssetCategory,
  VBtnOpenGallery,
  PRenderHtml,
  VChipUserAvatar,
} from "@/components/app";

// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "default",
});

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
  layout: { toolbarMainHeight },
  db: {
    Assets: {
      tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
    },
  },
} = useAppConfig();

const auth = useStoreApiAuth();
const route = useRoute();

const pkey_ = computed(() => route.query.q);
const qenabled = compact(() => auth.isAuth$ && !!pkey_.value);

// ##schemas
// ##utils
const { ratingAssets, likesAssets, chatAssets } = useTopics();
const { mdAndUp, smAndUp } = useDisplay();
// ##icons
// ##refs ##flags ##models
const isBlocked_ = ref();
// ##data ##auth ##state
const {
  assets: posts,
  callback: { onQueryResult },
} = useQueryManageAssetsPosts(
  undefined,
  false,
  () => ({
    enabled: qenabled.value,
  }),
  () => ({
    whitelist_tags: [TAG_ASSETS_SHAREABLE_GLOBALY],
    search: {
      strategy: "one_by_key",
      args: {
        key: pkey_.value,
      },
    },
  })
);
const post = computed(() => first(posts.value));
const pkey = computed(() => post.value?.key);
const { images } = useFirebaseStorageAssetImages(pkey);
// ##computed
const assetPathPublicUrl = usePublicUrlAssetPost(pkey);
const postName = computed(() => post.value?.name || "");
const topicRatingAssets = computed(() => ratingAssets(pkey.value));
const topicLikesAsset = computed(() => likesAssets(pkey.value));
const topicChatAsset = computed(
  () => `${chatAssets(pkey.value)} --title ${kebabCase(postName.value)}`
);
const {
  current: imageCurrent,
  size: imagesLength,
  start: slidesStart,
} = useSampleCollection(images, undefined, undefined, [
  DEFAULT_NO_IMAGE_AVAILABLE,
]);
const pageTitle = computed(() => `📃 ${postName.value}`);

// ##forms ##handlers ##helpers ##small-utils
const toObjectWithSrc = (src: any) => ({ src });
// ##watch
// ##hooks ##lifecycle
onQueryResult(({ data, loading }) => {
  nextTick(() => {
    if (isEmpty(data?.assetsList) && !loading) {
      isBlocked_.value = true;
    }
  });
});
useOnceMountedOn(() => 1 < imagesLength.value, slidesStart);

// ##head ##meta
useHead({ title: pageTitle });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-pregled">
    <Redirect v-if="isBlocked_" :to="{ name: 'index' }" />
    <template v-else>
      <VCard variant="text" rounded="0" elevation="0">
        <VToolbarPrimary
          :props-title="{ class: 'text-start text-body-1 font-italic' }"
          :props-actions="{ class: 'pe-3' }"
          hide-default-close
        >
          <template #prepend>
            <VBtnOpenGallery
              v-if="!mdAndUp"
              :show-badge="false"
              color="on-primary"
              :slides="map(images, toObjectWithSrc)"
              class="scale-[92%]"
              :props-badge="{ class: '-translate-x-[3px] -me-[12px]' }"
            />
            <Iconx
              v-else
              size="1.5rem"
              class="ms-1 opacity-30 -rotate-2"
              icon="page"
            />
          </template>
          <template #title>
            <em :class="!smAndUp ? 'text-sm' : undefined">
              {{ postName }}
            </em>
          </template>
          <template #actions>
            <VBtnTopicChatToggle :topic="topicChatAsset" />
            <VBtnShareSocialNetworks
              :item="{
                url: assetPathPublicUrl,
                title: postName,
                description: postName,
              }"
              :small="!smAndUp"
              :props-share-buttons="{ color: 'primary-darken-1' }"
              :props-icon-share="{ size: '1.22rem' }"
            />
          </template>
        </VToolbarPrimary>
        <VContainer fluid class="pa-2 ma-0">
          <VRow no-gutters class="pa-0 ma-0">
            <!-- @@gallery -->
            <VCol class="pa-0 ma-0" v-if="mdAndUp" md="5" order="-1">
              <VResponsive
                :height="`calc(100vh - ${toolbarMainHeight}px - 1em)`"
              >
                <VFadeTransition mode="out-in">
                  <NuxtImg
                    :key="imageCurrent"
                    class="fill-height object-contain rounded-lg border-0 p-[2px] mx-auto"
                    sizes="100vw"
                    :src="imageCurrent"
                  />
                </VFadeTransition>
              </VResponsive>
            </VCol>
            <!-- @@product:data -->
            <VCol md="7">
              <section class="__spacer">
                <!-- @@social -->
                <div
                  class="__spacer d-flex justify-between items-center pa-1 ps-0"
                >
                  <VRatingTopicRating
                    :topic="topicRatingAssets"
                    color="secondary-lighten-2"
                    :density="smAndUp ? undefined : 'compact'"
                  />
                  <VBtnGroupTopicLikeDislike :topic="topicLikesAsset" />
                </div>
              </section>
              <section class="__spacer mt-4 ps-4">
                <VChipUserAvatar
                  v-if="post?.author"
                  :props-avatar="{ size: 'large', class: 'ms-1' }"
                  size="x-large"
                  :user="post.author"
                  class="ps-0"
                />
              </section>
              <!-- @@text -->
              <section
                class="__spacer indent-4"
                :class="[smAndUp ? 'prose-lg' : 'prose']"
              >
                <VCardText>
                  <PRenderHtml :html="post?.data.content.html" class="prose" />
                </VCardText>
              </section>
            </VCol>
          </VRow>
        </VContainer>
      </VCard>
    </template>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
