<script setup lang="ts">
// ##imports
import type { IUser } from "@/types";
import { renderIcon } from "@/components/icons";
// ##config:const
// ##config ##props
const props = withDefaults(
  defineProps<{
    propsList?: any;
    propsListItem?: any;
    propsListItemTitle?: any;
    propsSelectionCheck?: any;
    // calc :to route
    itemTo?: any;
    itemTitle?: any;
    //
    disabledSkeletonLoader?: boolean;
  }>(),
  {
    itemTitle: (node: any) => String(node?.id),
  }
);
const selection = defineModel<IUser[]>();
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
// ##watch
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
    <template #default="{ items, toggleSelect }">
      <VList v-bind="propsList">
        <template v-if="showSelect" v-for="node in items" :key="it_val(node)">
          <slot name="list-item" :item="node.raw">
            <VListItem
              :to="itemTo ? itemTo(node.raw) : undefined"
              v-bind="propsListItem"
            >
              <template #prepend>
                <VCheckboxBtn
                  density="comfortable"
                  color="primary"
                  @click.stop="toggleSelect(node)"
                  :false-icon="iconCheckOff"
                  :true-icon="iconCheckOn"
                  v-bind="propsSelectionCheck"
                />
              </template>
              <template v-if="$slots['list-item-append']" #append>
                <slot name="list-item-append" :item="node.raw" />
              </template>
              <template #title>
                <VListItemTitle v-bind="propsListItemTitle">
                  <slot name="list-item-title" :item="node.raw">
                    <span>
                      {{ (itemTitle || it_val)(node.raw) }}
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
