<script setup lang="ts">
// ecd4d69d-6cfd-507c-a932-5a023320dcf9
// @@positioned
// :class="[
//         '!top-[33%] -translate-y-[33%]',
//         smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
//       ]"
//       :width="smAndUp ? 412 : '92%'"

// ##imports
import { z } from "zod";
import { useDisplay } from "vuetify";

// ##config
const props = withDefaults(
  defineProps<{
    loading?: boolean;
    resetId?: any;
    topic?: any;
    positioned?: boolean;
    notification?: boolean;
    itemsViberChannels?: any;
  }>(),
  {
    topic: "413c9264-5469-5c38-9e93-051eb180e065",
  }
);
const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();
const emit = defineEmits<{
  message: [msg: string];
}>();

// ##utils
const {
  smAndUp,
  // width: VW
} = useDisplay();
const schemaChatMessage = z.object({
  name: z.string().min(1),
  message: z.string().min(1),
});

// ##icons
// ##refs ##flags
const viberChannelsSelected = ref();
const menuIsActive = defineModel<any>();
// ##data ##auth ##state
const auth = useStoreApiAuth();
// ##computed
// ##forms ##helpers ##handlers
const { submit, form, valid, clear } = useFormDataFields(
  `5bzJ7E9Dkx:${props.topic}`,
  {
    name: true,
    message: true,
  },
  {
    schema: schemaChatMessage,
    onSubmit: (data: any) => {
      // const msg = { ...data, uid: auth.uid, name: auth.displayName };
      // emit("message", data.message);
      emit(
        "message",
        props.itemsViberChannels
          ? JSON.stringify({
              ...data,
              channels: viberChannelsSelected.value,
            })
          : data.message
      );
      nextTick(clear);
    },
  }
);
const formReset = () => {
  form.message.value = undefined;
  if (props.itemsViberChannels) {
    viberChannelsSelected.value = undefined;
  }
};

// ##watch
watchEffect(() => {
  form.name.value = auth.displayName;
});
watch(() => props.resetId, formReset);
// ##hooks:lifecycle
// ##head

// @@eos
</script>
<template>
  <VMenu
    activator="parent"
    location="top end"
    v-model="menuIsActive"
    :width="smAndUp ? 345 : '95%'"
    :transition="DEFAULT_TRANSITION"
    :close-on-content-click="false"
    :offset="22"
    :class="
      positioned
        ? [
            '!top-[25%] -translate-y-[25%]',
            smAndUp ? '!start-1/2 -translate-x-1/2' : 'translate-x-[4%]',
          ]
        : ''
    "
  >
    <VSheet :rounded="smAndUp ? 'lg ts-xl' : 'lg'" class="pa-3 ps-5">
      <VBtn
        @click="menuIsActive = false"
        variant="plain"
        color="secondary"
        icon="$close"
        position="absolute"
        class="top-1 end-1 z-[1]"
      />
      <VForm :disabled="loading" @submit.prevent="submit" autocomplete="off">
        <VSelect
          v-if="itemsViberChannels"
          v-model="viberChannelsSelected"
          width="75%"
          color="primary-darken-1"
          density="compact"
          :items="itemsViberChannels"
          variant="plain"
          label="Viber kanali"
          single-line
          multiple
          chips
          closable-chips
        >
          <template #label="{ label }">
            <small>{{ label }}...</small>
          </template>
        </VSelect>
        <VTextField
          v-model="auth.displayName"
          placeholder="Korisnik"
          variant="plain"
          class="opacity-75"
        >
          <template #prepend-inner>
            <Iconx
              size="1.25rem"
              icon="ri:user-line"
              class="opacity-20 me-1 -translate-y-px"
            />
          </template>
        </VTextField>
        <VTextarea
          v-model="form.message.value"
          autofocus
          :placeholder="`${notification ? 'Obaveštenje' : 'Poruka'}...`"
          variant="plain"
          clearable
        />
        <VCardActions>
          <VSpacer />
          <VBtn
            type="submit"
            :disabled="
              !valid || (itemsViberChannels && isEmpty(viberChannelsSelected))
            "
            size="large"
            rounded="pill"
            variant="elevated"
            >ok</VBtn
          >
        </VCardActions>
      </VForm>
    </VSheet>
  </VMenu>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
