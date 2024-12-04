<script setup lang="ts">
// ##imports
// ##config:const

// ##config ##props ##route ##attrs
const mItemsPicked = defineModel();
const props = withDefaults(
  defineProps<{
    //
    items: any;
    itemTitle?: any;
    itemValue?: any;
    //
    propsMenu?: any;
    propsList?: any;
    //
    signalIdSelectionReset?: any;
    resetStrategy?: any;
  }>(),
  {
    itemTitle: (item: any) => get(item, "title", item),
    itemValue: (item: any) => get(item, "id", item),
  }
);

const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();
// ##schemas
// ##utils
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const pickItems = (...items: any[]) => {
  mItemsPicked.value = map(items, props.itemValue);
};
const selectionReset = () => {
  if (!props.resetStrategy) {
    pickItems(...props.items);
    return;
  }
  mItemsPicked.value = props.resetStrategy();
};
// ##watch
watch(
  () => props.signalIdSelectionReset,
  (ID) => {
    if (ID) selectionReset();
  }
);
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VBtn class="component--VBtnMenuItemPicker">
    <slot />
    <VMenu
      activator="parent"
      location="bottom end"
      :transition="DEFAULT_TRANSITION"
      :offset="-12"
      :max-width="212"
      v-bind="propsMenu"
    >
      <slot name="list">
        <VList return-object class="py-0" v-bind="propsList">
          <slot name="list-items">
            <VListItem
              v-for="item in items"
              :key="itemValue(item)"
              :title="itemTitle(item)"
              @click="pickItems(item)"
            />
          </slot>
        </VList>
      </slot>
    </VMenu>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
