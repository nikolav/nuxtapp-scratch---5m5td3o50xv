<script setup lang="ts">
// ##imports
// import type { IUser } from "@/types";
import { renderIcon } from "@/components/icons";
// ##config:const
// ##config ##props
const props = defineProps<{
  propsList?: any;
  propsListItem?: any;
  propsListItemTitle?: any;
  propsSelectionCheck?: any;
  //
  itemTitle?: any;
  itemTo?: any;
  itemUrl?: any;
  external?: boolean;
  //
  disabledSkeletonLoader?: boolean;
  //
  signalIdDeselect?: any;
}>();
// const selection = defineModel<IUser[]>();
const selection = defineModel<any[]>();
// ##utils
const attrs = useAttrs();
const it_val = (item: any) => get(item, `raw.${attrs["item-value"] || "id"}`);
// ##icons
const iconfig = {};
const iconCheckOn = renderIcon("check-on", iconfig);
const iconCheckOff = renderIcon("check-off", iconfig);
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const showSelect = computed(() =>
  "show-select" in attrs ? attrs["show-select"] : true
);
// ##forms ##handlers ##helpers
const selectionClear = () => {
  selection.value = undefined;
};
const navigateExternal = async (url: string) =>
  await navigateTo(url, { open: { target: "_blank" } });
// ##watch
watch(
  () => props.signalIdDeselect,
  (ID) => {
    if (ID) selectionClear();
  }
);
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VDataIterator
    v-model="selection"
    class="component--VDataIteratorList"
    :items-per-page="-1"
    return-object
  >
    <template #no-data>
      <slot name="no-data">
        <div v-if="!disabledSkeletonLoader">
          <VSkeletonLoader
            class="mx-auto"
            type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line"
          ></VSkeletonLoader>
        </div>
      </slot>
    </template>
    <template #default="{ items, toggleSelect, isSelected }">
      <VList v-bind="propsList">
        <template v-for="(node, idx) in items" :key="it_val(node)">
          <slot name="list-item" :item="node.raw" :i="idx">
            <VListItem
              @click="
                external
                  ? itemUrl && navigateExternal(itemUrl(node.raw))
                  : undefined
              "
              :to="external ? undefined : itemTo ? itemTo(node.raw) : undefined"
              v-bind="propsListItem"
            >
              <template v-if="showSelect" #prepend>
                <slot name="list-item-prepend" :item="node.raw">
                  <VCheckboxBtn
                    density="comfortable"
                    color="primary"
                    @click.stop="toggleSelect(node)"
                    :model-value="isSelected(node)"
                    :false-icon="iconCheckOff"
                    :true-icon="iconCheckOn"
                    v-bind="propsSelectionCheck"
                  />
                </slot>
              </template>
              <template v-if="$slots['list-item-append']" #append>
                <slot
                  name="list-item-append"
                  :item="node.raw"
                  :isSelected="isSelected([node])"
                  :toggleSelect="() => toggleSelect(node)"
                />
              </template>
              <template #title>
                <VListItemTitle v-bind="propsListItemTitle">
                  <slot name="list-item-title" :item="node.raw">
                    <span>
                      {{ (itemTitle || it_val)(node.raw, idx) }}
                    </span>
                  </slot>
                </VListItemTitle>
              </template>
            </VListItem>
          </slot>
        </template>
      </VList>
    </template>
  </VDataIterator>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
