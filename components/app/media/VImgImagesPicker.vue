<script setup lang="ts">
// Rn2YIcvZUR9cZtdAFd
import { VBtnOpenGallery, ProvideRefInnerSizePercent } from "@/components/app";
import type { ILightboxSlide } from "@/types";
defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(
  defineProps<{
    defaultNoImage?: string;
    propsContainer?: any;
    // signal external form-reset
    keyImagesCleared?: any;
  }>(),
  {
    defaultNoImage: "/no-image.jpg",
  }
);
// { file:File, dataurl:string }[]
const imagesPicked = defineModel();
const numImagesPicked = computed(() => len(imagesPicked.value) || 0);
const slidesImagesPicked = computed<ILightboxSlide[]>(() =>
  imagesPicked.value
    ? map(imagesPicked.value, (node: any) => ({
        src: node.dataurl,
        caption: node.file.name,
      }))
    : []
);
const imageCurrent = computed(() =>
  get(imagesPicked.value, "0.dataurl", props.defaultNoImage)
);
const { onChange, open, reset } = useFileDialog({
  accept: "image/*",
  multiple: true,
});
onChange(async (files) => {
  if (isEmpty(files)) return;
  imagesPicked.value = await Promise.all(
    map(files, async (file: File) => ({ file, dataurl: await dataUrl(file) }))
  );
});

const filesClear = () => {
  reset();
  imagesPicked.value = undefined;
};

watch(
  () => props.keyImagesCleared,
  (key) => {
    if (key) filesClear();
  }
);

const ref_IoNb44 = ref();

// @@eos
</script>
<template>
  <VSheet
    ref="ref_IoNb44"
    elevation="2"
    rounded
    class="w-full overflow-hidden p-[2px] position-relative"
    v-bind="propsContainer"
  >
    <VImg
      :src="imageCurrent"
      rounded
      cover
      class="component--NuxtImgImagesPicker fill-height"
      v-bind="$attrs"
    >
      <VToolbar
        v-if="0 < numImagesPicked"
        class="opacity-50"
        elevation="1"
        height="32"
      >
        <template #prepend>
          <VBtnOpenGallery density="comfortable" :slides="slidesImagesPicked" />
        </template>
        <template #append>
          <VBtn
            @click="filesClear"
            icon
            size="small"
            color="error"
            density="comfortable"
          >
            <Iconx size="1.22rem" icon="material-symbols:delete" />
          </VBtn>
        </template>
      </VToolbar>
      <slot name="action" :open="open">
        <ProvideRefInnerSizePercent
          :ref-lookup="ref_IoNb44"
          :percent="0.99"
          v-slot="{ size }"
        >
          <VBtn
            @click="open()"
            color="surface"
            :size="size"
            variant="plain"
            icon
            rounded="circle"
            class="position-absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
          >
            <Iconx
              :size="size * 0.66"
              icon="material-symbols:photo-camera-rounded"
            />
          </VBtn>
        </ProvideRefInnerSizePercent>
      </slot>
    </VImg>
  </VSheet>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
