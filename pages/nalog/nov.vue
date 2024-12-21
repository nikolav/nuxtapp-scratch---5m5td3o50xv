<script setup lang="ts">
// b343b50d-de03-50c4-a420-84add7c5ee07
import {
  schemaAuthAccount,
  schemaAuthCredentialsWithPolicies,
} from "@/schemas";
import {
  VSnackbarMain,
  VSheetPinCodeRequired,
  VToolbarPrimary,
} from "@/components/app";

definePageMeta({
  middleware: "authorized",
  layout: "app-default",
});

const {
  // layout: { toolbarMainHeight },
  app: {
    // TOOLTIPS_OPEN_DELAY,
    DEFAULT_TRANSITION,
  },
} = useAppConfig();

// @ref
const accountsAdded = ref();

// @data
const auth = useStoreApiAuth();
const { add: accountsAdd } = useMutationAccountsManage();

// @flags
const togglePasswordIsVisible = useToggleFlag();
const toggleAccountCreated = useToggleFlag();

// @utils
const {
  form,
  valid,
  submit: submitAccountAdd,
  clear: formClear,
} = useFormDataFields(
  "l6xX6SYHp3UZRMnuW4q5",
  {
    email: true,
    password: true,
    policies: true,
  },
  {
    schema: schemaAuthCredentialsWithPolicies,
    onSubmit: async (data: any) => {
      try {
        accountsAdded.value = schemaAuthAccount.parse(
          get(await accountsAdd(data), "data.accountsAdd.status.account")
        );
      } catch (error) {
        accountsAdded.value = null;
        console.error(error);
      }
    },
  }
);

// measure select .width
const ref_vCdrsAnOe = ref();
const select_el$ = useComponentEl(ref_vCdrsAnOe);
const { width: WS } = useElementSize(select_el$);

// @watch
onMounted(() => {
  watch(accountsAdded, (account: any) => {
    if (!account) return;
    toggleAccountCreated.on();
    formClear();
  });
});

// @handlers

// @@eos
</script>
<template>
  <section class="page--nalog-nov">
    <VSnackbarMain
      v-model="toggleAccountCreated.isActive.value"
      id="ID--5fA7vgMWtjbmH"
      color="success-darken-1"
    >
      Nalog je uspešno sačuvan.
    </VSnackbarMain>
    <VForm @submit.prevent autocomplete="off">
      <VCard rounded="t-0" variant="text">
        <VToolbarPrimary
          :props-title="{ class: 'text-body-1 font-italic' }"
          route-back-name="tim"
          text="Nov korisnički nalog"
        >
          <template #prepend>
            <Iconx icon="user-add" class="opacity-20 ms-2" size="1.22rem" />
          </template>
        </VToolbarPrimary>
        <VCardText class="mt-2 max-w-[492px] mx-auto">
          <!-- @@eamil -->
          <VTextField
            rounded="pill"
            v-model.trim="form.email.value"
            variant="solo-filled"
            label="Email *"
            placeholder="korisnik@email.com"
            clearable
            single-line
            autofocus
          >
            <template #prepend-inner>
              <span class="ps-2" />
            </template>
          </VTextField>
          <!-- @@lozinka -->
          <VTextField
            rounded="pill"
            v-model="form.password.value"
            variant="solo-filled"
            label="Lozinka *"
            :type="togglePasswordIsVisible.isActive.value ? 'text' : 'password'"
            clearable
            single-line
          >
            <template #prepend-inner>
              <span class="ps-2" />
            </template>
            <template #append-inner>
              <VBtn
                color="secondary"
                @click="togglePasswordIsVisible"
                icon
                variant="plain"
                density="comfortable"
              >
                <Iconx
                  size="1.22rem"
                  :icon="
                    togglePasswordIsVisible.isActive.value ? 'eye' : 'eye-off'
                  "
                />
              </VBtn>
            </template>
          </VTextField>
          <VSelect
            ref="ref_vCdrsAnOe"
            v-model="form.policies.value"
            center-affix
            label="Tip"
            closable-chips
            single-line
            chips
            rounded="pill"
            color="primary"
            variant="solo-filled"
            multiple
            clearable
            :list-props="{ class: 'py-0' }"
            :menu-props="{
              location: 'center',
              transition: DEFAULT_TRANSITION,
              width: WS,
            }"
            :items="[
              {
                title: 'Administrator',
                value: 'admin',
                props: {
                  disabled: !auth.isAdmin$,
                },
              },
              {
                title: 'Spoljni kontakt',
                value: 'external',
              },
            ]"
          >
            <template #prepend-inner>
              <span class="ps-2" />
            </template>
            <template #chip="{ item, props: props_ }">
              <VChip
                color="primary-darken-2"
                :text="item.raw.title"
                :value="item.raw.value"
                v-bind="props_"
              />
            </template>
          </VSelect>
        </VCardText>
        <VCardActions class="justify-center">
          <VBtn
            :disabled="!valid"
            class="px-5"
            rounded="pill"
            size="x-large"
            variant="elevated"
          >
            <VIcon start icon="$plus" class="opacity-50" size="large" />
            <span>Nov Nalog</span>
            <VMenu
              :close-on-content-click="false"
              activator="parent"
              location="center"
              v-slot="{ isActive }"
            >
              <VSheetPinCodeRequired message="Pin za aktivaciju naloga:">
                <template #actions="{ pin, text }">
                  <VBtn
                    type="submit"
                    @click="
                      submitAccountAdd().then(() => {
                        isActive.value = false;
                      })
                    "
                    class="px-4"
                    rounded="pill"
                    variant="elevated"
                    size="large"
                    :disabled="pin != text"
                  >
                    <Iconx
                      icon="user-add"
                      size="1.22rem"
                      class="me-2 opacity-50"
                    />
                    <span>Aktiviraj Nalog</span>
                  </VBtn>
                </template>
              </VSheetPinCodeRequired>
            </VMenu>
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style lang="scss">
#ID--5fA7vgMWtjbmH .v-list-item__spacer {
  width: 1rem !important;
}
</style>
