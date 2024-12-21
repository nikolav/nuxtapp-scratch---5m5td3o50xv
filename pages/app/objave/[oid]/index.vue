<script setup lang="ts">
// ##imports
import { z } from "zod";
import Quill from "quill";
import EE from "eventemitter3";
import {
  VToolbarPrimary,
  VBtnReset,
  VBtnSave,
  VImgImagesPickerDefaut,
  VDialogPrimary,
  VTextFieldPromptBasic,
  VSnackbarMain,
} from "@/components/app";
import type { IConfigFields } from "@/types";

// ##config:const
const DEFAULT_imagePickerHeight = 192;
// ##config ##props ##route ##attrs
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    appBarTitle: "Objava",
  },
});

const attrs = useAttrs();
const post = computed(() => get(attrs, "route-data.post"));
const pageTitle = computed(() => `📃 ${post.value?.name}`);
const oid = computed(() => post.value?.id);
// ##schemas
// ##utils
const { resized } = useResizeImage();
const ps = useProcessMonitor();
const ee$ = ref();
const colors_ = listColorWheel(19, 0.34);
// ##icons
// ##refs ##flags ##models
const togglePostUpdateSuccess = useToggleFlag();
const ref_2GPo2 = ref();
const togglePostContentActive = useToggleFlag();
const signalIdReset = useUniqueId();
const imagesPicked = ref();
// ##data ##auth ##state
const client = useQueryManageAssetsPosts(
  () => 0,
  false,
  () => ({
    enabled: !!oid.value,
  })
);
const clientStorage = useFirebaseStorageAssetImages(() => post.value?.key);
// ##computed
const postImages = computed(() => clientStorage.images.value);
// ##forms ##handlers ##helpers ##small-utils
const FIELDS = <Record<string, IConfigFields>>{
  name: {
    "@table:fields": true,
    required: true,
    label: "Naslov",
    icon: {
      icon: "tag",
      size: "1.122rem",
      class: "opacity-20 mx-1 mt-[2px]",
    },
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
  "images-picked": {
    type: "images-picked",
  },
  content: {
    path: "data.content",
    equals: (index: any, store: any) =>
      isEqual(JSON.parse(JSON.stringify(index?.data)), store?.data),
    "@table:data": true,
    type: "post-text",
    required: true,
    label: "Moj članak...",
    icon: {
      icon: "feather",
      size: "1.22rem",
      class: "opacity-20 mx-2 *mt-[2px]",
      props: {},
    },
    "append-inner-icon": {
      icon: "$expand",
      size: "1.22rem",
      class: "opacity-50 mx-1 mt-[2px]",
    },
    props: {
      variant: "underlined",
      // clearable: true,
      onFocus: togglePostContentActive.on,
      class: "pa-4",
    },
  },
};
const form = useFormModel("e79d7d31-c0a7-508b-b150-1f7d656f1937", FIELDS, {
  // schema: schemaInputPost,
  model: post,
  onSubmit: async (_data: any) => {
    try {
      ps.begin(togglePostUpdateSuccess.off);
      const hasImages_ = !isEmpty(imagesPicked.value);
      const updates_ = form.diff.value;
      if (!(!isEmpty(updates_) || hasImages_))
        throw "@error:posts:update:ccOvNTJpDTyd6";
      const patch = transform(
        updates_,
        (res: any, val: any, field: string) => {
          if (true === get(FIELDS, `${field}['@table:fields']`)) {
            res[field] = val;
          } else if (true === get(FIELDS, `${field}['@table:data']`)) {
            res.data = { content: val };
          }
          return res;
        },
        <any>{}
      );
      if (!isEmpty(patch)) {
        // commit patch --no-merge
        const res = await client.commit(patch, oid.value, false);
        if (!get(res, "data.assetsUpsert.status.asset.id"))
          throw "posts:update:error:2W7cIPc1D";
      }
      if (hasImages_) {
        // update post images @fbs; drop* old, put* new
        await clientStorage.rma();
        await clientStorage.uploadAll(
          await Promise.all(
            map(imagesPicked.value, async (node: any) =>
              blobToFile(await resized(node.file), node.file.name)
            )
          )
        );
      }
    } catch (error) {
      ps.setError(error);
    } finally {
      ps.done();
    }
    if (!ps.error.value) ps.successful(togglePostUpdateSuccess.on);
    console.debug("@debug:posts:update:XEhK3t", ps.error.value);
  },
});
const defaultImages_ = computed(() => postImages.value);
const formClear = () => {
  form.reset();
  signalIdReset();
};
const postTextModelValue_ = computed(() => form.data.content.value?.text);

// ##watch
watch(togglePostContentActive.isActive, (isActive: boolean) => {
  if (!isActive) {
    // store current editor @editor:close
    ee$.value.emit("getContents:all", {
      handle: once((dd: any) => {
        form.data.content.value = dd;
      }),
    });
    return;
  }
});

// ##hooks ##lifecycle
useOnceMountedOn(post, form.reset);
onMounted(() => {
  watchEffect(() => {
    if (!ref_2GPo2.value) return;
    // @dom:access
    nextTick(() => {
      // @editor:init
      //  rebuild emitter; old got garb.collected
      const ee = (ee$.value = new EE());
      const q = new Quill("#ID--QmVJXWEAbu", {
        debug: "info",
        modules: {
          toolbar: false,
        },
        placeholder: "✍🏻 Moj post...",
        theme: "snow",
        bounds: "#ID--KYfqKG0rNs8KlzrUe",
        // formats: ["bold", "italic", "underline"],
      });
      // read content
      ee.on("getContents:all", ({ handle }) => {
        handle({
          data: q.getContents(),
          // drop *blanks replace, single space 4searching
          text: trim(String(q.getText() || "").replace(/\s+/g, " ")),
          // @previews v-bind:html
          //  &#8203; character acts as an invisible "breakable" point between words allowing text to wrap
          html: String(q.getSemanticHTML()).replaceAll(
            "&nbsp;",
            "&nbsp;&#8203;"
          ),
        });
      });
      ee.on("getContents", ({ handle }) => {
        handle(q.getContents());
      });
      ee.on("getText", ({ handle }) => {
        handle(q.getText);
      });
      // handle formats
      ee.on("format:list-ordered", () => {
        q.format("list", "ordered" == q.getFormat()?.list ? false : "ordered");
      });
      ee.on("format:list-bullet", () => {
        q.format("list", "bullet" == q.getFormat()?.list ? false : "bullet");
      });
      ee.on("format:toggle-lg", () => {
        q.format("size", "large" == q.getFormat()?.size ? false : "large");
      });
      ee.on("format:toggle-h1", () => {
        q.format("header", 1 === q.getFormat()?.header ? null : 1);
      });
      ee.on("format:toggle-bold", () => q.format("bold", !q.getFormat()?.bold));
      ee.on("format:toggle-italic", () =>
        q.format("italic", !q.getFormat()?.italic)
      );
      ee.on("format:toggle-underline", () =>
        q.format("underline", !q.getFormat()?.underline)
      );
      ee.on("format:text-color", (c: any) => q.format("color", c));
      ee.on("format:text-align", (alignment: any) =>
        q.format("align", alignment)
      );
      ee.on("format:link", (link: any) => q.format("link", link));
      ee.on("getFormat", ({ handle }) => {
        handle(q.getFormat());
      });
      ee.on("format:clean", () => q.removeFormat(0, q.getLength()));

      // load cached @Deltas
      const deltas = get(form.data.content.value, "data.ops");
      if (!isEmpty(deltas)) q.setContents(deltas);
    });
  });
});
// ##head ##meta
useHead({ title: pageTitle });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-oid-index">
    <VSnackbarMain
      color="success-darken-1"
      v-model="togglePostUpdateSuccess.isActive.value"
    >
      <p>Post je uspešno ažuriran.</p>
    </VSnackbarMain>
    <VToolbarPrimary
      :props-title="{ class: 'text-body-1 text-start' }"
      :text="post?.name"
      route-back-name="app"
    >
      <template #prepend>
        <Iconx icon="$edit" size="1.22rem" class="opacity-20 ms-1" />
      </template>
    </VToolbarPrimary>
    <VForm @submit.prevent="form.submit">
      <VCard flat rounded="0">
        <VDialogPrimary v-model="togglePostContentActive.isActive.value">
          <VCard id="ID--KYfqKG0rNs8KlzrUe">
            <ClientOnly>
              <template #placeholder>
                <p>🚧</p>
              </template>
              <!-- toolbar:1 -->
              <VToolbar density="compact" color="transparent">
                <VBtn
                  @click="() => ee$.emit('format:toggle-bold')"
                  icon
                  size="small"
                >
                  <Iconx icon="format-bold" size="1.33rem" />
                </VBtn>
                <VBtn
                  @click="() => ee$.emit('format:toggle-italic')"
                  icon
                  size="small"
                >
                  <Iconx icon="format-italic" size="1.33rem" />
                </VBtn>
                <VBtn
                  @click="() => ee$.emit('format:toggle-underline')"
                  icon
                  size="small"
                >
                  <Iconx icon="format-underlined" size="1.33rem" />
                </VBtn>
                <VBtn
                  @click="() => ee$.emit('format:toggle-lg')"
                  icon
                  size="small"
                >
                  <Iconx icon="format-size" size="1.33rem" />
                </VBtn>
                <VBtn icon size="small">
                  <strong class="text-[122%]">🎨</strong>
                  <VMenu activator="parent" location="center center">
                    <VSheet width="244">
                      <div class="d-flex items-center flex-wrap p-[2px]">
                        <div
                          v-for="c in colors_"
                          @click="ee$.emit('format:text-color', c.c || false)"
                          :key="c.key"
                          class="w-[48px] h-[48px] cursor-pointer"
                          :style="{ backgroundColor: c.c || 'black' }"
                        />
                      </div>
                    </VSheet>
                  </VMenu>
                </VBtn>
              </VToolbar>
              <!-- toolbar:2 -->
              <VToolbar density="compact" color="transparent">
                <VBtn
                  @click="() => ee$.emit('format:toggle-h1')"
                  icon
                  size="small"
                >
                  <Iconx icon="format-heading" size="1.44rem" />
                </VBtn>
                <VBtn
                  @click="() => ee$.emit('format:list-ordered')"
                  icon
                  size="small"
                >
                  <Iconx icon="list-ordered" size="1.44rem" />
                </VBtn>
                <VBtn
                  @click="() => ee$.emit('format:list-bullet')"
                  icon
                  size="small"
                >
                  <Iconx icon="list-bullet" size="1.33rem" />
                </VBtn>
                <!-- menu:text-align -->
                <VBtn icon size="small">
                  <Iconx icon="text-align-center" size="1.44rem" />
                  <VMenu activator="parent" location="center center">
                    <VSheet rounded="pill" elevation="5" class="pa-1">
                      <VBtn
                        @click="ee$.emit('format:text-align', null)"
                        color="on-surface"
                        variant="text"
                        icon
                        size="small"
                      >
                        <Iconx icon="text-align-left" size="1.33rem" />
                      </VBtn>
                      <VBtn
                        variant="text"
                        color="on-surface"
                        icon
                        size="small"
                        @click="ee$.emit('format:text-align', 'right')"
                      >
                        <Iconx icon="text-align-right" size="1.33rem" />
                      </VBtn>
                      <VBtn
                        variant="text"
                        color="on-surface"
                        icon
                        size="small"
                        @click="ee$.emit('format:text-align', 'center')"
                      >
                        <Iconx icon="text-align-center" size="1.33rem" />
                      </VBtn>
                      <VBtn
                        variant="text"
                        color="on-surface"
                        icon
                        size="small"
                        @click="ee$.emit('format:text-align', 'justify')"
                      >
                        <Iconx icon="text-align-justified" size="1.33rem" />
                      </VBtn>
                    </VSheet>
                  </VMenu>
                </VBtn>
                <!-- menu:format:link -->
                <VBtn variant="text" color="primary" icon size="small">
                  <Iconx icon="link" size="1.33rem" class="rotate-45" />
                  <VMenu
                    location="center center"
                    activator="parent"
                    :close-on-content-click="false"
                    v-slot="{ isActive }"
                  >
                    <VSheet
                      rounded="pill"
                      elevation="5"
                      :min-width="293"
                      class="pa-1 ps-3"
                    >
                      <VTextFieldPromptBasic
                        label="Link"
                        :get-data="
                          (handle) => ee$.emit('getFormat', { handle })
                        "
                        @commit="
                          (link) => {
                            ee$.emit('format:link', link);
                            isActive.value = false;
                          }
                        "
                        :props-btn="{ color: 'primary' }"
                        class="-translate-y-2"
                      />
                    </VSheet>
                  </VMenu>
                </VBtn>
                <!-- format:clean -->
                <VBtn
                  @click="() => ee$.emit('format:clean')"
                  variant="plain"
                  icon
                  size="small"
                  color="error"
                  class="ms-2"
                >
                  <Iconx icon="clear-formatting" size="1.122rem" />
                </VBtn>
              </VToolbar>
              <VSpacer class="mt-4" />
              <!-- quill:container -->
              <section
                id="ID--QmVJXWEAbu"
                ref="ref_2GPo2"
                class="CLASS--quill-container border-0 ma-0 prose"
              />
            </ClientOnly>
            <VSpacer class="mt-12" />
          </VCard>
        </VDialogPrimary>
        <VCardText class="!max-w-[492px] mx-auto">
          <template v-for="(item, field) in FIELDS" :key="field">
            <VTextField
              v-if="!item.type"
              v-model="form.data[field].value"
              :label="item.label"
              v-bind="item.props"
            >
              <template v-if="item['append-inner-icon']" #append-inner>
                <Iconx v-bind="item['append-inner-icon']" />
              </template>
              <template #label="{ label }">
                <span>{{ label }}</span>
                <span v-if="item.required" class="text-error"> *</span>
              </template>
              <template #prepend-inner>
                <Iconx v-bind="item.icon" />
              </template>
            </VTextField>
            <VResponsive
              v-else-if="'images-picked' == item.type"
              class="overflow-visible"
            >
              <p class="ps-2 text-body-1 text-medium-emphasis">Slike:</p>
              <VImgImagesPickerDefaut
                v-model="imagesPicked"
                rounded="lg"
                :props-container="{
                  height: DEFAULT_imagePickerHeight,
                  rounded: 'lg',
                }"
                :key-images-cleared="signalIdReset.ID.value"
                :default-images="defaultImages_"
                @clear-manual="
                  () => {
                    form.data['images-picked'].value = undefined;
                  }
                "
              />
            </VResponsive>
            <VTextField
              v-else-if="'post-text' == item.type"
              :model-value="postTextModelValue_"
              :label="item.label"
              v-bind="item.props"
            >
              <template v-if="item['append-inner-icon']" #append-inner>
                <Iconx v-bind="item['append-inner-icon']" />
              </template>
              <template #label="{ label }">
                <span>{{ label }}</span>
                <span v-if="item.required" class="text-error"> *</span>
              </template>
              <template #prepend-inner>
                <Iconx v-bind="item.icon" />
              </template>
            </VTextField>
          </template>
        </VCardText>
        <VCardActions class="justify-around">
          <VBtnReset @click="formClear" :props-icon="{ class: 'me-1' }" />
          <VBtnSave :disabled="!form.valid.value" type="submt" class="pe-5" />
        </VCardActions>
      </VCard>
    </VForm>
    <VSpacer class="mt-32" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--QmVJXWEAbu {
  font-size: 105%;
  em {
    font-style: italic;
  }
}
</style>
