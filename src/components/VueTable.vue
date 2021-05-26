<template>
  <div>
    <table summary="List of files that can be downloaded">
      <caption>
        Downloadable Files list
      </caption>
      <thead>
        <tr>
          <th scope="col">
            <label>
              <input
                type="checkbox"
                v-model="selectAllChkboxModel"
                v-indeterminate="indeterminateChkboxModel"
                @click="selectAllItems"
              />
              <i class="form-icon"></i>
            </label>
          </th>
          <th scope="col">
            {{ getSelectedCount }}
          </th>
          <th scope="col">
            <button class="btn" @click="downloadSelected">
              <i class="fa fa-download"></i> Download Selected
            </button>
          </th>
          <th :colspan="cols.length - 2"></th>
        </tr>
        <tr>
          <th colspan="1"></th>
          <th scope="col" v-for="(col, index) in cols" :key="index">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIdx) in data"
          :key="rowIdx"
          :class="{ 'tbl-row-selected': selected.indexOf(row.name) > -1 }"
        >
          <td>
            <label>
              <input type="checkbox" :value="row.name" v-model="selected" />
              <i class="form-icon"></i>
            </label>
          </td>
          <td :data-label="col" v-for="(col, colIdx) in cols" :key="colIdx">
            <span
              v-if="
                col.toUpperCase() == 'STATUS' &&
                row[col].toUpperCase() == 'AVAILABLE'
              "
            >
              <svg height="20" width="20">
                <circle cx="10" cy="10" r="5" fill="green" />
              </svg>
            </span>
            <span> {{ row[col] }} </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "VueTable",
  props: {
    data: Array,
  },
  data() {
    return {
      cols: [],
      selected: [],
      selectAllChkboxModel: false,
      indeterminateChkboxModel: false,
    };
  },
  created() {
    if (this.data.length) this.cols = Object.keys(this.data[0]);
  },
  computed: {
    getSelectedCount() {
      return this.selected.length > 0
        ? "Selected " + this.selected.length
        : "None Selected";
    },
  },
  methods: {
    selectAllItems() {
      this.selected = [];
      if (!this.selectAllChkboxModel) {
        for (let i in this.data) {
          this.selected.push(this.data[i].name);
        }
      }
    },
    downloadSelected() {},
  },
  watch: {
    selected: function () {
      if (this.selected.length == this.data.length) {
        this.selectAllChkboxModel = true;
        this.indeterminateChkboxModel = false;
      } else if (this.selected.length == 0) {
        this.selectAllChkboxModel = false;
        this.indeterminateChkboxModel = false;
      } else this.indeterminateChkboxModel = true;
    },
  },
};
</script>

<style scoped>
table {
  font-family: "Open Sans", sans-serif;
  width: 100%;
  border-collapse: collapse;
  border: 2px solid #d1cccc;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-transform: capitalize;
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table th {
  text-align: left;
  padding: 12px;
  min-width: 30px;
  border-bottom: 1px solid#e0e0e0;
}

tbody tr {
  border-bottom: 1px solid#e0e0e0;
}

tbody tr:hover {
  background-color: #f7f5f5;
  cursor: pointer;
}

table td {
  text-align: left;
  padding: 10px;
}

.btn {
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
}

.btn-green {
  background-color: green;
  color: white;
  padding: 5px;
  border: 1px solid white;
  border-radius: 5px;
}

.tbl-row-selected {
  background-color: #ececec;
  cursor: pointer;
}
</style>