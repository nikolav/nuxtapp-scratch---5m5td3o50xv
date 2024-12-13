import {
  Q_googleapisPlacesNearby,
  M_commsDeliveryStatusPublish,
} from "@/graphql";
export const useGoogleGeocodePlaces = (
  LOCATION?: any,
  NEXT_PAGE_TOKEN?: any
) => {
  const location = computed(() => toValue(LOCATION));
  const next_page_token = computed(() => toValue(NEXT_PAGE_TOKEN));
  const qenabled = computed(() => !isEmpty(location.value));

  // commsDeliveryStatusPublish(site: JsonData!): JsonData!
  const { mutate: mutatePublishDelivery } = useMutation(
    M_commsDeliveryStatusPublish
  );
  // googleapisPlacesNearby(location: JsonData!, next_page_token: String): JsonData!
  const { result, load, loading } = useLazyQuery(
    Q_googleapisPlacesNearby,
    {
      location,
      next_page_token,
    },
    {
      enabled: qenabled,
    }
  );
  const places = computed(() =>
    get(result.value, "googleapisPlacesNearby.status")
  );

  useOnceMountedOn(qenabled, async () => await load());

  const publishDelivery = async (site: any) =>
    await mutatePublishDelivery({ site });

  return {
    loading,
    places,
    publishDelivery,
  };
};
