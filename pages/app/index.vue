<script setup lang="ts">
// ##imports
import axios from "axios";
import chroma from "chroma-js";
import FormData from "form-data";
import EE3 from "eventemitter3";
import md5 from "md5";
import { saveAs as fileSaveAs } from "file-saver";
import { parseURL } from "ufo";
import printJS from "print-js";
import { types, extensions } from "mime-types";
import parseShell from "minimist";

import { schemaHasTitleNonempty } from "@/schemas";

// ##config ##const
definePageMeta({
  layout: "app-default",
});
// ##utils
const ee = new EE3();
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
  ee.on("evt", (...args: any[]) => {
    console.log({ EE3: args });
  });
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
  console.log({ "chroma:primary": chroma("#184c9f").hsl() });
  const fdata = new FormData();
  fdata.append("foo", "file");
  console.log({ fdata });
  console.log({ "validator:isEmail": isEmail("admin@nikolav.rs") });
  console.log({ "uuid:v4": uuid() });

  ee.emit("evt");
  console.log({ "md5:foo": md5("foo") });
  console.log({ "ufo:parseURL": parseURL("http://nikolav.rs/?key=foo") });
  printJS({ printable: "/foo.pdf", type: "pdf" });
  console.log({ "mimes:types": { types, extensions } });
  console.log({ minimist: parseShell(["prog", "cmd", "--foo", "bar", "-x"]) });
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
