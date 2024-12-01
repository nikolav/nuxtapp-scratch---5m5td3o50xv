<script setup lang="ts">
// ##imports
import type { IDocs, OrNoValue } from "@/types";
import { renderIcon } from "@/components/icons";
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
const iconCheckOn = renderIcon("check-on", {
  class: "scale-[122%]",
});
const iconCheckOff = renderIcon("check-off", {
  class: "scale-[122%]",
});
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const user = computed(() => props.submission?.user);
const profile = computed(() => user.value?.profile);
// ##forms ##handlers ##helpers ##small-utils
const itemTo = (s: any) => ({
  name: "teren-rid-pregled-submission",
  params: { rid: get(props.submission, "asset.id"), submission: s.id },
});
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard
    :to="itemTo(submission)"
    link
    class="component--VCardFormsSubmission"
    v-bind="$attrs"
  >
    <VCardItem class="ps-2 pe-0">
      <VCheckboxBtn
        :model-value="isSelected()"
        @click.stop.prevent="select(!isSelected())"
        icon
        class="position-absolute top-0 start-0 z-[1]"
        variant="text"
        density="compact"
        color="primary"
        :true-icon="iconCheckOn"
        :false-icon="iconCheckOff"
      ></VCheckboxBtn>
      <template #prepend>
        <VAvatar
          size="51"
          :image="profile?.avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
        />
      </template>
      <VCardTitle class="text-body-1 *indent-1">
        <span class="opacity-40 me-1 d-inline-block -translate-y-px font-italic"
          ><small>
            <pre class="d-inline">#{{ submission?.id }}</pre>
          </small></span
        >

        <span>{{ get(submission, "asset.name") }}</span>
      </VCardTitle>
      <VCardSubtitle class="justify-between d-flex pe-4 items-end">
        <VChip
          density="comfortable"
          @click.stop
          :to="{ name: 'tim-uid', params: { uid: user.id } }"
          elevation="1"
          :text="calcDisplayName(user)"
        />
        <small class="font-italic opacity-85">
          <pre>{{ $dd.utc(submission.created_at).fromNow(true) }}</pre>
        </small>
      </VCardSubtitle>
    </VCardItem>
  </VCard>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
