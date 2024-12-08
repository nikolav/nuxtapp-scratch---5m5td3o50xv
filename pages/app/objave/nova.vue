<script setup lang="ts">
// ##imports
import { z } from "zod";
import chroma from "chroma-js";
import Quill from "quill";
import EE from "eventemitter3";
import type { IConfigFields } from "@/types";
// import { renderIcon } from "@/components/icons";
import {
  VToolbarPrimary,
  VBtnReset,
  VBtnSave,
  VImgImagesPickerDefaut,
  VDialogPrimary,
  VTextFieldPromptBasic,
} from "@/components/app";
// ##config:const
const DEFAULT_imagePickerHeight = 222;
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const listColorWheel_ = (count = 12, lightness = 0.33, start = "#ff0000") => [
  { c: "", key: ":default" },
  ...Array.from({ length: count }, (_c, i) => ({
    c: chroma(start)
      .set("hsl.h", (360 / count) * i)
      .set("hsl.l", lightness)
      .hex(),
    key: String(i),
  })),
];
// ##schemas
const schemaInputPost = z.object({
  name: z.string().trim().min(1),
  content: z.object({
    text: z.string().trim().min(1),
  }),
});
// ##utils
const ps = useProcessMonitor();
// rebuilds emitter editor@mount; old emitter gets gc-ed
const ee$ = ref();
const colors_ = listColorWheel_(19, 0.34);
// ##icons
// const iconCheckOn = renderIcon("check-on", { class: "scale-[111%]" });
// const iconCheckOff = renderIcon("check-off", { class: "scale-[111%]" });
// ##refs ##flags ##models
const togglePostCreatedSuccess = useToggleFlag();
const lastPostAdded = ref();
const ref_V99RIzVbQD = ref();
const togglePostContentActive = useToggleFlag();
const signalIdCleared = useUniqueId();
const imagesPicked = ref();
// ##data ##auth ##state
// asset.key @refs
const clientStorage = useFirebaseStorageAssetImages(
  () => lastPostAdded.value?.key
);
// disable assets:fetch { enabled: false }
const client = useQueryManageAssetsPosts(undefined, undefined, {
  enabled: false,
});
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const FIELDS_post = <Record<string, IConfigFields>>{
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
const form = useFormModel(
  "post:new:228d7abf-56f9-5b2e-8480-b779c5aedaf9",
  FIELDS_post,
  {
    schema: schemaInputPost,
    onSubmit: async (data: any) => {
      let res: any;
      try {
        ps.begin(() => {
          lastPostAdded.value = undefined;
          togglePostCreatedSuccess.off();
        });
        const post = reduce(
          data,
          (res: any, dd: any, field: string) => {
            if (true === get(FIELDS_post[field], "@table:fields")) {
              res[field] = dd;
            }
            if (true === get(FIELDS_post[field], "@table:data")) {
              res.data[field] = dd;
            }
            return res;
          },
          <any>{ data: {} }
        );
        res = await client.commit(post);
        if (
          get(res, "data.assetsUpsert.error") ||
          !get(res, "data.assetsUpsert.status.asset.id")
        )
          throw "post:create:error";
        lastPostAdded.value = get(res, "data.assetsUpsert.status.asset");
        // await ref@postAdded update
        await nextTick();
        if (!isEmpty(data["images-picked"])) {
          await clientStorage.uploadAll(
            map(data["images-picked"], (node: any) => node.file)
          );
        }
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value) ps.successful(togglePostCreatedSuccess.on);
      console.log("@debug", ps.error.value);
    },
  }
);
const postTextModelValue_ = computed(() => form.data.content.value?.text);
const formClear = () => {
  form.clear();
  signalIdCleared();
};
// when navigating back to edited post
//  load cached images @form.data.images-picked
const defaultImages_ = computed(() =>
  map(form.data["images-picked"].value || [], (node: any) => node.dataurl)
);
// ##watch
watch(togglePostCreatedSuccess.isActive, (success: boolean) => {
  if (success) {
    navigateTo({
      name: "status-message",
      params: {
        message: encodeURIComponent(
          JSON.stringify({
            props: {
              size: "large",
              color: "success",
              title: `👌🏻 Članak je uspešno sačuvan. #${lastPostAdded.value?.id}`,
              // text: "limited gently solve dead sunlight knowledge",
            },
            action: {
              text: `📃 Otvori`,
              to: {
                name: "app-objave-oid",
                params: {
                  oid: lastPostAdded.value?.id,
                },
              },
            },
            icon: {
              icon: "$success",
              size: "10rem",
              color: "success",
              class: "",
            },
          })
        ),
      },
    });
    nextTick(formClear);
  }
});
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
// manual sync picked images with model
watch(imagesPicked, () => {
  form.data["images-picked"].value = [...(imagesPicked.value || [])];
});
// ##hooks ##lifecycle
onMounted(() => {
  watchEffect(() => {
    if (!ref_V99RIzVbQD.value) return;
    // @dom:access
    nextTick(() => {
      // @editor:init
      //  rebuild emitter; old got garb.collected
      const ee = (ee$.value = new EE());
      const q = new Quill("#ID--oML9n5YAdp7", {
        debug: "info",
        modules: {
          toolbar: false,
        },
        placeholder: "✍🏻 Moj novi post...",
        theme: "snow",
        bounds: "#ID--CRB0yRCaET8",
        // formats: ["bold", "italic", "underline"],
      });
      // read content
      ee.on("getContents:all", ({ handle }) => {
        handle({
          data: q.getContents(),
          // drop *blanks replace, single space 4searching
          text: trim(String(q.getText() || "").replace(/\s+/g, " ")),
          // @previews v-bind:html
          html: q.getSemanticHTML(),
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
useHead({ title: "✨📃 Nov post" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--app-objave-nova">
    <VForm @submit.prevent="form.submit">
      <VCard flat rounded="0">
        <VDialogPrimary v-model="togglePostContentActive.isActive.value">
          <VCard id="ID--CRB0yRCaET8">
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
                id="ID--oML9n5YAdp7"
                ref="ref_V99RIzVbQD"
                class="border-0 ma-0"
              />
            </ClientOnly>
            <VSpacer class="mt-12" />
          </VCard>
        </VDialogPrimary>
        <VToolbarPrimary
          flat
          text="Objavi nov post"
          :props-title="{ class: 'text-body-1 font-italic' }"
          route-back-name="app"
        >
          <template #prepend>
            <Iconx
              icon="page"
              size="1.33rem"
              class="opacity-20 ms-1 rotate-6"
            />
          </template>
        </VToolbarPrimary>
        <VCardText class="!max-w-[492px] mx-auto">
          <template v-for="(item, field) in FIELDS_post" :key="field">
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
                :key-images-cleared="signalIdCleared.ID.value"
                :default-images="defaultImages_"
                @clear-manual="
                  () => {
                    form.data['images-picked'].value = undefined;
                  }
                "
              />
            </VResponsive>
          </template>
        </VCardText>
        <VCardActions class="justify-around">
          <VBtnReset @click="formClear" :props-icon="{ class: 'me-1' }" />
          <VBtnSave
            :disabled="!form.valid.value"
            color="on-surface"
            :variant="form.valid.value ? 'elevated' : 'text'"
            type="submt"
            :elevation="form.valid.value ? 3 : 0"
            size="x-large"
            text="Objavi"
            :props-icon="{ icon: 'world', class: '-rotate-6' }"
            class="text-primary-darken-1 pe-5"
          />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--oML9n5YAdp7 {
  font-size: 105%;
  em {
    font-style: italic;
  }
}
</style>
