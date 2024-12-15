<script setup lang="ts">
// tQfTpzuCZ36de57F2LlB
import { mergeProps } from "vue";

// setup
defineOptions({
  inheritAttrs: false,
});

// props
const props = withDefaults(
  defineProps<{
    size?: number | undefined;
    border?: number | undefined;
  }>(),
  {
    size: 122,
    border: 5,
  }
);

// data, auth
const auth = useStoreApiAuth();

// config
const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE, TOOLTIPS_OPEN_DELAY },
} = useAppConfig();

// refs
const uploadedImage = ref();

// utils
const { resized } = useResizeImage();
const { files: filesPicked, open: fileDialogOpen } = useFileDialog({
  accept: "image/*",
  multiple: false,
});
const { firebasePathAvatars } = useTopics();
const { watchProcessing } = useStoreAppProcessing();
const pc = useProcessMonitor();
watchProcessing(pc.processing);

// computed
const sizeAvatar = computed(() => props.size - props.border);
const imageSelected = computed(() => first(filesPicked.value) || null);

// stores
const { upload } = useFirebaseStorage(firebasePathAvatars(auth.uid));
const { profilePatch } = useMutationAccountsManage();

// watchers
//  upload:firebase-storage
watch(imageSelected, async (imageAvatar) => {
  let url;
  if (!imageAvatar) return;
  try {
    pc.begin();
    url = get(
      await upload({
        // avatarImage: { file: imageAvatar, name: `avatarImage` },
        avatarImage: {
          file: blobToFile(await resized(imageAvatar, 400, 300), "avatarImage"),
          name: "avatarImage",
        },
      }),
      "0.avatarImage"
    );
  } catch (error) {
    pc.setError(error);
  } finally {
    pc.done();
  }
  if (!pc.error.value) pc.successful();
  //
  uploadedImage.value = url;
});
// profile:sync
watch(
  [() => pc.success.value, uploadedImage],
  async ([uploadSuccess, avatarImage]) => {
    if (!(uploadSuccess && avatarImage)) return;
    await profilePatch(auth.uid, { avatarImage });
  }
);

// @@eos
</script>
<template>
  <VHover :open-delay="TOOLTIPS_OPEN_DELAY">
    <template #default="{ isHovering, props: props_ }">
      <VBtn
        @click="fileDialogOpen()"
        elevation="1"
        class="component--VBtnUpdateProfileImage d-flex items-center justify-center display-relative position-relative"
        rounded="circle"
        :width="size"
        :height="size"
        icon
        v-bind="mergeProps($attrs, props_)"
        color="on-primary"
      >
        <VAvatar
          :size="sizeAvatar"
          :image="auth.profile?.avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
        />
        <VFadeTransition>
          <div v-if="!!isHovering" class="position-absolute">
            <slot :isHovering="isHovering">
              <Iconx
                :size="`calc(${size * (1 - 0.44)}px)`"
                icon="material-symbols:photo-camera"
                class="opacity-85 text-surface"
              />
            </slot>
          </div>
        </VFadeTransition>
      </VBtn>
    </template>
  </VHover>
</template>
<style lang="scss" scoped></style>
<style lang="scss"></style>
