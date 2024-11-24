<script setup lang="ts">
// ##imports
import { TOPIC_CHAT_CALENDAR_MAIN } from "~/config";
import { VBtnTopicChatToggle } from "@/components/app";
// ##config:const
const WIDTH_default = 640;
const HEIGHT_default = 480;
// ##config ##props
const props = withDefaults(
  defineProps<{
    width?: any;
    height?: any;
    href?: any;
    hrefEdit?: any;
    tooltipEdit?: string;
    chatCallendarTopic?: any;
    chatCallendarTitle?: any;
  }>(),
  {
    width: WIDTH_default,
    height: HEIGHT_default,
    tooltipEdit: "Ažuriraj kalendar",
    href: `https://calendar.google.com/calendar/embed?height=${HEIGHT_default}&wkst=2&ctz=Europe%2FBelgrade&hl=sr&title=Glavni%20kalendar%20%40frikom.nikolav.rs&src=MGUxY2JjOTMyMTMzNDI5ZDJjMzBmNmVjMzg1NzZjMTcyYzlhZjk0MzlhOTg0MmQ5YjcyOThiOTZiZWIzYTY4OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%233F51B5`,
    hrefEdit:
      "https://calendar.google.com/calendar/u/0?cid=MGUxY2JjOTMyMTMzNDI5ZDJjMzBmNmVjMzg1NzZjMTcyYzlhZjk0MzlhOTg0MmQ5YjcyOThiOTZiZWIzYTY4OEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    chatCallendarTopic: TOPIC_CHAT_CALENDAR_MAIN,
    chatCallendarTitle: "📅 Glavni kalendar",
  }
);

// ##schemas
// ##utils
const { topicWithTitle } = useGlobalVariableChatActive();
const calReloadKEY = useUniqueId();

// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const src = computed(() => {
  // override `height` in search-params
  const url_ = new URL(props.href);
  const { origin, pathname } = url_;
  return `${trimEnd(origin, "/")}/${trim(pathname, "/")}?${map(
    Array.from(url_.searchParams.entries()),
    ([field, value]: [string, string]) =>
      "height" !== field ? `${field}=${value}` : `height=${props.height}`
  ).join("&")}`;
});
const topic_callendarChat = computed(() =>
  topicWithTitle(props.chatCallendarTopic, props.chatCallendarTitle)
);
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VCard
    :key="calReloadKEY.ID.value"
    class="component--GoogleCalendar pa-0 ma-0 mx-1"
    variant="text"
    elevation="0"
    rounded="0"
  >
    <VCardItem density="compact">
      <template #prepend>
        <VBtnTopicChatToggle :topic="topic_callendarChat" variant="text" />
      </template>
      <template #append>
        <VCardActions class="__spacer">
          <VBtn @click="calReloadKEY" icon variant="plain" size="small">
            <Iconx icon="$loading" />
          </VBtn>
          <NuxtLink :href="hrefEdit" target="_blank">
            <VBtn icon variant="plain" size="small">
              <Iconx icon="$edit" />
              <VTooltip :text="tooltipEdit" />
            </VBtn>
          </NuxtLink>
        </VCardActions>
      </template>
    </VCardItem>
    <VResponsive class="pa-0 ma-0" :width="width" :height="height">
      <iframe
        :src="src"
        style="border-width: 0"
        :width="width"
        :height="height"
        frameborder="0"
        scrolling="no"
        class="w-100 h-100"
      ></iframe>
    </VResponsive>
  </VCard>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
