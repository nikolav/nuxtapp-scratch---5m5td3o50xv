<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VChipUserAvatar,
  VBtnTopicChatToggle,
  VBtnGroupTopicLikeDislike,
  VRatingTopicRating,
  VBtnOpenGallery,
} from "@/components/app";
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
} = useAppConfig();
// ##schemas
// ##utils
const { smAndUp } = useDisplay();
const { chatAssets, likesAssets, ratingAssets } = useTopics();
const { topicWithTitle } = useGlobalVariableChatActive();
const { $dd } = useNuxtApp();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
const clientStorage = useFirebaseStorageAssetImages(() => props.post?.key);
// ##computed
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
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard rounded="lg">
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
    <VCardTitle>
      <NuxtLink :to="{ name: 'app-objave-oid', params: { oid: post?.id } }">
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
