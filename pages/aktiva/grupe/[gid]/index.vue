<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { VAvatarProfileImage } from "@/components/app";
// ##config ##props ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const attrs = useAttrs();
const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();
// ##utils
const route = useRoute();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
// const { assets: groups } = useQueryManageAssetsGroups(() => [route.params.gid]);
// ##computed
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => routeData.value?.gid);
const gname = computed(() => routeData.value?.gname);
const { avatarImage } = useFirebaseStorageAssetsGroupAvatar(gid);
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide
useHead({ title: gname });

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-index">
    <VForm @submit.prevent="noop" autocomplete="off">
      <VCard variant="text" rounded="0">
        <div class="__spacer d-flex justify-center mt-3">
          <VAvatarProfileImage
            padding=".25rem"
            :image="avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
          />
        </div>
        <VCardText>
          <!-- <VTextField label="Avatar" />
          <VTextField label="Naziv grupe" />
          <VTextField label="Lokacija" />
          <VTextField label="Region" />
          <VTextField label="Opis" />
          <VTextField label="Članovi" /> -->
        </VCardText>
      </VCard>
    </VForm>
    <hr />
    <Dump :data="{ g }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
