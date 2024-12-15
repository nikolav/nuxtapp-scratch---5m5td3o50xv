<script setup lang="ts">
// ##notes
// updates
//   name, code, barcode, link, notes, images
// ##imports
import { useDisplay } from "vuetify";
import {
  VToolbarPrimary,
  // VImgImagesPicker,
  VImgImagesPickerDefaut,
  VSnackbarSuccess,
  VBtnSave,
  VBtnReset,
  VSheetPinCodeRequired,
} from "@/components/app";

// ##config
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});
useHead({ title: "Ažuriraj proizvod" });
const IMAGE_PICKER_SIZE_MAX = {
  h: 255,
  w: 320,
};
const {
  app: { DEFAULT_TRANSITION, TOOLTIPS_OPEN_DELAY },
  db: {
    Assets: {
      categories: { CATEGORY_KEY_ASSETS_prefix },
    },
  },
} = useAppConfig();
const ON_DELETE_REDIRECT_TIMEOUT = 3122;
// ##utils
const { resized } = useResizeImage();
const { categories_select_menu } = useCategoryAssets();
const { mdAndUp } = useDisplay();
const route = useRoute();
const { file } = useFetchUrlToFileData();
const { firebasePathAssets } = useTopics();
const pc = useProcessMonitor();
const pc_rm = useProcessMonitor();
const { watchProcessing } = useStoreAppProcessing();
// ##icons
// ##refs ##flags
const ref_zi0LBpIF30d1BHKk = ref();
const { width: WSIZER } = useElementSize(ref_zi0LBpIF30d1BHKk);
const newProductImagesPicked = ref();
const imagesUpdated = ref();
const pid = computed(() => get(route.params, "pid"));
const toggleUpdateSuccess = useToggleFlag();
const toggleAssetRemovedSuccess = useToggleFlag();
const toggleDeletePromptActive = useToggleFlag();
// ##state ##auth ##data
// const auth = useStoreApiAuth();
const {
  ls,
  url,
  rma: rmaDropAssetImages,
  upload,
} = useFirebaseStorage(() => firebasePathAssets(pid.value));
const {
  assets: products,
  commit,
  remove: assetsRemove,
} = useQueryManageAssetsProducts(() => [pid.value]);
const imagesOld = ref();

// ##computed
const p = computed(() => first(products.value));
// ##forms ##helpers
const FIELDS = <Record<string, any>>{
  name: {
    label: "Naziv *",
    icon: {
      name: "mdi:tag",
      size: "1.22rem",
    },
  },
  category: {
    resolve: (_path: any) => {
      const c = find(p.value?.tags, (t: string) =>
        t.startsWith(CATEGORY_KEY_ASSETS_prefix)
      );
      return c && matchAfterLastColon(c);
    },
    type: "select",
    label: "Robna grupa",
    icon: {
      name: "mdi:folder",
      size: ".82rem",
    },
  },
  code: {
    label: "Šifra",
    icon: {
      name: "ri:hashtag",
      size: "1rem",
    },
  },
  barcode: {
    path: "data.barcode",
    label: "Barkod",
    icon: {
      name: "material-symbols:barcode",
      size: "1rem",
    },
  },
  link: {
    path: "data.link",
    label: "Link",
    icon: {
      name: "material-symbols:link-rounded",
      size: "1rem",
    },
  },
  notes: {
    type: "textarea",
    label: "Opis",
    icon: {
      name: "$edit",
      size: "1rem",
    },
  },
};

const fieldResolveDefault = (path: any) => get(p.value, path);
const fieldsResetFromStore = () => {
  each(FIELDS, (item: any, field: string) => {
    form[field].value = (item.resolve || fieldResolveDefault)(
      item.path || field
    );
  });
};

const { form, submit: formSubmit } = useFormDataFields(
  `fS2V1LZ9HE8PX1gNMq --${pid.value}`,
  reduce(
    keys(FIELDS),
    (res: any, field: string) => {
      res[field] = true;
      return res;
    },
    <any>{}
  ),
  {
    dump: null,
    schema: null,
    onSubmit: async () => {
      pc.begin(toggleUpdateSuccess.off);
      try {
        const dd = diffDump();
        if (isEmpty(dd) && !imagesUpdated.value) throw "--no-updates";

        if (!isEmpty(dd)) {
          if (
            // throw if no ID
            !get(
              await commit(dd, pid.value),
              "data.assetsUpsert.status.asset.id"
            )
          )
            throw "--no-upserts";
        }

        if (imagesUpdated.value) {
          // clear all, upload new
          await rmaDropAssetImages();
          await upload(
            reduce(
              await Promise.all(
                map(newProductImagesPicked.value, async (node: any) =>
                  blobToFile(await resized(node.file), node.file.name)
                )
              ),
              (d: any, file: any) => {
                if (file) {
                  d[file.name] = { file };
                }
                return d;
              },
              <any>{}
            )
          );
        }
      } catch (error) {
        pc.setError(error);
      } finally {
        pc.done(() => {
          // reset sending the same image again on repeated posts
          imagesUpdated.value = undefined;
        });
      }
      if (!pc.error.value) pc.successful(toggleUpdateSuccess.on);
    },
  }
);
// dump fields updated
const diffDump = () =>
  reduce(
    FIELDS,
    (d: any, item: any, field: string) => {
      const path = item.path || field;
      const newValue = form[field].value;
      if (newValue != (item.resolve || fieldResolveDefault)(path)) {
        set(d, path, newValue);
      }
      return d;
    },
    <any>{}
  );
// ##watch
watchProcessing(pc.processing);
watchProcessing(pc_rm.processing);
const $$pidRemoved = useGlobalVariable("$$pidRemoved");
watch(pc_rm.success, (rmSuccess: boolean) => {
  if (!rmSuccess) return;
  toggleAssetRemovedSuccess.on();
  toggleDeletePromptActive.off();
  $$pidRemoved.value = pid.value;
  setTimeout(
    () => navigateTo({ name: "aktiva-proizvodi" }),
    ON_DELETE_REDIRECT_TIMEOUT
  );
});
// ##hooks:lifecycle
// init asset:images
useOnceMountedOn(true, async () => {
  imagesOld.value = await Promise.all(
    map(await ls(), async (node: any) => await url(node.name))
  );
  // newProductImagesPicked.value = await Promise.all(
  //   map(await ls(), async (node: any) => {
  //     const f = await file(await url(node.name), node.name);
  //     console.log("@DEBUG:newProductImagesPicked:onMounted", { f });
  //     return {
  //       file: f,
  //       dataurl: await dataUrl(<File>f),
  //     };
  //   })
  // );
});
// init asset:fields
useOnceMountedOn(p, fieldsResetFromStore);
// ##handlers
const onUpdateModelValuePicker = (args: any[]) => {
  imagesUpdated.value = !isEmpty(args);
};
const onAssetRemove = async (pinEqText: boolean) => {
  // @click="pin == text && assetsRemove([p?.id])"
  if (!p.value?.id || !pinEqText) return;
  pc_rm.begin();
  try {
    if (
      !get(await assetsRemove([p.value.id]), "data.assetsRemove.status.removed")
    )
      throw "!--asset-rm";
    await rmaDropAssetImages();
  } catch (error) {
    pc_rm.setError(error);
  } finally {
    pc_rm.done();
  }
  if (!pc_rm.error.value) pc_rm.successful();
};

// @@eos
</script>
<template>
  <section class="page--aktiva-proizvodi-uredi-pid">
    <VSnackbarSuccess v-model="toggleUpdateSuccess.isActive.value">
      <span>Proizvod je uspešno ažuriran.</span>
    </VSnackbarSuccess>
    <VSnackbarSuccess v-model="toggleAssetRemovedSuccess.isActive.value">
      <span>Proizvod je uspešno obrisan.</span>
    </VSnackbarSuccess>
    <VForm @submit.prevent="formSubmit" autocomplete="off">
      <VCard variant="text" rounded="0">
        <!-- @@toolbar:primary -->
        <VToolbarPrimary
          :props-title="{ class: 'font-italic text-body-1' }"
          text="Ažuriraj proizvod"
        >
          <template #prepend>
            <Iconx
              size="1.22rem"
              class="opacity-40 ms-1"
              icon="$iconBox3DEdit"
            />
          </template>
          <template #actions>
            <VBtn
              @click.stop.prevent
              icon
              variant="plain"
              color="on-primary"
              density="comfortable"
              class="me-1"
            >
              <VTooltip
                location="bottom"
                activator="parent"
                :open-delay="TOOLTIPS_OPEN_DELAY"
                text="Obriši proizvod"
              />
              <Iconx
                icon="mdi:trash-can"
                size="1.25rem"
                class="*opacity-40 *text-on-primary"
              />
              <VMenu
                v-model="toggleDeletePromptActive.isActive.value"
                location="bottom end"
                activator="parent"
                :close-on-content-click="false"
                :transition="DEFAULT_TRANSITION"
                :offset="-8"
              >
                <VSheetPinCodeRequired
                  message="Pin za brisanje proizvoda:"
                  :props-actions="{ class: 'flex-col !gap-3' }"
                >
                  <template #actions="{ pin, text }">
                    <VBtn
                      @click="onAssetRemove(pin == text)"
                      :disabled="text != pin"
                      color="error"
                      variant="tonal"
                      rounded="pill"
                      class="px-3"
                    >
                      <template #prepend>
                        <Iconx size="1.22rem" icon="mdi:trash-can" />
                      </template>
                      <span>Obriši proizvod</span>
                    </VBtn>
                    <em
                      class="text-error"
                      :class="[text != pin ? 'opacity-20' : undefined]"
                      >{{ p?.name }}</em
                    >
                  </template>
                </VSheetPinCodeRequired>
              </VMenu>
            </VBtn>
          </template>
        </VToolbarPrimary>
        <VCardText>
          <VContainer max-width="892">
            <VRow>
              <VCol md="6">
                <!-- @@picker -->
                <VImgImagesPickerDefaut
                  v-model="newProductImagesPicked"
                  @update:model-value="onUpdateModelValuePicker"
                  :default-images="imagesOld"
                  :props-container="{
                    height: IMAGE_PICKER_SIZE_MAX.h,
                    maxWidth: IMAGE_PICKER_SIZE_MAX.w,
                    class: 'mx-auto',
                  }"
                  :height="IMAGE_PICKER_SIZE_MAX.h - 4"
                  :max-width="IMAGE_PICKER_SIZE_MAX.w"
                />
              </VCol>
              <VCol md="6">
                <!-- @@fields -->
                <!-- name, code, barcode, link, notes, images -->
                <div
                  ref="ref_zi0LBpIF30d1BHKk"
                  class="__placer max-w-[512px] mx-auto"
                  :class="[mdAndUp ? undefined : 'mt-5']"
                >
                  <template v-for="(item, field) in FIELDS" :key="field">
                    <VTextField
                      v-if="!item?.type"
                      v-model="form[field].value"
                      :label="item.label"
                      variant="underlined"
                      :name="field"
                    >
                      <template v-if="item.icon" #prepend-inner>
                        <Iconx
                          :size="item.icon.size"
                          class="opacity-20 me-2 translate-y-[2px]"
                          :icon="item.icon.name"
                        />
                      </template>
                    </VTextField>
                    <VTextarea
                      v-else-if="'textarea' == item.type"
                      v-model="form[field].value"
                      :label="item.label"
                      variant="underlined"
                      :name="field"
                      rows="4"
                    >
                      <template v-if="item.icon" #prepend-inner>
                        <Iconx
                          :size="item.icon.size"
                          class="opacity-20 me-2 translate-y-1"
                          :icon="item.icon.name"
                        />
                      </template>
                    </VTextarea>
                    <VSelect
                      v-else-if="'select' == item.type"
                      v-model="form[field].value"
                      class="px-5 mt-1"
                      rounded="pill"
                      variant="solo-filled"
                      :items="categories_select_menu"
                      :transition="DEFAULT_TRANSITION"
                      :menu-props="{
                        location: 'center',
                        width: WSIZER,
                      }"
                      :list-props="{
                        class: 'py-0',
                        density: 'compact',
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
                          <span class="text-error">&nbsp;*</span>
                        </span>
                      </template>
                      <template #prepend-inner>
                        <pre class="__spacer me-2" />
                      </template>
                    </VSelect>
                  </template>
                  <!-- @@ -->
                  <VSpacer class="mt-5" />
                  <VTextField
                    disabled
                    readonly
                    variant="plain"
                    :model-value="p?.key"
                    label="Ključ"
                  >
                    <template #prepend-inner>
                      <Iconx
                        icon="hashtag"
                        size="1rem"
                        class="opacity-50 translate-y-[.122rem] me-[.22rem]"
                      />
                    </template>
                  </VTextField>
                  <VCardActions class="justify-around pa-5 mt-5">
                    <VBtnReset
                      @click="fieldsResetFromStore"
                      :props-icon="{ class: 'me-2' }"
                    />
                    <VBtnSave type="submit" :disabled="pc.processing.value" />
                  </VCardActions>
                </div>
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
