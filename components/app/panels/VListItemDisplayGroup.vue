<script setup lang="ts">
// ##imports
import { ProvideAssetsGroupAvatar } from "@/components/app";
import { renderIcon } from "@/components/icons";
// ##config:const
// ##config ##props
const props = defineProps<{
  node?: any;
  i?: number;
  isSelected?: any;
  select?: any;
  //
  propsAvatar?: any;
  propsTitle?: any;
}>();

const {
  app: { DEFAULT_NO_IMAGE_AVAILABLE },
} = useAppConfig();
// ##schemas
// ##utils
// ##icons
const iconCheckOff = renderIcon("mdi:checkbox-blank-circle-outline");
const iconCheckOn = renderIcon("mdi:checkbox-marked-circle");
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const g = computed(() => get(props.node, "raw", {}));
const users = computed(() => get(g.value, "users", []));
// ##forms ##handlers ##helpers
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <VListItem link class="component--VListItemDisplayGroup ma-0 pa-2">
    <template #prepend>
      <ProvideAssetsGroupAvatar :gid="g.key" v-slot="{ avatarImage }">
        <VBadge
          :model-value="!isEmpty(users)"
          :content="users.length"
          color="info"
          location="bottom end"
          offset-x="5"
          offset-y="7"
        >
          <VAvatar
            :image="avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
            size="54"
            v-bind="propsAvatar"
          />
        </VBadge>
      </ProvideAssetsGroupAvatar>
    </template>
    <template #append>
      <span class="d-flex items-center gap-3">
        <VCheckboxBtn
          base-color="secondary-lighten-1"
          class="CLASS--VCheckboxBtn mx-0 scale-[133%]"
          @click.stop
          :model-value="isSelected(node)"
          @update:model-value="select([node], !isSelected(node))"
          density="compact"
          :false-icon="iconCheckOff"
          :true-icon="iconCheckOn"
          color="primary"
        />
      </span>
    </template>
    <VListItemTitle class="pa-0 ma-0" v-bind="propsTitle">
      {{ startCase(g.name) }}
    </VListItemTitle>
  </VListItem>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
