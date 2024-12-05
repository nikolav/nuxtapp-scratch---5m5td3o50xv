<script setup lang="ts">
// ##imports
import { renderIcon } from "@/components/icons";
// ##config:const

const ttl_default = (item: any) => item?.title ?? item;
const val_default = (item: any) => item?.id ?? item;

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
    propsListItem?: any;
    propsListItemTitle?: any;
    propsIconSelection?: any;
    propsBtnActions?: any;
    //
    signalIdSelectionReset?: any;
    // fn() | "all" | "none"
    resetStrategy?: any;
    //
    multiple?: boolean;
  }>(),
  {
    resetStrategy: "none",
  }
);

const {
  app: { DEFAULT_TRANSITION },
} = useAppConfig();
// ##schemas
// ##utils
const ttl_ = (item: any) => (props.itemTitle ?? ttl_default)(item);
const val_ = (item: any) => (props.itemValue ?? val_default)(item);
// ##icons
const iconCheckOn = renderIcon("check-on");
const iconCheckOff = renderIcon("check-off");
// ##refs ##flags ##models
// cache items to commit later
const itemsIndex_ = ref();
const resetStrategies_ = <any>{
  none: () => {
    itemsIndex_.value = mItemsPicked.value = undefined;
  },
  all: () => {
    itemsIndex_.value = mItemsPicked.value = map(props.items, val_);
  },
};
// ##data ##auth ##state
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const itemsCommit_ = (items: any, done_ = noop) => {
  mItemsPicked.value = map(items, val_);
  nextTick(done_);
};
const isSelected_ = (node: any) => includes(itemsIndex_.value, val_(node));

// takes list:items to select
const pickItems = (items: any) => {
  const values_ = map(items, val_);
  itemsIndex_.value = some(values_, (v: any) => includes(itemsIndex_.value, v))
    ? difference(itemsIndex_.value, values_)
    : union(itemsIndex_.value, values_);
};
// custom list:items to select
const selectionReset = () => {
  const s = String(props.resetStrategy);
  if (s in resetStrategies_) {
    resetStrategies_[s]();
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
      :close-on-content-click="!multiple"
      v-slot="{ isActive }"
      v-bind="propsMenu"
    >
      <slot name="list">
        <VList class="py-0 CLASS--5EMoYmQiC2" v-bind="propsList">
          <slot name="list-items">
            <VListItem
              v-for="item in items"
              :key="val_(item)"
              :title="ttl_(item)"
              @click="(multiple ? pickItems : itemsCommit_)([item])"
              :class="[multiple ? 'ps-1' : '']"
              v-bind="propsListItem"
            >
              <template #title="{ title }">
                <VListItemTitle class="ps-1" v-bind="propsListItemTitle">{{
                  title
                }}</VListItemTitle>
              </template>

              <template v-if="multiple" #prepend>
                <VCheckboxBtn
                  :model-value="isSelected_(item)"
                  color="primary"
                  :true-icon="iconCheckOn"
                  :false-icon="iconCheckOff"
                  v-bind="propsIconSelection"
                />
              </template>
            </VListItem>
          </slot>
        </VList>
      </slot>
      <slot v-if="multiple" name="actions">
        <VBtn
          @click="
            itemsCommit_(itemsIndex_, () => {
              isActive.value = false;
            })
          "
          block
          color="surface"
          elevation="5"
          class="mt-px"
          v-bind="propsBtnActions"
        >
          <slot name="actions-text">
            <span>ok</span>
          </slot>
        </VBtn>
      </slot>
    </VMenu>
  </VBtn>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.CLASS--5EMoYmQiC2 .v-list-item__prepend .v-list-item__spacer {
  width: 0 !important;
}
</style>
