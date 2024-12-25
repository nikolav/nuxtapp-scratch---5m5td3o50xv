<script setup lang="ts">
// ##imports
import {
  VToolbarPrimary,
  VEmptyStateNoData,
  VFabMain,
  VBtnDotsMenuList,
  VDataIteratorListData,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const {
  app: { SEARCH_DEBOUNCE_DELAY_longer },
} = useAppConfig();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models

// {
//   strategy: "post_qstring",
//   args: {
//     q: "bax",
//   },
// }
const searchQ = useGlobalVariable("cb854abc-fb33-57fc-bc80-4c440a7c8bd6");
const searchText = useGlobalVariable("c7e36d6a-f175-52b4-881e-7624a5e90382");
const mContactsSelected = ref();
const signalIdDeselect = useUniqueId();
const contactsSearchStrategy = computed(() =>
  searchQ.value
    ? {
        strategy: "post_qstring",
        args: {
          q: searchQ.value,
          limit: 5,
        },
      }
    : undefined
);
// ##data ##auth ##state
const { contacts, reload } = useDocsContacts(contactsSearchStrategy);
// ##computed
const someSelected = computed(() => !isEmpty(mContactsSelected.value));
const size_ = computed(() => len(contacts.value) || 0);
// ##forms ##handlers ##helpers ##small-utils
const contactsSetSelectionNone = signalIdDeselect;
// ##watch
watch(
  searchText,
  debounce((q: any) => {
    searchQ.value = q;
  }, SEARCH_DEBOUNCE_DELAY_longer)
);
watchEffect(() => {
  console.log("searchQ", searchQ.value);
});
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "📔 Kontakti" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--kontakti">
    <VToolbarPrimary
      text="Kontakti"
      :props-title="{ class: 'text-body-1 text-start font-italic ms-0 ps-2' }"
    >
      <template #append>
        <VBtnDotsMenuList
          :disabled="!someSelected"
          variant="text"
          :props-list="{ class: 'py-0 CLASS--VList-item-spacer-none' }"
          :props-icon="{ size: '1.5rem' }"
        >
          <template #list-items>
            <VListItem link>
              <template #prepend>
                <Iconx
                  icon="trash"
                  size="1.122rem"
                  class="text-error opacity-40"
                />
              </template>
              <VListItemTitle class="ms-0 ps-3">Obriši</VListItemTitle>
            </VListItem>
          </template>
        </VBtnDotsMenuList>
      </template>
      <template #title="{ text }">
        <VBadge
          inline
          :model-value="0 < size_"
          color="primary-darken-3"
          :content="size_"
        >
          <span class="me-1">
            {{ text }}
          </span>
        </VBadge>
      </template>
      <template #actions>
        <VBtn icon @click="reload" variant="plain">
          <Iconx icon="$loading" size="1.122rem" />
        </VBtn>
      </template>
      <template #prepend>
        <Iconx icon="notebook" size="1.22rem" class="opacity-20 ms-1" />
      </template>
    </VToolbarPrimary>
    <div class="__spacer px-2 pt-1">
      <VTextField
        v-model="searchText"
        hide-details
        variant="underlined"
        clearable
        single-line
        placeholder="Pretraga..."
      >
        <template #prepend-inner>
          <Iconx icon="user" size="1.122rem" class="opacity-20 mx-1 mt-px" />
        </template>
      </VTextField>
    </div>
    <VEmptyStateNoData v-if="isEmpty(contacts)" class="opacity-40" />
    <template v-else>
      <VSpacer class="mt-3" />
      <VDataIteratorListData
        v-model="mContactsSelected"
        :items="contacts"
        item-value="key"
        :item-title="(c) => startCase(get(c, 'data.name', ''))"
        :item-to="
          (c) => ({ name: 'kontakti-azuriraj-cid', params: { cid: toIds(c) } })
        "
        :props-list-item="{ class: 'ms-0 ps-1' }"
        :props-list-item-title="{ class: 'ps-2 text-body-1' }"
        :signal-id-deselect="signalIdDeselect.ID.value"
      />
    </template>
    <VFabMain :to="{ name: 'kontakti-nov' }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
