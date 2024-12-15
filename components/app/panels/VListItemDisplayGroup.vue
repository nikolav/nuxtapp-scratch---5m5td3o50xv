<script setup lang="ts">
// ##imports
import { ProvideAssetsGroupAvatar, VBtnMenuListItems } from "@/components/app";
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
const { showUserScreen } = useNavigationUtils();
const { calcDisplayName } = useAuthUtils();
// ##icons
const iconCheckOff = renderIcon("mdi:checkbox-blank-circle-outline");
const iconCheckOn = renderIcon("mdi:checkbox-marked-circle");
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const g = computed(() => get(props.node, "raw", {}));
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
        <VAvatar
          :image="avatarImage || DEFAULT_NO_IMAGE_AVAILABLE"
          size="54"
          v-bind="propsAvatar"
        />
      </ProvideAssetsGroupAvatar>
    </template>
    <template #append>
      <span class="d-flex items-center gap-3">
        <VBtnMenuListItems
          @click.stop.prevent
          :items="get(g, 'users')"
          :props-avatar="{ color: 'info-darken-1' }"
        >
          <template #title="{ item }">
            <a
              class="link--prominent text-primary-darken-1"
              @click.stop="showUserScreen(item.id)"
            >
              <span>
                {{ calcDisplayName(item) }}
              </span>
            </a>
          </template>
        </VBtnMenuListItems>
        <VCheckboxBtn
          base-color="secondary-lighten-1"
          class="CLASS--VCheckboxBtn mx-0 scale-[122%]"
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
