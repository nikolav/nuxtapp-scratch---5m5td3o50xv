<script setup lang="ts">
// ##imports
import type { IConfigFields } from "@/types";
import {
  VToolbarPrimary,
  VTextFieldsList,
  VBtnSave,
  VSnackbarMain,
} from "@/components/app";
// ##config:const
// ##config ##props ##route ##attrs ##form-fields
definePageMeta({
  layout: "app-default",
  middleware: "authorized",
  "@page": {
    // appBarTitle: "",
    // htmlClass: "",
    // bodyClass: "",
    // appClass: "",
  },
});

const {
  db: {
    Assets: {
      type: { DIGITAL_TASKS },
    },
  },
} = useAppConfig();
// ##schemas
// ##utils
const ps = useProcessMonitor();
// ##icons
// ##refs ##flags ##models
const taskCreated_ = ref();
const toggleTasksCreated = useToggleFlag();
const mSubtasks = ref();
// ##data ##auth ##state
const { commit } = useQueryManageAssets(DIGITAL_TASKS, undefined, undefined, {
  enabled: false,
});
// ##computed
// ##forms ##handlers ##helpers ##small-utils
const FIELDS_tasks_new = <Record<string, IConfigFields>>{
  name: {
    label: "Naziv",
    icon: {
      icon: "tag",
      size: "1.22rem",
      class: "mx-1 opacity-20",
    },
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
  notes: {
    type: "textarea",
    label: "Opis",
    icon: {
      icon: "$edit",
      size: "1.22rem",
      class: "mx-1 opacity-20",
    },
    props: {
      variant: "underlined",
      clearable: true,
    },
  },
  tasks: {
    "@table:data": true,
    type: "tasks",
  },
};
const form = useFormModel(
  "bdabfbab-9557-5cbc-8678-8d4aad050104",
  FIELDS_tasks_new,
  {
    onSubmit: async (data: any) => {
      let res: any;
      try {
        const d = reduce(
          FIELDS_tasks_new,
          (res: any, _item: any, field: string) => {
            if ("tasks" == field) {
              res.data.tasks = map(data.tasks, (t: any) => ({
                ...omit(t, "contact"),
                title: t.contact,
                complete: false,
              }));
            } else {
              res[field] = data[field];
            }
            return res;
          },
          <any>{ data: {} }
        );
        ps.begin(() => {
          taskCreated_.value = undefined;
          toggleTasksCreated.off();
        });
        res = await commit(d);
        if (get(res, "data.assetsUpsert.error"))
          throw "@error:tasks-new:6uF4KQtO";
      } catch (error) {
        ps.setError(error);
      } finally {
        ps.done();
      }
      if (!ps.error.value)
        ps.successful(() => {
          taskCreated_.value = get(res, "data.assetsUpsert.status.asset");
          toggleTasksCreated.on();
          nextTick(form.clear);
        });
      console.log("@debug:tasks-add", ps.error.value);
    },
  }
);
// ##watch
// ##hooks ##lifecycle
// ##head ##meta
useHead({ title: "✨✅ Nov zadatak" });
// ##provide
// ##io

// @@eos
</script>
<template>
  <section class="page--zadaci-nov">
    <VSnackbarMain
      color="success-darken-1"
      v-model="toggleTasksCreated.isActive.value"
    >
      <NuxtLink :to="{ name: 'deli-zadaci', query: { q: taskCreated_?.key } }">
        <a class="link--prominent">
          <p>✅ Zadatak je uspešno sačuvan.</p>
        </a>
      </NuxtLink>
    </VSnackbarMain>
    <VToolbarPrimary
      text="Nov zadatak"
      :props-title="{ class: 'text-body-1 text-start font-italic ps-4 ms-0' }"
      route-back-name="zadaci"
    >
      <template #prepend>
        <Iconx icon="task-alt" size="1.22rem" class="opacity-20 mx-1" />
      </template>
    </VToolbarPrimary>
    <VForm @submit.prevent="form.submit">
      <VCard flat rounded="0" elevation="0">
        <VCardText>
          <template v-for="(item, field) in FIELDS_tasks_new" :key="field">
            <VTextField
              v-if="!item.type"
              v-model="form.data[field].value"
              :label="item.label"
              v-bind="item.props"
            >
              <template #prepend-inner>
                <Iconx v-bind="item.icon" />
              </template>
            </VTextField>
            <VTextarea
              v-else-if="'textarea' == item.type"
              v-model="form.data[field].value"
              :label="item.label"
              v-bind="item.props"
            >
              <template #prepend-inner>
                <Iconx v-bind="item.icon" />
              </template>
            </VTextarea>
            <template v-else-if="'tasks' == item.type">
              <VSpacer class="mt-5" />
              <VCardActions >
                <VTextFieldsList
                  v-model="form.data[field].value"
                  label="Zadaci"
                  class="grow"
                />
              </VCardActions>
            </template>
          </template>
        </VCardText>
        <VSpacer class="mt-10" />
        <VCardActions>
          <VSpacer />
          <VBtnSave size="x-large" variant="elevated" type="submit" />
          <VSpacer />
        </VCardActions>
      </VCard>
    </VForm>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
