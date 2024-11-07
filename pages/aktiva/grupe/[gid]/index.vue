<script setup lang="ts">
// ##imports
import {
  VImgPickerSingle,
  VSnackbarSuccess,
  VBtnSave,
  VBtnReset,
} from "@/components/app";
// ##config ##props ##const
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
const attrs = useAttrs();
const {
  app: { DEFAULT_TRANSITION },
  db: {
    Assets: {
      categories: { CATEGORY_KEY_ASSETS_prefix },
    },
  },
} = useAppConfig();
// ##utils
const {
  groups: { categories_select_menu },
} = useCategoryAssets();
const psUpsert = useProcessMonitor();
const { firebasePathAssetsAvatars } = useTopics();
const { watchProcessing } = useStoreAppProcessing();
// ##icons
// ##refs ##flags
const ref_SreFtqedZsqOqer = ref();
const avatarImagePicked = ref();
const resetImageKEY = useUniqueId();
const toggleAssetUpdateSuccess = useToggleFlag();
// ##data ##auth ##state
const { commit } = useQueryManageAssetsGroups();
// ##computed
const routeData = computed(() => get(attrs, "route-data", <any>{}));
const g = computed(() => routeData.value?.g);
const gid = computed(() => routeData.value?.gid);
const gname = computed(() => routeData.value?.gname);
const { avatarImage, reload: avatarReload } =
  useFirebaseStorageAssetsGroupAvatar(gid);
const { upload: fbsAvatarUpload } = useFirebaseStorage(() =>
  firebasePathAssetsAvatars(gid.value)
);
const { width: WSELECT } = useElementSize(ref_SreFtqedZsqOqer);
// ##forms ##helpers ##handlers
const FIELDS = <Record<string, any>>{
  name: {
    label: "Naziv grupe",
    icon: {
      name: "tag",
      size: "1.122rem",
    },
    required: true,
  },
  location: {
    label: "Lokacija",
    icon: {
      name: "location",
      size: "1.122rem",
    },
  },
  category: {
    type: "select",
    label: "Region",
    icon: {
      name: "folder",
      size: ".88rem",
    },
    required: true,
    resolve: () => {
      const c = find(g.value?.tags, (tag: string) =>
        tag.startsWith(CATEGORY_KEY_ASSETS_prefix)
      );
      return c && matchAfterLastColon(c);
    },
  },
  notes: {
    type: "textarea",
    label: "Opis",
    icon: {
      name: "$edit",
      size: "1.122rem",
    },
  },
};
// default field getter [field|path]
const fieldResolveDefault = (path: any) => get(g.value, path);
// pull cached fields
const fieldsResetFromStore = (form: any) => {
  each(FIELDS, (item: any, field: string) => {
    form[field].value = (item.resolve || fieldResolveDefault)(
      item.path || field
    );
  });
};
// compare cached and current form fields
const fieldsDirty = (form: any) =>
  transform(
    FIELDS,
    (d: any, item: any, field: string) => {
      const val = form[field].value;
      if (val != (item.resolve || fieldResolveDefault)(item.path || field)) {
        d[field] = val;
      }
      return d;
    },
    <any>{}
  );
const fieldsKeysTrue = reduce(
  keys(FIELDS),
  (res: any, field: string) => {
    res[field] = true;
    return res;
  },
  <any>{}
);
const FIELDS_RECORD = ["name", "location", "notes"];
const FIELDS_RECORD_wcategory = [...FIELDS_RECORD, "category"];

const { form, submit, clear } = useFormDataFields(
  `3b30bb0c-10bb-5161-8fc9-675759a600a5:${gname.value}`,
  fieldsKeysTrue,
  {
    onSubmit: async () => {
      let hasChanges_: boolean;
      try {
        psUpsert.begin();
        const fdirty = fieldsDirty(form);
        const isDirty = !isEmpty(fdirty);
        const imagePicked = null != avatarImagePicked.value;
        hasChanges_ = isDirty || imagePicked;
        if (isDirty) {
          const d = {
            ...pick(fdirty, FIELDS_RECORD_wcategory),
            data: omit(fdirty, FIELDS_RECORD_wcategory),
          };
          const res = await commit(d, gid.value);
          if (!get(res, "data.assetsUpsert.status.asset.id"))
            throw "--no-asset-update";
        }
        if (imagePicked) {
          if (
            !get(
              await fbsAvatarUpload({
                avatarImage: {
                  file: avatarImagePicked.value.file,
                  name: "avatarImage",
                },
              }),
              "0.avatarImage"
            )
          )
            throw "--avatar-upload-failed";
        }
      } catch (error) {
        psUpsert.setError(error);
      } finally {
        psUpsert.done();
      }
      if (!psUpsert.error.value)
        psUpsert.successful(() => {
          if (hasChanges_) toggleAssetUpdateSuccess.on();
        });
    },
  }
);
const formReset = () => {
  // clear();
  fieldsResetFromStore(form);
  resetImageKEY();
};

// ##watch
watch(toggleAssetUpdateSuccess.isActive, async (isActive) => {
  if (isActive) {
    await avatarReload();
  }
});
// ##hooks:lifecycle
useOnceMountedOn(g, () => fieldsResetFromStore(form));
watchProcessing(psUpsert.processing);
// ##head ##meta
// ##provide
useHead({ title: gname });

// @@eos
</script>
<template>
  <section class="page--aktiva-grupe-gid-index">
    <VSnackbarSuccess v-model="toggleAssetUpdateSuccess.isActive.value">
      <p>Grupa je uspešno ažurirana.</p>
    </VSnackbarSuccess>
    <VForm @submit.prevent="submit" autocomplete="off">
      <VCard variant="text" rounded="0">
        <div class="__spacer d-flex justify-center mt-3">
          <VImgPickerSingle
            v-model="avatarImagePicked"
            :props-container="{
              width: 192,
              height: 192,
              class: 'mx-auto mt-5',
            }"
            rounded="circle"
            :default-no-image="avatarImage"
            :btn-size-percent="0.33"
            :reset-id="resetImageKEY.ID.value"
          />
        </div>
        <VCardText>
          <div class="__spacer" ref="ref_SreFtqedZsqOqer">
            <template v-for="(item, field) in FIELDS" :key="field">
              <VTextField
                v-if="!item?.type"
                v-model="form[field].value"
                variant="underlined"
                :name="field"
                clearable
              >
                <template #label>
                  <span>{{ item.label }}</span>
                  <span v-if="item.required" class="text-error">&nbsp;*</span>
                </template>
                <template #prepend-inner>
                  <Iconx
                    :size="item.icon.size"
                    class="opacity-20 translate-y-[2px] me-1"
                    :icon="item.icon.name"
                  />
                </template>
              </VTextField>
              <VSelect
                v-else-if="'select' == item?.type"
                v-model="form[field].value"
                class="px-5 mt-3"
                rounded="pill"
                variant="solo-filled"
                :items="categories_select_menu"
                :transition="DEFAULT_TRANSITION"
                :menu-props="{
                  location: 'center',
                  width: WSELECT,
                }"
                :list-props="{
                  class: 'py-0',
                }"
              >
                <template #label>
                  <span class="d-flex items-center">
                    <Iconx
                      :size="item.icon.size"
                      class="opacity-50 me-2"
                      :icon="item.icon.name"
                    />
                    <span>{{ item.label }}</span>
                    <span v-if="item.required" class="text-error">&nbsp;*</span>
                  </span>
                </template>
                <template #prepend-inner>
                  <pre class="__spacer me-2" />
                </template>
              </VSelect>
              <VTextarea
                v-if="'textarea' == item?.type"
                v-model.trim="form[field].value"
                clearable
                variant="underlined"
                :label="item.label"
                rows="4"
              >
                <template #prepend-inner>
                  <Iconx
                    :icon="item.icon.name"
                    :size="item.icon.size"
                    class="opacity-20 me-1 translate-y-[2px]"
                  />
                </template>
              </VTextarea>
            </template>
          </div>
        </VCardText>
        <VCardActions class="mt-3 mb-10">
          <VSpacer />
          <VBtnReset
            @click="formReset"
            :props-icon="{ class: 'me-2', size: '1.33rem' }"
          />
          <VSpacer />
          <VBtnSave type="submit" :props-icon="{ size: '1.33rem' }" />
          <VSpacer />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
