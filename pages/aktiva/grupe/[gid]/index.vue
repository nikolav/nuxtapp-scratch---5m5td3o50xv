<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { VAvatarProfileImage } from "@/components/app";
// ##config ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();
// ##utils
const route = useRoute();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const { assets: groups } = useQueryManageAssetsGroups(() => [route.params.gid]);
// ##computed
const g = computed(() => first(groups.value));
const gid = computed(() => g.value?.id);
const gname = computed(() => g.value?.name || "");
const { avatarImage } = useFirebaseStorageAssetsGroupAvatar(gid);
// const members = computed(() => g.value?.users || []);
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
