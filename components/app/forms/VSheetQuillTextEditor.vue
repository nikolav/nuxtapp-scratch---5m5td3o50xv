<script setup lang="ts">
// ##imports
import Quill from "quill";
import EE from "eventemitter3";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
defineOptions({
  inheritAttrs: false,
});
const props = withDefaults(
  defineProps<{
    id?: any;
    //
    propsContainer?: any;
  }>(),
  {
    id: `ID:${uuid()}`,
  }
);
// ##schemas
// ##utils
const colors_ = listColorWheel({
  count: 19,
  lightness: 0.34,
  prepend: [false],
});
const ee$ = new EE();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
onMounted(() => {
  nextTick(() => {
    const q = new Quill(props.id, {
      debug: "info",
      modules: {
        toolbar: false,
      },
      placeholder: "Text objave...",
      theme: "snow",
      bounds: `${props.id}:container`,
      // formats: ["bold", "italic", "underline"],
    });
    ee$.on("run", () => {
      q.format("size", "large" == q.getFormat()?.size ? false : "large");
    });
    ee$.on("format:list-ordered", () => {
      q.format("list", "ordered" == q.getFormat()?.list ? false : "ordered");
    });
    ee$.on("format:list-bullet", () => {
      q.format("list", "bullet" == q.getFormat()?.list ? false : "bullet");
    });
    ee$.on("format:toggle-lg", () => {
      q.format("size", "large" == q.getFormat()?.size ? false : "large");
    });
    ee$.on("getContents", ({ handle }) => {
      handle(q.getContents());
    });
    ee$.on("format:toggle-h1", () => {
      q.format("header", 1 === q.getFormat()?.header ? null : 1);
    });
    ee$.on("format:toggle-bold", () => q.format("bold", !q.getFormat()?.bold));
    ee$.on("format:toggle-italic", () =>
      q.format("italic", !q.getFormat()?.italic)
    );
    ee$.on("format:toggle-underline", () =>
      q.format("underline", !q.getFormat()?.underline)
    );
    ee$.on("format:text-color", (c: any) => q.format("color", c));
  });
});
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <ClientOnly>
    <VSheet
      :id="`${id}:container`"
      class="component--VSheetQuillTextEditor"
      v-bind="propsContainer"
    >
      <!-- toolbar:1 -->
      <VToolbar density="compact" color="transparent">
        <VBtn @click="() => ee$.emit('format:toggle-bold')" icon size="small">
          <Iconx icon="format-bold" size="1.33rem" />
        </VBtn>
        <VBtn @click="() => ee$.emit('format:toggle-italic')" icon size="small">
          <Iconx icon="format-italic" size="1.33rem" />
        </VBtn>
        <VBtn
          @click="() => ee$.emit('format:toggle-underline')"
          icon
          size="small"
        >
          <Iconx icon="format-underlined" size="1.33rem" />
        </VBtn>
        <VBtn @click="() => ee$.emit('format:toggle-lg')" icon size="small">
          <Iconx icon="format-size" size="1.33rem" />
        </VBtn>
        <VBtn icon size="small">
          <strong class="text-[122%]">🎨</strong>
          <VMenu activator="parent" location="center center">
            <VSheet width="244">
              <div class="d-flex items-center flex-wrap p-[2px]">
                <div
                  v-for="c in colors_"
                  @click="ee$.emit('format:text-color', c)"
                  :key="c"
                  class="w-[48px] h-[48px] cursor-pointer"
                  :style="{ backgroundColor: c || 'black' }"
                />
              </div>
            </VSheet>
          </VMenu>
        </VBtn>
      </VToolbar>
      <!-- toolbar:2 -->
      <VToolbar density="compact" color="transparent">
        <VBtn @click="() => ee$.emit('format:toggle-h1')" icon size="small">
          <Iconx icon="format-heading" size="1.44rem" />
        </VBtn>
        <VBtn @click="() => ee$.emit('format:list-ordered')" icon size="small">
          <Iconx icon="list-ordered" size="1.44rem" />
        </VBtn>
        <VBtn @click="() => ee$.emit('format:list-bullet')" icon size="small">
          <Iconx icon="list-bullet" size="1.33rem" />
        </VBtn>
      </VToolbar>
      <!-- quill:container -->
      <section :id="id" v-bind="$attrs" />
    </VSheet>
  </ClientOnly>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.component--VSheetQuillTextEditor {
  font-size: 111% !important;
  em {
    font-style: italic;
  }
}
</style>
