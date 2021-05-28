<template>
  <div id="app">
    <VueTable :data="tableData" sortBy="name" sortOrder="desc" pageSize="5" />
  </div>
</template>

<script>
import VueTable from '@/components/VueTable.vue';
import tableData from '@/assets/data/data1.json';

export default {
  name: 'App',
  components: {
    VueTable
  },
  data() {
    return {
      tableData:tableData
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0;
  margin: 0;
}
</style>
