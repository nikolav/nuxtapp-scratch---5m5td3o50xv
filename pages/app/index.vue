<script setup lang="ts">
// ##imports
import axios from "axios";
import { schemaHasTitleNonempty } from "@/schemas";
// ##config ##const
definePageMeta({
  layout: "app-default",
});
// ##utils
const { $dd } = useNuxtApp();
const { x, y } = useMouse();
const foo = useStoreFoo();
const t = useUtilsTree();
t.value.append(t.value.node({ value: "@n:1" }));
// ##icons
// ##refs ##flags
const counter = ref(0);
// ##data ##auth ##state
// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head
useHead({ title: "--about" });
watchEffect(() => {
  console.log(get({ counter: counter.value }, "counter"));
});
const ok = async () => {
  counter.value += 1;
  foo.dump();
  console.log(t.value.lsa());
  console.log({ "has:title": schemaHasTitleNonempty.parse({ title: "foo" }) });
  console.log(`mouse ${x.value} ${y.value}`);
  console.log({
    axios: await axios({
      url: ".",
    }),
  });
  console.log({
    dayjs: $dd.utc().add(1, "day").local().format("D. MMMM YYYY."),
  });
};
// @@eos
</script>
<template>
  <section class="page--about">
    <h1>@app</h1>
    <pre>Counter is: [{{ counter }}]</pre>
    <button @click="ok">ok</button>
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
