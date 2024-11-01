<script setup lang="ts">
// ##imports
import { useDisplay } from "vuetify";
import type { IUser, OrNoValue } from "@/types";
import { VToolbarPrimary } from "@/components/app";
// ##config ##const
const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();
// ##utils
const { smAndUp } = useDisplay();
// ##icons
// ##refs ##flags
const mIsActive = defineModel<boolean>();
const mSelectionUsers = defineModel<OrNoValue<IUser[]>>("users");
// ##data ##auth ##state
const { commit: tagsCommit, getUserTags } = useMutationUsersTags();
// ##computed
const isEmptyModelUsers = computed(() => isEmpty(mSelectionUsers));
// ##forms ##helpers ##handlers
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
    max-width="612"
    class="component--VDialogManageUserTags"
    location="center center"
  >
    <template #default="{ isActive }">
      <VCard class="pa-0">
        <VCardItem class="pa-0">
          <VToolbarPrimary
            :props-title="{ class: 'font-italic text-body-1' }"
            :on-close="
              () => {
                isActive.value = false;
              }
            "
            text="Označi korisnike"
          >
            <template #prepend>
              <Iconx size="1.22rem" icon="label" class="opacity-20 mx-1 ms-2" />
            </template>
          </VToolbarPrimary>
        </VCardItem>
        <VCardText>
          <p>
            {{ isActive }}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Mollitia
            saepe sapiente quia consectetur eaque inventore, exercitationem
            voluptatem ab eius ducimus sint cupiditate a. Culpa iure dolore,
            facilis vel architecto molestiae.
          </p>
        </VCardText>
      </VCard>
    </template>
  </VDialog>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
