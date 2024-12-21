<script setup lang="ts">
// ##imports
import { z } from "zod";
import {
  VToolbarPrimary,
  VEmptyStateNoData,
  VSnackbarMain,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  //  middleware: "authorized",
  // "@page": {
  //   appBarTitle: "",
  // },
});

const {
  vars: { FLAG_SHOW_AKTIVA_DISTRIBUCIJA_BG },
} = useAppConfig();
// ##schemas
const schemaLocationCoordsLatLng = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  // .transform((d) => ({
  //   lat: d.latitude,
  //   lng: d.longitude,
  // }));
  .transform((d) => [d.latitude, d.longitude]);
// ##utils
const ps = useProcessMonitor();
const { coords } = useGeolocation();
// ##icons
// ##refs ##flags ##models
const showBg = useState(FLAG_SHOW_AKTIVA_DISTRIBUCIJA_BG);
const sites = ref();
const locationPageTokens$ = ref<any[]>([]);
const locationPicked$ = ref();
const locationCoords$ = ref();
const toggleTeamNotifiedSuccess = useToggleFlag();
// ##data ##auth ##state
const { places: placesInfo, publishDelivery } = useGoogleGeocodePlaces(
  locationCoords$,
  () => last(locationPageTokens$.value)
);
const hasMorePages_ = computed(
  () => !!get(placesInfo.value, "places.next_page_token")
);
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const pageTokenPush = () => {
  locationPageTokens$.value.push(
    get(placesInfo.value, "places.next_page_token")
  );
};
// ##watch
watch(placesInfo, (placesNext: any) => {
  sites.value = [
    ...(sites.value || []),
    ...get(placesNext, "places.results", []),
  ];
});
// @location:selected
watchEffect(async () => {
  if (isEmpty(locationPicked$.value)) return;
  let res: any;
  try {
    ps.begin(toggleTeamNotifiedSuccess.off);
    res = await publishDelivery(locationPicked$.value);
    if (get(res, "data.commsDeliveryStatusPublish.error"))
      throw "@error:delivery:publish:xXlxDNO";
  } catch (error) {
    ps.setError(error);
  } finally {
    ps.done();
  }
  if (!ps.error.value) ps.successful(toggleTeamNotifiedSuccess.on);
  console.log("@debug", ps.error.value);
});
watchEffect(() => {
  try {
    const coords_ = schemaLocationCoordsLatLng.parse(coords.value);
    if (every(coords_, isFinite)) {
      locationCoords$.value = coords_;
    }
  } catch (error) {
    console.log("@debug:geoLocation:request:4Ajwy43", error);
  }
});
// ##hooks ##lifecycle
onMounted(() => {
  showBg.value = true;
});
onUnmounted(() => {
  showBg.value = false;
});
// ##head ##meta
useHead({ title: "🚛 Isporuka" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--aktiva-distribucija">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleTeamNotifiedSuccess.isActive.value"
    >
      <p>Obaveštenje je uspešno poslato.</p>
    </VSnackbarMain>
    <VCard
      color="transparent"
      :disabled="ps.processing.value"
      flat
      elevation="0"
      rounded="0"
      class="ma-0 pa-0"
    >
      <VToolbarPrimary
        text="Lokacija isporuke"
        :props-title="{ class: 'text-body-1 font-italic text-start' }"
      >
        <template #prepend>
          <Iconx
            icon="icons-local:hand-truck"
            size="1rem"
            class="mx-1 opacity-20"
          />
        </template>
        <template #append>
          <Iconx
            icon="notification"
            size="1.122rem"
            class="opacity-20 -rotate-2 me-1"
          />
        </template>
      </VToolbarPrimary>
      <VSpacer class="mt-1" />
      <VCardText class="pa-0">
        <VList v-if="!isEmpty(sites)" class="pa-3 bg-transparent">
          <VListItem
            v-for="(node, index) in sites"
            @click="locationPicked$ = node"
            link
            :key="node.name"
            rounded
            elevation="1"
            tag="button"
            type="submit"
            class="w-100 text-start pa-4 bg-surface"
            :class="[0 < index ? 'mt-3' : '']"
          >
            <VListItemTitle>{{ node.name }}</VListItemTitle>
            <VListItemSubtitle>{{ node.vicinity }}</VListItemSubtitle>
          </VListItem>
        </VList>
        <VEmptyStateNoData v-else class="opacity-40" />

        <VBtn
          v-if="hasMorePages_"
          :disabled="!hasMorePages_"
          rounded="pill"
          size="x-large"
          @click="pageTokenPush"
          class="d-block mx-auto mt-10"
          >Još</VBtn
        >
        <VSpacer class="mt-24" />
      </VCardText>
    </VCard>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
