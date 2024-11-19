<script setup lang="ts">
// ##imports
import type { IUser, OrNoValue } from "@/types";
import { VBadgeUserAvailability, VBtnShowLocation } from "@/components/app";
// ##config:const
// ##config ##props
const props = defineProps<{ user?: OrNoValue<IUser>; propsAvatar?: any }>();

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();
// ##schemas
// ##utils
const { calcDisplayName } = useAuthUtils();
const { showUserScreen } = useNavigationUtils();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const uid = computed(() => props.user?.id);
const image = computed(() =>
  get(props.user, "profile.avatarImage", DEFAULT_NO_IMAGE_AVAILABLE)
);
const groups = computed(() => props.user?.groups || []);
// ##forms ##handlers ##helpers
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VListItem
    rounded="s-pill"
    link
    @click="showUserScreen(uid)"
    class="component--VListItemTimShowUser ma-0 pa-2"
  >
    <template #prepend>
      <VAvatar size="54" :image="image" v-bind="propsAvatar" />
    </template>
    <template #append>
      <span class="d-flex items-center">
        <VBtnShowLocation
          :props-sheet="{ color: 'info' }"
          :props-menu="{
            location: 'bottom',
          }"
          class="translate-y-px me-1"
          :uid="uid"
          :props-icon="{ size: '1.55rem' }"
          @click.stop
        >
          <template #location="{ profile }">
            <strong class="text-lg">{{ profile.displayLocation }}</strong>
          </template>
        </VBtnShowLocation>
        <VBadgeUserAvailability class="*!translate-y-1" :uid="uid" />
        <!-- @@select check -->
        <slot name="selection" />
      </span>
    </template>
    <VListItemTitle class="text-h6">
      {{ calcDisplayName(user) }}
    </VListItemTitle>
    <VCardSubtitle
      v-if="!isEmpty(groups)"
      class="ms-0 ps-0 d-flex items-center gap-1"
    >
      <VChip
        color="primary"
        density="comfortable"
        size="small"
        v-for="g in groups"
        :key="g"
        :text="g"
      />
    </VCardSubtitle>
  </VListItem>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
