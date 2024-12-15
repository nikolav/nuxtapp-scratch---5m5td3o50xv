<script setup lang="ts">
// ##imports
import { z } from "zod";
import {
  VDialogPrimary,
  VToolbarPrimary,
  VEmptyStateNoData,
  VSnackbarSuccess,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  // middleware: "authorized",
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
  .transform((d) => ({
    lat: d.latitude,
    lng: d.longitude,
  }));
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
const togglePlacesNearbyDialogActive = useToggleFlag();
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
  if (!ps.error.value)
    ps.successful(() => {
      toggleTeamNotifiedSuccess.on();
      togglePlacesNearbyDialogActive.off();
    });
  console.debug("@debug", ps.error.value);
});
watch(togglePlacesNearbyDialogActive.isActive, (isActive: boolean) => {
  if (!isActive) return;
  try {
    const coords_ = schemaLocationCoordsLatLng.parse(coords.value);
    locationCoords$.value = [coords_.lat, coords_.lng];
  } catch (error) {
    console.debug("@debug:geoLocation:request:4Ajwy43", error);
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
  <section class="page--aktiva-distribucija d-flex items-center flex-col">
    <VSnackbarSuccess v-model="toggleTeamNotifiedSuccess.isActive.value">
      <p>Obaveštenje je uspešno poslato.</p>
    </VSnackbarSuccess>
    <VDialogPrimary
      v-model="togglePlacesNearbyDialogActive.isActive.value"
      fullscreen
      :show-close="false"
      scrollable
    >
      <VCard
        :disabled="ps.processing.value"
        flat
        elevation="0"
        class="ma-0 pa-0"
      >
        <VToolbarPrimary
          :on-close="togglePlacesNearbyDialogActive.off"
          text="Lokacija isporuke"
          :props-title="{ class: 'text-body-1 font-italic' }"
          :props-btn-close="{ size: 'large' }"
        >
          <template #prepend>
            <Iconx
              icon="storefront"
              class="ms-2 me-1 opacity-20"
              size="1.33rem"
            />
          </template>
        </VToolbarPrimary>

        <VCardText class="pa-0">
          <VList v-if="!isEmpty(sites)" class="pa-3" color="primary">
            <VListItem
              v-for="(node, index) in sites"
              @click="locationPicked$ = node"
              link
              :key="node.name"
              rounded
              elevation="1"
              tag="button"
              type="submit"
              class="w-100 text-start pa-4"
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
    </VDialogPrimary>
    <VSpacer class="mt-[2.8125rem]" />
    <p class="text-center prose-lg text-medium-emphasis">
      Obavesti najbliži tim o isporuci:
    </p>
    <VSpacer class="mt-5" />
    <VBadge
      location="bottom end"
      color="transparent"
      offset-x="41"
      offset-y="43"
    >
      <template #badge>
        <VAvatar color="primary-lighten-1" size="x-large">
          <Iconx
            icon="notification"
            size="2rem"
            class="rotate-3 opacity-75 translate-x-px"
          />
        </VAvatar>
      </template>
      <VBtn
        @click="togglePlacesNearbyDialogActive.on"
        icon
        size="192px"
        elevation="6"
        color="primary"
      >
        <Iconx icon="icons-local:hand-truck" size="calc(192px * .5)" />
      </VBtn>
    </VBadge>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
