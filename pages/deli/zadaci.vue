<script setup lang="ts">
// ##imports
import { Dump } from "@/components/dev";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "default",
  // middleware: "",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const route = useRoute();
const tkey = computed(() => route.query?.q);
const enabled = computed(() => !!tkey.value);

const {
  db: {
    Assets: {
      type: { DIGITAL_TASKS },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const { isShareable } = useTasksUtils();
// ##icons
// ##refs ##flags ##models
const isBlocked$ = ref();
// ##data ##auth ##state
const auth = useStoreApiAuth();
const search = computed(() => ({
  strategy: "one_by_key",
  args: { key: tkey.value },
}));
const { assets } = useQueryManageAssets(
  DIGITAL_TASKS,
  undefined,
  false,
  { enabled },
  {
    search,
  }
);
// ##computed
const task = computed(() => first(assets.value));
// ##forms ##handlers ##helpers ##small-utils
// ##watch
useOnceMountedOn(task, () => {
  if (!auth.isAuthenticated$) {
    if (!isShareable(task.value)) {
      isBlocked$.value = true;
    }
  }
});

// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✅ Zadaci" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--deli-zadaci">
    <h1>🚧✅</h1>
    <Dump :data="{ task }" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
