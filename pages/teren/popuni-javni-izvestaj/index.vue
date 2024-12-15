<script setup lang="ts">
// ##imports
import { URL_APP_PUBLIC } from "@/config";
import type { IInputFileUpload } from "@/types";
import {
  VEmptyStateNoData,
  VFormRenderAssetsFormFields,
  VToolbarPrimary,
} from "@/components/app";
import { Redirect } from "@/components/utils";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "default",
  // middleware: "",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const {
  db: {
    Assets: {
      tags: { TAG_ASSETS_SHAREABLE_GLOBALY },
    },
  },
} = useAppConfig();
const route = useRoute();
const FID = computed(() => route.query.q);
const qenabled = computed(() => !!FID.value);
// ##schemas
// ##utils
const { assetsFormsResponseAttachmentsFolder } = useTopics();
const { resized } = useResizeImage();
const { assetsFormsSubmissionAttachmentsPath } = usePathUtils();
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const toggleSubmissionSuccess = useToggleFlag();
const lastSubmissionCreated = ref();
const toggleIsBlocked = useToggleFlag();
// ##data ##auth ##state
const { submission } = useQueryManageAssetsForms(undefined, undefined, {
  enabled: false,
});
const { upload } = useFirebaseStorage(() =>
  assetsFormsResponseAttachmentsFolder(form.value.key)
);

const { assets, processing } = useQueryManageAssetsForms(
  () => [FID.value],
  false,
  { enabled: qenabled },
  {
    whitelist_tags: [TAG_ASSETS_SHAREABLE_GLOBALY],
    search: {
      strategy: "status_active",
      args: [],
    },
  }
);
// ##computed
const form = computed(() => first(assets.value));
// ##forms ##handlers ##helpers ##small-utils
const onSubmitted = async (data: any) => {
  // check if has attachments
  //  upload
  //   record attachment paths; 'PATH:media' / 'form:key' / 'question' / files...
  //  save rest with attachment links
  let res: any;
  const fid = form.value.id;
  try {
    ps.begin(() => {
      lastSubmissionCreated.value = undefined;
    });
    if (!fid) throw "submission:failed";

    const dd = reduce(
      data.answers,
      (res: any, answer: any, q: any) => {
        res[q] = clone(answer);
        return res;
      },
      <any>{}
    );

    const attachmentsByQuestion = reduce(
      data.answers,
      (res: any, answer: any, question: string) => {
        if (some(answer, (node: any) => filesIsFile(node.file))) {
          res[question] = reduce(
            answer,
            (res: any[], node: any) => {
              if (filesIsFile(node.file)) {
                res[node.file.name] = {
                  file: node.file,
                  path: assetsFormsSubmissionAttachmentsPath(
                    data.key,
                    question
                  ),
                };
              }
              return res;
            },
            <any>{}
          );
        }
        return res;
      },
      <any>{}
    );
    const upl = await Promise.all(
      map(attachmentsByQuestion, async (files: any, q: string) => {
        const files_ = fromPairs(
          await Promise.all(
            map(toPairs(files), async ([name, node]: any) => [
              name,
              (await isImageBlob(node.file))
                ? {
                    ...node,
                    file: blobToFile(await resized(node.file), name),
                  }
                : node,
            ])
          )
        );
        return {
          [q]: flatten(map(await upload(<IInputFileUpload>files_), values)),
        };
      })
    );
    each(upl, (qlinks: any) => {
      assign(dd, qlinks);
    });

    res = await submission({ response: dd }, fid, data.key);
    // console.log({ key: data.key, data: dd });
    if (get(res, "data.assetsFormsSubmission.error")) throw "submission:failed";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value)
    ps.successful(() => {
      lastSubmissionCreated.value = get(
        res,
        "data.assetsFormsSubmission.status.submission"
      );
      nextTick(toggleSubmissionSuccess.on);
    });
};
// ##watch
// ##hooks ##lifecycle
onMounted(() => {
  watch(processing, (processing) => {
    if (!processing && !form.value) toggleIsBlocked.on();
  });
});
// ##head ##meta
useHead({ title: "✍🏻 Izveštaji" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-popuni-javni-izvestaj">
    <Redirect v-if="toggleIsBlocked.isActive.value" :to="{ name: 'index' }" />
    <template v-else-if="form">
      <div v-if="toggleSubmissionSuccess.isActive.value">
        <VSpacer class="mt-5" />
        <VEmptyState title="👍🏻 Hvala, uspešno ste popunili upitnik.">
          <template #media>
            <VSpacer class="mt-2" />
            <Iconx icon="$success" size="10rem" class="text-success-darken-1" />
            <VSpacer class="mt-4" />
          </template>
          <VCardActions class="mt-10">
            <VBtn
              :href="URL_APP_PUBLIC"
              icon
              variant="elevated"
              color="on-surface"
              size="x-large"
            >
              <span class="text-2xl">🏠</span>
            </VBtn>
          </VCardActions>
        </VEmptyState>
      </div>
      <VCard v-else flat elevation="0" rounded="0">
        <VToolbarPrimary
          :text="form?.name"
          :props-title="{ class: 'text-body-2 font-italic text-start' }"
          hide-default-close
        >
          <template #prepend>
            <Iconx icon="$edit" size="1.5rem" class="ps-1 opacity-20" />
          </template>
        </VToolbarPrimary>
        <VCardText>
          <template v-if="form?.notes">
            <p class="text-disabled indent-2 prose-sm">
              {{ form.notes }}
            </p>
            <VDivider
              class="border-opacity-100 mt-5 mb-10 mx-auto"
              length="75%"
            />
          </template>
          <VFormRenderAssetsFormFields
            @submited="onSubmitted"
            :form="form"
            :props-btn-save="{ size: 'x-large' }"
          />
        </VCardText>
        <VCardSubtitle class="text-end pa-3 pe-5">
          <NuxtLink :href="URL_APP_PUBLIC" target="_blank">
            <a class="font-italic opacity-75 link--prominent">
              <small> {{ URL_APP_PUBLIC }} </small>
            </a>
          </NuxtLink>
        </VCardSubtitle>
      </VCard>
    </template>
    <VEmptyStateNoData v-else class="opacity-40" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
