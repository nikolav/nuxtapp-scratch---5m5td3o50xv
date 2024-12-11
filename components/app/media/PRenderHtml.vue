import { primary } from '../../../assets/themes/dark.theme';
<script setup lang="ts">
// ##imports
import { useTheme } from "vuetify";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
const props = defineProps<{ html?: any }>();
// ##schemas
// ##utils
const { current } = useTheme();
// ##icons
// ##refs ##flags ##models
// ##data ##auth ##state
// ##computed
const primary_ = computed(() => get(current.value, "colors.primary", "blue"));
// ##forms ##handlers ##helpers ##small-utils
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
// ##provide
// ##io

// @@eos
</script>
<template>
  <p v-html="html" class="component--PRenderHtml" />
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss">
.component--PRenderHtml {
  em {
    font-style: italic;
  }
  .ql-size-large {
    font-size: 150%;
  }
  a {
    color: v-bind(primary_);
  }
  .ql-align-right {
    text-align: end;
  }
  .ql-align-center {
    text-align: center;
  }
  .ql-align-justify {
    text-align: justify;
  }
}
</style>
