<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { Redirect } from "@/components/utils";

// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "default",
  // middleware: "",
});

const {
  db: {
    Assets: {
      tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
    },
  },
} = useAppConfig();

const route = useRoute();
const oid = computed(() => Number(route.query.q));
const enabled = computed(() => !!oid.value);
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
const isBlocked_ = ref();
// ##data ##auth ##state
const {
  assets: posts,
  callback: { onQueryResult },
} = useQueryManageAssetsPosts(
  () => [oid.value],
  false,
  {
    enabled,
  },
  {
    whitelist_tags: [TAG_ASSETS_SHAREABLE_GLOBALY],
  }
);
const post = computed(() => first(posts.value));
const { images } = useFirebaseStorageAssetImages(() => post.value?.id);
onQueryResult(({ data, loading }) => {
  nextTick(() => {
    if (!loading && isEmpty(data?.assetsList)) {
      isBlocked_.value = true;
    }
  });
});

// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-pregled">
    <Redirect v-if="isBlocked_" :to="{ name: 'index' }" />
    <Dump v-else :data="{ images, post }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
