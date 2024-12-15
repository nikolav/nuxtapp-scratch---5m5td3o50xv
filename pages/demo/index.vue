<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "default",
  // middleware: "access-debug",
});
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "🚧Demo" });
// ##provide
// ##io

const { resized } = useResizeImage();
const { open, onChange } = useFileDialog({
  accept: "image/*",
  multiple: false,
});
const cache = useCacheRedisAssetsAttachments("foo");

onChange(async (files) => {
  const file = first(files);
  console.log({ file });
  if (file) {
    const d = await cache.attachmentMake(
      blobToFile(await resized(file), file.name)
    );
    console.log({ d });
    console.log({
      res: await cache.commit({
        [d.key]: d,
      }),
    });
  }
});

// @@eos
</script>
<template>
  <section class="page--demo">
    <h1>🚧</h1>
    <VBtn @click="open()">ok</VBtn>
    <VBtn @click="cache.remove('d')">rm:d</VBtn>
    <VBtn @click="cache.reload">reload</VBtn>
    <Dump :data="{ keys: cache.keys.value, files: cache.files.value }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
