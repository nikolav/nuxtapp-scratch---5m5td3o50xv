<script setup lang="ts">
// ##imports
import { Iconx } from "@/components/icons";
import { DEFAULT_NO_IMAGE_AVAILABLE } from "@/config";
import { ProvideRefInnerSizePercent } from "@/components/app";

// ##config
defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    rounded?: any;
    icon?: any;
    padding?: any;

    propsContainer?: any;
    propsBtn?: any;
    propsIcon?: any;

    defaultNoImage?: any;
    resetId?: any;
  }>(),
  {
    rounded: true,
    padding: 2,
    icon: "material-symbols:photo-camera-rounded",
    defaultNoImage: DEFAULT_NO_IMAGE_AVAILABLE,
  }
);
const imagePicked = defineModel();

// ##utils
const { onChange, open, reset } = useFileDialog({
  accept: "image/*",
  multiple: false,
});

// ##icons
// ##refs ##flags
const ref_XpsHHohktxqr648xO = ref();
// ##data ##auth ##state
// ##computed
const displayImage = computed(
  () => get(imagePicked.value, "dataurl") || props.defaultNoImage
);
// ##forms ##helpers ##handlers
onChange(async (files) => {
  imagePicked.value = isEmpty(files)
    ? null
    : { file: files![0], dataurl: await dataUrl(files![0]) };
});
const filesClear = () => {
  reset();
  imagePicked.value = null;
};

// ##watch
watch(
  () => props.resetId,
  (key) => {
    if (key) filesClear();
  }
);

// ##hooks:lifecycle
// ##head

// @@eos
</script>
<template>
  <VSheet
    class="component--VImgPickerSingle d-flex items-center justify-center"
    :style="{ padding: `${isNumeric(padding) ? padding + 'px' : padding}` }"
    :elevation="2"
    :rounded="rounded"
    v-bind="propsContainer"
  >
    <!-- <VAvatar class="ma-0 pa-0" variant="flat" v-bind="$attrs" /> -->
    <VImg
      :src="displayImage"
      class="ma-0 pa-0 fill-height"
      cover
      :rounded="rounded"
      v-bind="$attrs"
    >
      <slot name="action" :open="open">
        <VBtn
          ref="ref_XpsHHohktxqr648xO"
          @click="open()"
          size="100%"
          color="surface"
          variant="plain"
          class="position-absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
          v-bind="propsBtn"
        >
          <slot name="icon" :icon="icon">
            <ProvideRefInnerSizePercent
              :ref-lookup="ref_XpsHHohktxqr648xO"
              :percent="0.61"
              v-slot="{ size }"
            >
              <Iconx :size="`${size}px`" :icon="icon" v-bind="propsIcon" />
            </ProvideRefInnerSizePercent>
          </slot>
        </VBtn>
      </slot>
    </VImg>
  </VSheet>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
