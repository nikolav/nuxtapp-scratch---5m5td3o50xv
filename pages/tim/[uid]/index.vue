<script setup lang="ts">
// ##imports
// import { Dump } from "@/components/dev";
import {
  VToolbarPrimary,
  VBtnTopicChatToggle,
  VBadgeUserAvailability,
  VAvatarProfileImage,
  VCardTitleSectionStart,
  VBtnShowLocation,
  VDataIteratorListData,
  ProvideUserGroups,
} from "@/components/app";

// ##config ##const
definePageMeta({
  middleware: "authorized",
  layout: "app-default",
});
// ##utils
const route = useRoute();
const { uid: UID } = route.params;
const { accountAttachments } = useTopics();
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const {
  // reload,
  loading,
  //
  uid,
  user,
  // profile,
  key: key$,
  firstName,
  lastName,
  phone,
  email,
  address,
  // displayLocation,
  displayName,
  chatChannel: topicChatChannel,
  avatarImage: avatar,
  job,
  // groups,
  employedAt,
} = useQueryUserData(UID);
const { attachments, size: attachmentsSize } = useFirebaseStorageAttachments({
  ID: uid,
  KEY: accountAttachments,
});
// ##computed
// ##forms ##helpers ##handlers
const itemTitle = (url: any) => urlFilename(url);
const itemUrl = identity;
// ##watch
// ##hooks:lifecycle
// ##head
useHead({ title: displayName });

// @@eos
</script>
<template>
  <section class="page--tim-uid">
    <VCard
      :disabled="loading"
      variant="text"
      rounded="0"
      elevation="0"
      flat
      class="pb-12 *overflow-visible"
    >
      <!-- :text="displayName" -->
      <VToolbarPrimary
        :props-title="{ class: 'font-italic text-body-1 text-start ps-0 ms-3' }"
        :props-actions="{ class: 'pe-2' }"
        route-back-name="tim"
      >
        <template #title>
          <span class="d-flex items-center gap-2">
            <VBadgeUserAvailability :uid="uid" />
            <VBtnShowLocation
              class="-translate-x-[3px]"
              color="on-primary"
              variant="text"
              :uid="uid"
            />
            <span>{{ displayName }}</span>
          </span>
        </template>
        <template #prepend>
          <Iconx size="1.122rem" icon="user" class="opacity-20 ms-1" />
        </template>
        <template #actions>
          <VBtnTopicChatToggle :topic="topicChatChannel" variant="text" />
          <VBtn :disabled="!(0 < attachmentsSize)" icon variant="plain">
            <VBadge
              color="primary-darken-2"
              :content="attachmentsSize"
              location="bottom end"
              offset-x="-5"
              offset-y="1"
              :model-value="0 < attachmentsSize"
            >
              <Iconx size="1.44rem" icon="folder-open-outline" />
            </VBadge>
            <VMenu activator="parent" location="bottom end" :offset="[-5, 0]">
              <VDataIteratorListData
                disabled-skeleton-loader
                :props-list="{
                  rounded: true,
                  density: 'compact',
                  variant: 'elevated',
                  elevation: '3',
                  class: 'py-0',
                  'max-width': 422,
                }"
                :show-select="false"
                :item-title="itemTitle"
                :item-url="itemUrl"
                :items="attachments"
                external
              />
            </VMenu>
          </VBtn>
        </template>
      </VToolbarPrimary>

      <!-- @@size:all-fields -->
      <div class="__spacer__all_fields max-w-[592px] mx-auto">
        <!-- @@field:groups -->
        <ProvideUserGroups v-if="user" :user="user" v-slot="{ groups }">
          <VCardText
            v-if="!isEmpty(groups)"
            class="__spacer d-inline-flex items-center flex-wrap gap-2"
          >
            <VChip
              v-for="g in groups"
              :to="{ name: 'aktiva-grupe-gid', params: { gid: g.id } }"
              elevation="1"
              color="info-darken-1"
              size="small"
              :key="g"
              :text="g.name"
            />
          </VCardText>
        </ProvideUserGroups>
        <VSpacer class="mt-5" />
        <VAvatarProfileImage
          :props-container="{ class: 'mx-auto' }"
          :image="avatar"
        />

        <!-- @@licne informacija -->
        <VSpacer class="mt-8" />
        <VCardTitleSectionStart
          :props-container="{ class: '*px-2' }"
          title="Lične informacije"
          class="border-b text-h6 opacity-40 text-center"
        ></VCardTitleSectionStart>
        <!-- @@fields -->
        <VCardText class="__spacer __RIC06yTf *space-y-0">
          <!-- @@field:fullname -->
          <template v-if="firstName || lastName">
            <VTextField
              class="fullname"
              variant="plain"
              readonly
              label="Ime i prezime"
              :model-value="[firstName, lastName].filter(Boolean).join(' ')"
            >
            </VTextField>
          </template>
          <!-- @@field:phone -->
          <template v-if="phone">
            <VTextField
              type="tel"
              class="phone"
              variant="plain"
              readonly
              label="Telefon"
              :model-value="phone"
            >
            </VTextField>
          </template>
          <!-- @@field:email -->
          <template v-if="email">
            <VTextField
              type="email"
              class="email"
              variant="plain"
              readonly
              label="Email"
              :model-value="email"
            >
            </VTextField>
          </template>
          <!-- @@field:address -->
          <template v-if="address">
            <VTextField
              class="address"
              variant="plain"
              readonly
              label="Adresa stanovanja"
              :model-value="startCase(address)"
            >
            </VTextField>
          </template>
        </VCardText>

        <!-- @@poslovne informacija -->
        <VSpacer class="mt-8" />
        <VCardTitleSectionStart
          :props-container="{ class: '*px-2' }"
          title="Poslovne informacije"
          class="border-b text-h6 opacity-40 text-center"
        ></VCardTitleSectionStart>
        <VCardText class="__spacer __RIC06yTf *space-y-0">
          <!-- @@field:job -->
          <template v-if="job">
            <VTextField
              class="job"
              variant="plain"
              readonly
              label="Naziv radnog mesta"
              :model-value="startCase(job)"
            >
            </VTextField>
          </template>
          <!-- @@field:employedAt -->
          <template v-if="employedAt">
            <VTextField
              class="employedAt"
              variant="plain"
              readonly
              label="Datum zaposlenja"
              :model-value="employedAt.local().format('D. MMMM YYYY.')"
            >
            </VTextField>
          </template>

          <!-- @@field:key -->
          <template v-if="key$">
            <VTextField
              :model-value="key$"
              disabled
              readonly
              variant="plain"
              label="Ključ"
              class="key"
            >
            </VTextField>
          </template>
        </VCardText>
      </div>
      <VSpacer class="mt-12" />
      <VCardActions>
        <VSpacer />
        <div class="opacity-40">
          <pre>&nbsp;•&nbsp;</pre>
        </div>
        <VSpacer />
      </VCardActions>
    </VCard>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.__RIC06yTf {
  .v-field__input {
    font-size: 133%;
    padding-inline-start: 0.5rem;
  }
  .key .v-field__input {
    font-size: 100%;
  }
}
</style>
