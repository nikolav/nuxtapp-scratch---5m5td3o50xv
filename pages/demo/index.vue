<script setup lang="ts">
// ##imports
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
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

// const images = ref();
// const { firebasePathAssets } = useTopics();
// const { ls, url } = useFirebaseStorage(() =>
//   firebasePathAssets("c2f7e312-cb57-4a29-83b8-8d20b64529e6")
// );
// onMounted(async () => {
//   images.value = await Promise.all(
//     map(await ls(), async (node: any) => await url(node.name))
//   );
// });

const client = useFirebaseStorageAssetImages(
  () => "c2f7e312-cb57-4a29-83b8-8d20b64529e6"
);

// @@eos
</script>
<template>
  <section class="page--demo">
    <h1>🚧</h1>
    <pre>{{ { images: client.images.value } }}</pre>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
