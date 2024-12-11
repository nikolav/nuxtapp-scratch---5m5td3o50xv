<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import {
  VToolbarPrimary,
  VRatingTopicRating,
  VBtnGroupTopicLikeDislike,
  VBtnTopicChatToggle,
  VBtnShareSocialNetworks,
  VChipAssetCategory,
  VBtnOpenGallery,
} from "@/components/app";

// ##config
const props = defineProps<{
  assetType?: any;
}>();

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
  layout: { toolbarMainHeight },
} = useAppConfig();

// ##utils
const { ratingAssets, likesAssets, chatAssets } = useTopics();
const { mdAndUp, smAndUp } = useDisplay();
const route = useRoute();
const akey = computed(() => Number(route.query.q));
// const watchID = useUniqueId();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const auth = useStoreApiAuth();
const qenabled = computed(() => auth.isAuth$ && !!akey.value);
const { assets } = useQueryManageAssets(
  props.assetType,
  undefined,
  false,
  {
    enabled: qenabled,
  },
  {
    search: {
      strategy: "one_by_key",
      args: {
        key: akey,
      },
    },
  }
);
const a = computed(() => first(assets.value));
const ID = computed(() => a.value?.id);
const { images } = useFirebaseStorageAssetImages(() => a.value?.key);
// ##computed
const assetPathPublicUrl = usePublicUrlAssetProduct(ID);
const titleAssetName = computed(() => a.value?.name || "");
const topicRatingAssets = computed(() => ratingAssets(ID.value));
const topicLikesAsset = computed(() => likesAssets(ID.value));
const topicChatAsset = computed(
  () => `${chatAssets(ID.value)} --title ${kebabCase(titleAssetName.value)}`
);
const {
  current: imageCurrent,
  size: imagesLength,
  start: slidesStart,
} = useSampleCollection(images, undefined, undefined, [
  DEFAULT_NO_IMAGE_AVAILABLE,
]);
const barcode = computed(() => get(a.value, "data.barcode"));
const description = computed(() => a.value?.notes);
// ##forms ##helpers
const aFields = {
  name: computed(() => a.value?.name),
  linkTo: computed(() => {
    const lnk = get(a.value, "data.link");
    return lnk
      ? {
          href: lnk,
          // external: true,
          target: "_blank",
        }
      : undefined;
  }),
};
const toObjectWithSrc = (src: any) => ({ src });
// ##watch
// ##hooks:lifecycle
useOnceMountedOn(() => 1 < imagesLength.value, slidesStart);
// ##head
useHead({ title: titleAssetName });

// @@eos
</script>
<template>
  <section class="component--PageAssetDisplay">
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
          <Iconx v-else size="1.5rem" class="ms-1 opacity-30" icon="box" />
        </template>
        <template #title>
          <span :class="!smAndUp ? 'text-sm' : undefined">
            Podaci o proizvodu
          </span>
        </template>
        <template #actions>
          <VBtnTopicChatToggle :topic="topicChatAsset" />
          <VBtnShareSocialNetworks
            :item="{
              url: assetPathPublicUrl,
              title: titleAssetName,
              description: description || '',
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
            <VResponsive :height="`calc(100vh - ${toolbarMainHeight}px - 1em)`">
              <VFadeTransition mode="out-in">
                <NuxtImg
                  :key="imageCurrent"
                  class="fill-height !object-cover rounded-lg border p-[2px] mx-auto"
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
              <!-- @@title -->
              <h1 v-if="aFields.linkTo.value" class="ps-3">
                <NuxtLink v-bind="aFields.linkTo.value">
                  <a class="text-primary-darken-3 text-decoration-underline">
                    <Iconx
                      icon="icons-local:house"
                      size="1.33rem"
                      class="translate-y-[3px] me-3 opacity-20"
                    />
                    <span>
                      {{ aFields.name }}
                    </span>
                  </a>
                </NuxtLink>
              </h1>
              <h1 v-else>{{ aFields.name }}</h1>
            </section>
            <!-- @chips @tags -->
            <div class="__spacer ps-3 d-flex items-center gap-2">
              <VChipAssetCategory
                :asset="a"
                :size="smAndUp ? 'large' : 'small'"
                :show-extra="smAndUp"
              />
              <VChip
                color="primary"
                elevation="1"
                variant="tonal"
                v-if="barcode"
                :size="smAndUp ? 'large' : 'small'"
              >
                <template v-if="smAndUp" #prepend>
                  <Iconx
                    size="1.33rem"
                    class="opacity-30 translate-y-px"
                    icon="barcode"
                  />
                </template>
                <pre class="ms-1">{{ barcode }}</pre>
              </VChip>
            </div>
            <!-- @description @info -->
            <section
              v-if="description"
              class="__spacer indent-4 pa-5"
              :class="[smAndUp ? 'prose-lg' : 'prose']"
            >
              <p>{{ description }}</p>
            </section>
          </VCol>
        </VRow>
      </VContainer>
    </VCard>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
