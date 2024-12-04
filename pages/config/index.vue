<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
import { VToolbarPrimary, VSheetCrudViberChannels } from "@/components/app";
// ##config:const
const PANEL_VALUE_viber = "viber";
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

// ##schemas
// ##utils
const signalIdDeselect = useUniqueId();
// ##icons
// ##refs ##flags ##models
const channels = ref();
const panelActive = useGlobalVariable(
  "config:panelActive:060a891b-8661-5c1d-8b5d-3810de953f0a"
);
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers
const onPanelsModelValue = (value: any) => {
  if (value == PANEL_VALUE_viber) signalIdDeselect();
};
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "Podešavanja" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--config-index">
    <VToolbarPrimary
      text="Podešavanja"
      :props-title="{ class: 'text-body-1 font-italic' }"
      route-back-name="app"
    >
      <template #prepend>
        <Iconx icon="cog" size="1.22rem" class="ms-1 opacity-20" />
      </template>
    </VToolbarPrimary>
    <VExpansionPanels
      v-model="panelActive"
      id="ID--pSN61tj8eh1KGUMe6t"
      color="on-surface"
      flat
      rounded="0"
      variant="accordion"
      static
      @update:model-value="onPanelsModelValue"
    >
      <VExpansionPanel :value="PANEL_VALUE_viber">
        <VExpansionPanelTitle class="ps-2">
          <span class="d-flex items-center">
            <Iconx icon="viber" size="1.22rem" class="opacity-20 me-3 pa-0" />
            <VBadge
              :model-value="!isEmpty(channels)"
              inline
              :content="len(channels)"
              color="secondary"
            >
              <em class="me-2">Viber kanali</em>
            </VBadge>
          </span>
        </VExpansionPanelTitle>
        <VExpansionPanelText class="*:!p-0">
          <VSheetCrudViberChannels
            v-model="channels"
            :signal-id-deselect="signalIdDeselect.ID.value"
          />
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel value="viber2">
        <VExpansionPanelTitle class="ps-2">
          <span class="d-flex items-center">
            <Iconx icon="viber" size="1.22rem" class="opacity-20 me-3 pa-0" />
            <em>config:B</em>
          </span>
        </VExpansionPanelTitle>
        <VExpansionPanelText class="*:!p-2">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            eos assumenda accusantium.
          </p>
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel value="viber3">
        <VExpansionPanelTitle class="ps-2">
          <span class="d-flex items-center">
            <Iconx icon="viber" size="1.22rem" class="opacity-20 me-3 pa-0" />
            <em>config:C</em>
          </span>
        </VExpansionPanelTitle>
        <VExpansionPanelText class="*:!p-2">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            eos assumenda accusantium.
          </p>
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel value="viber4">
        <VExpansionPanelTitle class="ps-2">
          <span class="d-flex items-center">
            <Iconx icon="viber" size="1.22rem" class="opacity-20 me-3 pa-0" />
            <em>config:D</em>
          </span>
        </VExpansionPanelTitle>
        <VExpansionPanelText class="*:!p-2">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore
            eos assumenda accusantium.
          </p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
#ID--pSN61tj8eh1KGUMe6t .v-expansion-panel-title {
  // padding: 0;
}
</style>
