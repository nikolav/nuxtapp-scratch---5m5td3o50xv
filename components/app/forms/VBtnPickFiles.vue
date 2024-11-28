<script setup lang="ts">
// ##imports
import { VBtnOpenGallery } from "@/components/app";
// ##config:const
// ##config ##props
const props = withDefaults(
  defineProps<{
    propsBadge?: any;
    resetId?: any;
    showSelection?: boolean;
    showClear?: boolean;
  }>(),
  {
    showSelection: true,
    showClear: true,
  }
);
// ##schemas
// ##utils
const { open, onChange, reset } = useFileDialog({ multiple: true });
// ##icons
// ##refs ##flags ##models
const mFilesSelected = defineModel();
// ##data ##auth ##state
// ##computed
const someFilesSelected = computed(() => !isEmpty(mFilesSelected.value));
const slidesFilesSelectedPreview = computed(() =>
  map(mFilesSelected.value, (node: any) => ({
    type: filesIsPdf(node.file) ? "pdf" : undefined,
    src: node.dataurl,
    caption: node.file.name,
  }))
);
// ##forms ##handlers ##helpers ##small-utils
onChange(async (files) => {
  if (isEmpty(files)) return;
  mFilesSelected.value = await Promise.all(
    map(files, async (file: File) => ({
      file,
      dataurl: await dataUrl(file),
    }))
  );
});
const selectionClear = () => {
  mFilesSelected.value = undefined;
  reset();
};
// ##watch
watch(
  () => props.resetId,
  (ID) => {
    if (ID) selectionClear();
  }
);
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VBtn
    @click="open()"
    class="component--VBtnPickFiles"
    :class="[someFilesSelected ? '!pe-[2px]' : 'pe-4']"
  >
    <VBadge
      inline
      :model-value="someFilesSelected"
      :content="len(mFilesSelected)"
      class="px-0 mx-0"
      color="primary-lighten-1"
      v-bind="propsBadge"
    >
      <slot />
      <span class="__spacer me-1" />
    </VBadge>
    <template #prepend>
      <slot name="prepend">
        <Iconx icon="$file" size="1.22rem" class="opacity-40 *me-1" />
      </slot>
    </template>
    <template v-if="someFilesSelected" #append>
      <VBtnOpenGallery
        @click.stop
        :show-badge="false"
        :slides="slidesFilesSelectedPreview"
        color="on-primary"
        variant="plain"
      >
        <template #icon>
          <Iconx icon="eye" size="1.33rem" class="*opacity-40" />
        </template>
      </VBtnOpenGallery>
      <template v-if="showClear">
        <VBtn
          @click.stop="selectionClear"
          icon
          size="small"
          variant="plain"
          color="error"
        >
          <Iconx icon="trash" size="1.122rem" />
        </VBtn>
      </template>
    </template>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
