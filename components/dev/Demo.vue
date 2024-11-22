<script setup lang="ts">
// c41ef9a5-e0aa-5305-a36f-c080a907969c
import { Test, Dump } from "@/components/dev";
import { VImgImagesPickerDefaut } from "@/components/app";

const newProductImagesPicked = ref();
const someImagesPicked = computed(() => !isEmpty(newProductImagesPicked.value));
const imagesPrev = ref<any>([
  "https://firebasestorage.googleapis.com/v0/b/jfejcxjyujx.appspot.com/o/media%2FASSETS%3AZJYH3%2Fimages%2F17%2Fpomfrit-frikom.2024-11-20%2001_31_56-Window.png?alt=media&token=ed903180-a91a-4a5a-b539-f3a3528d193a",
  "https://firebasestorage.googleapis.com/v0/b/jfejcxjyujx.appspot.com/o/media%2FASSETS%3AZJYH3%2Fimages%2F33%2F2024-11-21%2018_10_41-Window.png?alt=media&token=663a5c4d-a4a1-4174-b568-9212e0d66ba7",
]);
// @@eos
</script>
<template>
  <section class="component--Demo">
    <VImgImagesPickerDefaut
      v-model="newProductImagesPicked"
      @update:model-value="noop"
      :default-images="imagesPrev"
      :props-container="{
        height: 256,
        maxWidth: 333,
        class: 'mx-auto',
      }"
      :height="252"
      :max-width="333"
    />
  </section>
</template>
<style lang="scss" scoped></style>
