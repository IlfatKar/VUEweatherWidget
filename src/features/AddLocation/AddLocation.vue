<template>
  <a-col class="AddLocation">
    <a-typography-title :level="3"> Add Location: </a-typography-title>
    <a-input-group compact class="inputGroup">
      <a-input
        placeholder="London"
        :value="city"
        :status="isError ? 'error' : ''"
        @change="changeHandler"
        @keyup.enter="addCityWrapper"
      />
      <a-button type="primary" :loading="isLoading" @click="addCityWrapper"
        >Save</a-button
      >
    </a-input-group>
  </a-col>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { InputSearch, InputGroup } from "ant-design-vue";
const props = defineProps<{
  addCity: (city: string, completeLoad: () => void) => void;
}>();

const city = ref<string>("");
const isLoading = ref<boolean>(false);
const isError = ref<boolean>(false);

const changeHandler = (event: Event) => {
  isError.value = false;
  city.value = (event.target as HTMLInputElement).value.trim();
};
const addCityWrapper = () => {
  if (city.value) {
    isLoading.value = true;
    props.addCity(city.value, () => {
      isLoading.value = false;
      city.value = "";
    });
    return;
  }
  isError.value = true;
};
</script>

<style lang="scss" scoped>
.AddLocation {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fafafa;
  padding-top: 4px;
  .inputGroup {
    display: flex;
  }
}
</style>
