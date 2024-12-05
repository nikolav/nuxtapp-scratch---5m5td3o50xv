<script setup lang="ts">
// ##imports
import {
  VFormRenderAssetsFormFields,
  VToolbarPrimary,
  // VSnackbarSuccess,
} from "@/components/app";

// ##config:const
const DEFAULT_SUBMISSION_SUCCESS_REDIRECT_routeName = "teren-izvestaji";
const DEFAULT_SUBMISSION_SUCCESS_REDIRECT_timeout = 3450;
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const attrs = useAttrs();
const form = computed(() => get(attrs, "route-data.form", {}));

// ##schemas
// ##utils
const { watchProcessing } = useStoreAppProcessing();
const ps = useProcessMonitor();
const { assetsFormsSubmissionAttachmentsPath } = usePathUtils();
const { assetsFormsResponseAttachmentsFolder } = useTopics();

// ##icons
// ##refs ##flags ##models
const lastSubmissionCreated = ref();
const toggleSubmissionSuccess = useToggleFlag();

// ##data ##auth ##state
const { submission } = useQueryManageAssetsForms();
const { upload } = useFirebaseStorage(() =>
  assetsFormsResponseAttachmentsFolder(form.value.key)
);
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const formSubmit = async (data: any) => {
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
      map(attachmentsByQuestion, async (files: any, q: string) => ({
        [q]: flatten(map(await upload(files), values)),
      }))
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
watchProcessing(ps.processing);
watch(toggleSubmissionSuccess.isActive, (isActive) => {
  if (isActive)
    navigateTo({
      name: "status-message",
      params: {
        message: encodeURIComponent(
          JSON.stringify({
            props: {
              size: "large",
              color: "success",
              title: "👌🏻 Obrazac je uspešno popunjen.",
              // text: "limited gently solve dead sunlight knowledge",
            },
            action: {
              text: "📃 Pogledaj izveštaj.",
              to: {
                name: "teren-rid-pregled-submission",
                params: {
                  rid: form.value.id,
                  submission: lastSubmissionCreated.value.id,
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
});
// ##hooks ##lifecycle
// guard redirect@!asset:active
// ##head ##meta
useHead({ title: "📝 Izveštaji | Popuni" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--teren-rid-popuni">
    <!-- <VSnackbarSuccess v-model="toggleSubmissionSuccess.isActive.value">
      <p>Obrazac je uspešno poslat.</p>
    </VSnackbarSuccess> -->
    <VToolbarPrimary
      :text="form.name"
      route-back-name="teren-izvestaji"
      :props-title="{ class: 'text-body-1 font-italic' }"
    >
      <template #prepend>
        <Iconx
          icon="$edit"
          size="1.33rem"
          class="opacity-20 mx-1 translate-x-[2px]"
        />
      </template>
    </VToolbarPrimary>
    <template v-if="form.notes">
      <VCardText class="text-body-2 text-disabled indent-2 !prose">
        <p>
          {{ form.notes }}
        </p>
      </VCardText>
      <VDivider class="border-opacity-100 mt-5 mb-10 mx-auto" length="55%" />
    </template>
    <VSpacer v-else class="mt-10" />
    <div class="__spaceer ps-3">
      <VFormRenderAssetsFormFields
        @submited="formSubmit"
        :form="form"
        :props-btn-save="{ size: 'x-large', class: 'px-5' }"
      />
    </div>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
