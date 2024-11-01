<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IUser, OrNoValue } from "@/types";
import {
  VToolbarPrimary,
  VChipUserTag,
  VBtnUsersTagsAdd,
} from "@/components/app";

// ##config ##const
const DIALOG_MAX_WIDTH = 612;
const CARD_MIN_HEIGHT = 412;
const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();

// ##utils
const { smAndUp } = useDisplay();
const { usersTags } = useTopics();
const { calcDisplayName } = useAuthUtils();
// ##icons
// ##refs ##flags
const mIsActive = defineModel<boolean>();
const mUids = defineModel<OrNoValue<IUser[]>>("uids");

// ##data ##auth ##state
const { users: mUsers, size: sizeUsersSelection } = useQueryUsers(() =>
  toValue(mUids)
);
const {
  tags,
  search,
  getUserTagsFull,
  tagShorten,
  commit: tagsCommit,
} = useMutationUsersTags();

// ##computed
// tags in :users
const tagsAppliedFromUsers = computed(() =>
  intersectionBy(...map(mUsers.value, getUserTagsFull), upperCase)
);
const tagsAppliedFromUsersShortened = computed(() =>
  map(tagsAppliedFromUsers.value, tagShorten)
);
const someTagsIncluded = computed(() => !isEmpty(tagsAppliedFromUsers.value));
const tagsNotIncluded = computed(() =>
  differenceBy(
    // tags.value,
    search.value
      ? uniqBy([...[usersTags(search.value)], ...tags.value], upperCase)
      : tags.value,
    tagsAppliedFromUsers.value,
    upperCase
  )
);
const tagsNotIncludedShortened = computed(() =>
  map(tagsNotIncluded.value, tagShorten)
);
const displayNames = computed(() =>
  map(mUsers.value, calcDisplayName).join(" • ")
);

// ##forms ##helpers ##handlers
const buildHandleTags = (tag: string, flag: boolean) =>
  reduce(
    mUsers.value,
    (res: any, u: IUser) => {
      res[u.id] = { [tag]: flag };
      return res;
    },
    <any>{}
  );
const handleOnClear = async (tag: string) =>
  await tagsCommit(buildHandleTags(tag, false));
const handleOnAdd = async (tag: string) =>
  await tagsCommit(buildHandleTags(tag, true));
// ##watch
// ##hooks:lifecycle
// ##head ##meta
// ##provide

// @@eos
</script>
<template>
  <VDialog
    v-model="mIsActive"
    :transition="DEFAULT_TRANSITION"
    :fullscreen="!smAndUp"
    :max-width="DIALOG_MAX_WIDTH"
    class="component--VDialogManageUserTags"
    location="center center"
  >
    <template #default="{ isActive }">
      <VCard
        :rounded="smAndUp ? 't-lg' : undefined"
        class="pa-0"
        :min-height="smAndUp ? CARD_MIN_HEIGHT : undefined"
      >
        <VCardItem class="pa-0">
          <VToolbarPrimary
            :props-title="{ class: 'font-italic text-body-1' }"
            :on-close="
              () => {
                isActive.value = false;
              }
            "
          >
            <template #title>
              <span>Označi korisnike</span>
              <VBadge
                color="primary-darken-3"
                :content="sizeUsersSelection"
                inline
                class="ms-1"
              />
            </template>
            <template #prepend>
              <Iconx
                size="1.22rem"
                icon="label-fill"
                class="opacity-20 mx-1 ms-2"
              />
            </template>
          </VToolbarPrimary>
        </VCardItem>
        <p
          v-if="displayNames"
          class="text-center font-italic mt-1 opacity-50 prose-sm"
        >
          {{ displayNames }}
        </p>
        <VCardText>
          <template v-if="someTagsIncluded">
            <div class="__spacer mt-3 d-flex items-center gap-2 flex-wrap">
              <VChipUserTag
                v-for="tag in tagsAppliedFromUsersShortened"
                :tag="tag"
                :key="tag"
                class="shrink-0"
                :handle-clear="() => handleOnClear(tag)"
              />
            </div>
          </template>
          <div class="__spacer px-4">
            <VTextField
              v-model="search"
              clearable
              center-affix
              single-line
              placeholder="Oznaka..."
              variant="underlined"
              color="primary"
            >
              <template #prepend-inner>
                <Iconx
                  size="1.33rem"
                  icon="label"
                  class="opacity-20 translate-y-px me-2"
                />
              </template>
            </VTextField>
          </div>
          <div class="__spacer d-flex items-center gap-2 flex-wrap mt-2">
            <VBtnUsersTagsAdd
              v-for="tag in tagsNotIncludedShortened"
              :tag="tag"
              :key="tag"
              :handle-add="() => handleOnAdd(tag)"
            />
          </div>
        </VCardText>
      </VCard>
    </template>
  </VDialog>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
