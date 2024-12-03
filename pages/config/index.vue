<script setup lang="ts">
// ##imports
import { VToolbarPrimary } from "@/components/app";
// ##config:const
// ##config ##props
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
});

const {
  layout: { toolbarMainHeight },
} = useAppConfig();

// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
const panelActive = useGlobalVariable(
  "config:060a891b-8661-5c1d-8b5d-3810de953f0a"
);
// ##data ##auth ##state
// ##computed
const sizeBtnToolbar = toolbarMainHeight - 2;
// ##forms ##handlers ##helpers
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
    >
      <VExpansionPanel value="viber">
        <VExpansionPanelTitle class="ps-2">
          <span class="d-flex items-center">
            <Iconx icon="viber" size="1.22rem" class="opacity-20 me-3 pa-0" />
            <em>Viber kanali</em>
          </span>
        </VExpansionPanelTitle>
        <VExpansionPanelText class="*:!p-0">
          <VToolbarPrimary color="transparent" hide-default-close class="pe-3">
            <template #default>
              <VSpacer />
              <div class="__spacer space-x-5">
                <VBtn :size="sizeBtnToolbar" variant="plain" icon>
                  <Iconx icon="$plus" />
                </VBtn>
                <VBtn :size="sizeBtnToolbar" variant="plain" icon color="error">
                  <Iconx icon="$minus" />
                </VBtn>
              </div>
            </template>
          </VToolbarPrimary>
          <VResponsive :height="192" class="overflow-y-auto">
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Cupiditate, sed esse sequi, ab repellendus nulla ducimus pariatur
              corporis quas itaque, expedita doloremque voluptatem tenetur
              ratione nesciunt reprehenderit aut illum adipisci.
            </p>
          </VResponsive>
        </VExpansionPanelText>
      </VExpansionPanel>
      <VExpansionPanel value="viber2">
        <VExpansionPanelTitle class="ps-2">
          <span class="d-flex items-center">
            <Iconx icon="viber" size="1.22rem" class="opacity-20 me-3 pa-0" />
            <em>config</em>
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
            <em>config</em>
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
            <em>config</em>
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
