<template>
  <div v-if="showTable">
    <table summary="List of files that can be downloaded">
      <caption>
        Downloadable Files list
      </caption>
      <thead>
        <tr>
          <th scope="col">
            <input
              id="selectAllChkbox"
              type="checkbox"
              name="selectAllCheckboxes"
              v-model="selectAllChkboxModel"
              v-indeterminate="indeterminateChkboxModel"
              @click="selectAllItems"
            />
            <label class="screenreader-only" for="selectAllChkbox"
              >Select All Rows</label
            >
          </th>
          <th scope="col">
            {{ getSelectedCount }}
          </th>
          <th scope="col">
            <button
              type="button"
              id="downloadSelectedBtn"
              class="btn"
              @click="downloadSelected"
              :class="{ 'btn-disabled': selected.length == 0 }"
            >
              <i class="fas fa-download"></i> Download Selected
            </button>
          </th>
          <th :colspan="cols.length - 2"></th>
        </tr>
        <tr>
          <th colspan="1"></th>
          <th
            scope="col"
            v-for="(col, index) in cols"
            :key="index"
            @click="sort(col)"
          >
            {{ col }}
            <i
              :class="{
                'fas fa-caret-up': sortByDir == 'asc' && sortByField == col,
                'fas fa-caret-down': sortByDir == 'desc' && sortByField == col,
              }"
            ></i>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIdx) in sortedData"
          :key="rowIdx"
          :class="{
            'tbl-row-selected':
              selected.indexOf(row.name + '_' + row.path) > -1,
          }"
          @click="rowSelected(row.name + '_' + row.path)"
        >
          <td>
            <input
              :id="row.name + '_' + rowIdx"
              type="checkbox"
              name="downloadTableRows"
              :value="row.name + '_' + row.path"
              v-model="selected"
            />
            <label class="screenreader-only" :for="row.name + '_' + rowIdx"
              >Select row {{ rowIdx }}
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
                <circle cx="8" cy="12" r="8" fill="#8dd136" />
              </svg>
            </span>
            <span> {{ row[col] }} </span>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <Pagination
      :pageSizeNo="pageSizeNo"
      :currPageNo="currentPage"
      :currPageLength="sortedData.length"
      :totalItems="data.length"
      @prevPageClicked="prevPage"
      @nextPageClicked="nextPage"
      @pageSizeUpdated="pageSizeChanged"
    />

    <div class="resp-header">
      <input
        id="selectAllChkbox-resp"
        type="checkbox"
        name="selectAllCheckboxes"
        v-model="selectAllChkboxModel"
        v-indeterminate="indeterminateChkboxModel"
        @click="selectAllItems"
      />
      <label class="screenreader-only" for="selectAllChkbox-resp"
        >Select All Rows</label
      >
      {{ getSelectedCount }}
      <button
        type="button"
        id="downloadSelectedBtn-resp"
        class="btn"
        @click="downloadSelected"
        :class="{ 'btn-disabled': selected.length == 0 }"
      >
        <i class="fas fa-download"></i> Download
      </button>
    </div>
  </div>
  <div v-else>
    <div class="no-data">No data to show right now!!</div>
  </div>
</template>

<script>
import Pagination from "./Pagination.vue";
export default {
  name: "VueTable",
  props: {
    data: {
      default: () => [],
      type: [Array, Function],
    },
    sortBy: {
      type: String,
      required: false,
    },
    sortOrder: {
      type: String,
      required: false,
    },
    pageSize: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      cols: [],
      selected: [],
      selectAllChkboxModel: false,
      indeterminateChkboxModel: false,
      sortByField: "name",
      sortByDir: "asc",
      pageSizeNo: "5",
      currentPage: "1",
      showTable: false,
    };
  },
  components: {
    Pagination,
  },
  created() {
    if (!this.data || !this.data.length) {
      return;
    }
    if (this.data && this.data.length) this.cols = Object.keys(this.data[0]);
    this.pageSizeNo = this.pageSize || "5";
    this.sortByField = this.sortBy || "name";
    this.sortByDir = this.sortOrder || "asc";
    this.showTable = true;
  },
  computed: {
    getSelectedCount() {
      return this.selected.length > 0
        ? "Selected " + this.selected.length
        : "None Selected";
    },
    sortedData() {
      return (
        this.data &&
        this.data
          .slice(0)
          .sort((a, b) => {
            //sorting first as results will get sorted per page else
            if (a[this.sortByField] < b[this.sortByField])
              return -1 * (this.sortByDir === "desc" ? -1 : 1);
            if (a[this.sortByField] > b[this.sortByField])
              return 1 * (this.sortByDir === "desc" ? -1 : 1);
            return 0;
          })
          .filter((row, index) => {
            let start = (this.currentPage - 1) * this.pageSizeNo;
            let end = this.currentPage * this.pageSizeNo;
            if (index >= start && index < end) return true;
          })
      );
    },
  },
  methods: {
    selectAllItems() {
      this.selected = [];
      if (!this.selectAllChkboxModel) {
        for (let i in this.data) {
          this.selected.push(this.data[i].name + "_" + this.data[i].path);
        }
      }
    },
    downloadSelected() {
      if (this.selected.length) {
        let dialogContent = this.data.filter((item) =>
          this.selected.includes(item.name + "_" + item.path)
        );

        this.$emit("downloadSelectedClicked", {
          dialogContent: dialogContent,
        });
      }
    },
    sort(colName) {
      if (colName === this.sortByField) {
        this.sortByDir = this.sortByDir === "asc" ? "desc" : "asc";
      }
      this.sortByField = colName;
    },
    nextPage(payload) {
      this.currentPage = payload.currentPage;
    },
    prevPage(payload) {
      this.currentPage = payload.currentPage;
    },
    rowSelected(id) {
      if (id && !this.selected.includes(id)) {
        this.selected.push(id);
      } else this.selected.splice(this.selected.indexOf(id), 1);
    },
    pageSizeChanged(payload) {
      this.currentPage = payload.currentPage;
      this.pageSizeNo = payload.pageSizeNo;
    },
  },
  watch: {
    selected: function () {
      if (
        this.selected &&
        this.data &&
        this.selected.length == this.data.length
      ) {
        this.selectAllChkboxModel = true;
        this.indeterminateChkboxModel = false;
      } else if (this.selected && this.selected.length == 0) {
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

tbody .tbl-row-selected {
  background-color: #ececec;
  cursor: pointer;
}

table td {
  text-align: left;
  padding: 10px;
}

table .no-data {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.resp-header {
  display: none;
}

@media screen and (max-width: 415px) {
  table {
    border: 0;
    margin: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table th {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  tbody tr {
    border: 1px solid#e0e0e0;
    display: grid;
    margin: 5px;
  }

  table td {
    text-align: right;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: capitalize;
  }

  .resp-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f2f3f4;
    padding: 4px;
    margin: 5px;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
}
</style>