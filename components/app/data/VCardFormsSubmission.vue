<script setup lang="ts">
// ##imports
import type { IDocs, OrNoValue } from "@/types";
import { ProvideUserProfile } from "@/components/app";
// ##config:const
// ##config ##props
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  submission?: OrNoValue<IDocs>;
  i: number;
  select: any;
  isSelected: any;
}>();

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();
// ##schemas
// ##utils
const { $dd } = useNuxtApp();
const { calcDisplayName } = useAuthUtils();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const uid = computed(() => get(props.submission, "data.uid", -1));
// ##forms ##handlers ##helpers ##small-utils
const itemTo = (r: any) => ({
  name: "teren-rid-pregled",
  params: { rid: r.id },
});
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <ProvideUserProfile :uid="uid" v-slot="{ profile, user }">
    <VCard
      :to="itemTo(submission)"
      link
      class="component--VCardFormsSubmission"
      v-bind="$attrs"
    >
      <VCardItem class="ps-2 pe-0">
        <template #prepend>
          <VAvatar
            size="51"
            :image="profile?.avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
          />
        </template>
        <VCardTitle class="text-body-1 *indent-1">
          <span
            class="text-sm d-inline-block -translate-y-[3px] opacity-50 me-1"
            >✍🏻</span
          >
          <span>{{ get(submission, "asset.name") }}</span>
        </VCardTitle>
        <VCardSubtitle class="justify-between d-flex pe-4">
          <VChip
            density="comfortable"
            @click.stop
            :to="{ name: 'tim-uid', params: { uid } }"
            elevation="1"
            :text="calcDisplayName(user)"
          />
          <small class="font-italic opacity-85">
            <pre>{{ $dd.utc(submission.created_at).fromNow(true) }}</pre>
          </small>
        </VCardSubtitle>
      </VCardItem>
    </VCard>
  </ProvideUserProfile>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
