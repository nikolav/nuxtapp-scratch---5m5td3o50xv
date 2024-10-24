<script setup lang="ts">
// ##imports
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// ##config ##const
definePageMeta({
  layout: "app-default",
});
// ##utils
// ##icons
// ##refs ##flags
// ##data ##auth ##state
const chartData = {
  labels: ["January", "February", "March"],
  datasets: [{ data: [40, 20, 12] }],
};
const chartOptions = {
  responsive: true,
};

// ##computed
// ##forms ##helpers ##handlers
// ##watch
// ##hooks:lifecycle
// ##head
useHead({ title: "--app" });

// @@eos
</script>
<template>
  <section class="page--app">
    <h1>@app</h1>
    <Bar :data="chartData" :options="chartOptions" />
  </section>
</template>
<style lang="scss" scoped></style>
<style module></style>
<style lang="scss"></style>
