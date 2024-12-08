<script setup lang="ts">
import { type Dayjs } from "dayjs";
import type { OrNoValue } from "@/types";
import {
  VSheetPinCodeRequired,
  VBtnUpdateProfileImage,
  VSelectAvailabilityPicker,
  // VBtnTopicChatToggle,
  VBtnDatePicker,
  ProvideAssetsGroupAvatar,
} from "@/components/app";

definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();

const auth = useStoreApiAuth();
const emailVerified = computed(() => get(auth.user$, "email_verified"));
const displayLocation$ = computed(() =>
  get(auth.user$, "profile.displayLocation")
);
const email$ = computed(() => get(auth.user$, "email"));
const key$ = computed(() => get(auth.user$, "key"));
const ugroups$ = computed(() => get(auth.user$, "groups", []));

const FIELDS = [
  // @@.1
  "firstName",
  "lastName",
  "phone",
  "address",
  "displayName",
  "displayLocation",
  // @@.2
  "job",
  "employed_at",
];
const toggleDisplayLocation = useToggleFlag(!!displayLocation$.value);
const {
  profilePatch,
  emailSendVerifyLink,
  passwordSendResetLink,
  drop: accountDrop,
  processing: formProcessing,
} = useMutationAccountsManage();
const accountDropHardLogout = () =>
  accountDrop(auth.uid).then(() => reloadNuxtApp({ path: "/", ttl: 1 }));
const { form, submit, valid } = useFormDataFields(
  "tLgA7XGp8",

  // { [field: string]: active:boolean }
  FIELDS.reduce((accum, field) => {
    accum[field] = true;
    return accum;
  }, <any>{}),

  {
    onSubmit: async (data: any) => {
      // console.log({ data });
      // return;
      const patch = transform(
        data,
        (accum: any, value: any, field: string) => {
          if (null != value) {
            if ("displayLocation" == field) {
              accum["displayLocation"] = toggleDisplayLocation.isActive.value
                ? value
                : "";
            } else if ("employed_at" == field) {
              // commit:date.utc
              accum["employed_at"] = (<OrNoValue<Dayjs>>value)?.format() || "";
            } else {
              accum[String(field)] = value;
            }
          }
        },
        <any>{}
      );
      // return console.log({ patch });
      // store:commit
      if (!isEmpty(patch)) await profilePatch(auth.uid, patch);
    },
  }
);

// @utils
const { $dd } = useNuxtApp();
// store:pull
const restoreFormFieldsFromStore = () => {
  FIELDS.forEach((field) => {
    const val = get(auth.profile, field);
    form[field].value =
      "employed_at" != field ? val : val ? $dd.utc(val) : undefined;
  });
};

// @watch
onMounted(() => {
  watch(
    () => auth.profile,
    (profile) => {
      if (profile) restoreFormFieldsFromStore();
    },
    {
      immediate: true,
    }
  );
});

// @@eos
</script>
<template>
  <section class="page--nalog-index">
    <VForm @submit.prevent="submit" autocomplete="off">
      <VCard rounded="0" variant="text">
        <VCardText class="max-w-[345px] mx-auto">
          <span
            v-if="!isEmpty(ugroups$)"
            class="d-flex items-center g-2 flex-wrap"
          >
            <!-- @@ -->
            <template v-for="ug in ugroups$" :key="ug.name">
              <ProvideAssetsGroupAvatar :gid="ug.id" v-slot="{ avatarImage }">
                <VChip
                  link
                  :to="{ name: 'aktiva-grupe-gid', params: { gid: ug.id } }"
                  elevation="1"
                  color="info"
                  :prepend-avatar="avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
                  size="large"
                >
                  {{ ug.name }}
                </VChip>
              </ProvideAssetsGroupAvatar>
            </template>
          </span>
          <VSpacer class="mt-5" />
          <VRow justify="center" class="translate-y-1">
            <VBtnUpdateProfileImage />
          </VRow>
          <div class="__spacer space-y-3 mt-3">
            <VSpacer class="mt-9" />
            <!-- @@availability -->
            <VSelectAvailabilityPicker />

            <VTextField
              v-model="form.firstName.value"
              density="comfortable"
              label="Ime"
              variant="underlined"
            />
            <VTextField
              v-model="form.lastName.value"
              density="comfortable"
              label="Prezime"
              variant="underlined"
            />
            <VTextField
              v-model="form.phone.value"
              density="comfortable"
              label="Telefon"
              variant="underlined"
            />
            <VTextField
              disabled
              readonly
              :model-value="email$"
              density="comfortable"
              label="Email"
              variant="underlined"
            />
            <VTextField
              v-model="form.address.value"
              density="comfortable"
              label="Adresa stanovanja"
              variant="underlined"
            />
            <VTextField
              v-model="form.job.value"
              density="comfortable"
              label="Naziv radnog mesta"
              variant="underlined"
              hide-details
            />

            <VBtnDatePicker
              label="Datum zaposlenja"
              v-model="form.employed_at.value"
              :props-container="{ class: 'mt-8' }"
            />

            <VSpacer class="mt-8" />
            <VTextField
              v-model="form.displayName.value"
              density="comfortable"
              label="Korisničko ime"
              variant="underlined"
            />
            <VSpacer class="mt-2" />
            <VCheckboxBtn
              v-model="toggleDisplayLocation.isActive.value"
              label="Deli moju lokaciju"
              class="mx-auto"
              color="primary-darken-1"
            />
            <VSlideYReverseTransition>
              <VTextField
                v-if="toggleDisplayLocation.isActive.value"
                v-model="form.displayLocation.value"
                density="comfortable"
                variant="underlined"
                single-line
                placeholder="Lokacija"
                clearable
              >
              </VTextField>
            </VSlideYReverseTransition>
          </div>
          <VSpacer class="mt-6" />
          <VTextField
            disabled
            readonly
            :model-value="key$"
            density="comfortable"
            label="Ključ"
            variant="underlined"
          />
        </VCardText>

        <VCardActions class="justify-evenly max-w-[345px] mx-auto pt-5">
          <VBtn
            rounded="pill"
            variant="plain"
            color="secondary"
            @click="restoreFormFieldsFromStore"
          >
            <Icon size="1.22rem" name="jam:rubber" class="me-2 opacity-50" />
            <span>Poništi</span></VBtn
          >
          <VBtn
            :disabled="!valid || formProcessing"
            class="px-4"
            size="large"
            rounded="pill"
            variant="tonal"
            type="submit"
            elevation="1"
          >
            <Icon
              class="me-2 opacity-50"
              size="1.22rem"
              name="material-symbols:save"
            />
            <span>Sačvaj</span>
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
    <VDivider class="border-opacity-100 mt-12 w-[75%] mx-auto" />

    <div class="d-flex flex-col max-w-fit mx-auto space-y-5 pt-5 pb-12">
      <VBtn
        v-if="!emailVerified"
        @click="emailSendVerifyLink"
        size="large"
        variant="tonal"
        rounded="pill"
        class="px-5"
        color="info"
        elevation="1"
        >Potvrdi email</VBtn
      >
      <VSpacer class="mt-5" />
      <VBtn
        elevation="1"
        color="error"
        size="large"
        variant="tonal"
        rounded="pill"
        class="px-5"
      >
        <span>Promena lozinke</span>
        <VMenu
          :close-on-content-click="false"
          activator="parent"
          location="center"
        >
          <template #default="{ isActive }">
            <VSheetPinCodeRequired>
              <template #actions="{ pin, text }">
                <VBtn
                  @click="
                    passwordSendResetLink().then(() => {
                      isActive.value = false;
                    })
                  "
                  variant="tonal"
                  class="px-4"
                  rounded="pill"
                  size="large"
                  :disabled="pin != text"
                  elevation="1"
                >
                  <Icon
                    name="material-symbols:lock-reset-sharp"
                    size="1.78rem"
                    class="me-2"
                  />
                  <span> Obnova lozinke </span>
                </VBtn>
              </template>
            </VSheetPinCodeRequired>
          </template>
        </VMenu>
      </VBtn>
      <VDivider class="mt-10" />
      <VBtn
        size="large"
        class="px-5 !scale-[85%] opacity-60 *text-none"
        color="error"
        rounded="pill"
      >
        <span> Brisanje naloga </span>
        <VMenu
          activator="parent"
          location="center"
          :close-on-content-click="false"
        >
          <template #default>
            <VSheetPinCodeRequired message="Pin za brisaje naloga:">
              <template #actions="{ pin, text }">
                <VBtn
                  @click="accountDropHardLogout"
                  color="error"
                  class="px-4"
                  rounded="pill"
                  size="large"
                  :disabled="pin != text"
                >
                  <Icon
                    size="1.55rem"
                    class="me-2 -translate-y-[2px]"
                    name="material-symbols:delete"
                  />
                  <span>Obriši nalog</span>
                </VBtn>
              </template>
            </VSheetPinCodeRequired>
          </template>
        </VMenu>
      </VBtn>
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
