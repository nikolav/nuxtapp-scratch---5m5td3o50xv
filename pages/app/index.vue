<script setup lang="ts">
// ##imports
import { VFabMain, VCardDataIterator, VCardPost } from "@/components/app";
import { renderIcon } from "@/components/icons";
// ##config:const
// ##config ##props ##route ##attrs
definePageMeta({
  scrollToTop: false,
  layout: "app-default",
  middleware: "authorized",
});
// ##schemas
// ##utils
const uid = inject(key_UID);
// ##icons
const iconCheckOn = renderIcon("check-on");
const iconCheckOff = renderIcon("check-off");
// ##refs ##flags ##models
// ##data ##auth ##state

const onlyMyPosts = useGlobalVariable(
  "posts:my-only:854f930b-f2c2-5e86-ad20-6c87c3ac22a6"
);

const client = useQueryAssetsPostsReadable();
const { watchProcessing } = useStoreAppProcessing();
watchProcessing(() => client.loading.value);

const posts_ = computed(() =>
  onlyMyPosts.value
    ? filter(client.posts.value, (p: any) => uid?.value == p.author_id)
    : client.posts.value
);

// ##computed
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "👷🏻‍♂️ Frikom teren ", titleTemplate: "" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--dashboard">
    <VCardDataIterator
      :items="posts_"
      :per-page="20"
      :reload="client.reload"
      enabled-dots-menu
      hide-categories-available
      :props-dots-menu-icon="{ size: '1.5rem' }"
    >
      <template #menu>
        <VList>
          <VListItem @click="onlyMyPosts = !onlyMyPosts" class="ps-2">
            <template #prepend>
              <VCheckboxBtn
                color="primary"
                :false-icon="iconCheckOff"
                :true-icon="iconCheckOn"
                :model-value="onlyMyPosts"
              />
            </template>
            <VListItemTitle class="ps-2">Moji postovi</VListItemTitle>
          </VListItem>
        </VList>
      </template>
      <template #items="{ items, select, isSelected }">
        <VResponsive class="__spacer pa-2 mx-auto pt-3" :max-width="456">
          <template v-for="(node, i) in items" :key="node.raw.id">
            <VSpacer v-if="0 < i" class="mt-4" />
            <VCardPost
              :post="node.raw"
              :i="i"
              :select="(flag) => select([node], flag)"
              :isSelected="isSelected([node])"
            />
          </template>
        </VResponsive>
      </template>
    </VCardDataIterator>
    <VFabMain
      color="surface"
      elevation="5"
      size="large"
      :to="{ name: 'app-objave-nova' }"
    >
      <template #icon>
        <strong class="text-xl rotate-3"><pre>📃</pre></strong>
      </template>
    </VFabMain>
    <VSpacer class="mt-32" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
