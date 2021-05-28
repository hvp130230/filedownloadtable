<template>
  <div v-if="showTable">
    <table summary="List of files that can be downloaded">
      <caption>
        Downloadable Files list
      </caption>
      <thead>
        <tr>
          <th scope="col">
            <label for="check all rows">
              <input
                id="selectAllChkbox"
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
            <button
              id="downloadBtn"
              class="btn"
              @click="downloadSelected"
              :class="{ 'btn-disabled': selected.length == 0 }"
            >
              <i class="fa fa-download"></i> Download Selected
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
                'fa fa-caret-up': sortByDir == 'asc' && sortByField == col,
                'fa fa-caret-down': sortByDir == 'desc' && sortByField == col,
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
            <label for="check this row">
              <input
                type="checkbox"
                :value="row.name + '_' + row.path"
                v-model="selected"
              />
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
                <circle cx="8" cy="12" r="8" fill="#8dd136" />
              </svg>
            </span>
            <span> {{ row[col] }} </span>
          </td>
        </tr>
        <tr>
          <td :colspan="cols.length + 1">
            Showing
            {{ pageSize * currentPage - pageSize + 1 }}
            -
            {{
              pageSize * currentPage -
              pageSize +
              Math.min(pageSize, sortedData.length)
            }}
            of
            {{ data.length }}
            <button class="btn" @click="prevPage">
              <i class="fa fa-caret-left"></i>
              Prev
            </button>
            <button class="btn" @click="nextPage">
              Next
              <i class="fa fa-caret-right"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <dialog open id="dialog" v-if="showDialog">
      <div class="dialog-header">
        <div class="title">Downloadable Content</div>
        <button class="btn-close" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="dialog-content">
        <h4>Available Content</h4>
        <div class="all-content" v-if="availableContent && availableContent.length > 0">
          <div
            class="available-content"
            v-for="(content, idx) in availableContent"
            :key="idx + content.path"
            @click="downloadAvailableFile"
            title="Click to download"
          >
            <span
              ><b>{{ content.device }}</b></span
            >:
            {{ content.path }}
          </div>
        </div>
        <div v-else>NONE</div>
        <br />
        <h4>Scheduled Content</h4>
        <div class="all-content" v-if="scheduledContent && scheduledContent.length > 0">
          <div
            class="unavailable-content"
            v-for="(content, idx) in scheduledContent"
            :key="idx + content.path"
          >
            <span
              ><b>{{ content.device }}</b></span
            >:
            {{ content.path }}
          </div>
        </div>
        <div v-else>NONE</div>
      </div>
    </dialog>
    <div id="overlay" :class="{ active: showDialog }"></div>
  </div>
  <div v-else>
    <div class="no-data">No data to show right now!!</div>
  </div>
</template>

<script>
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
      showDialog: false,
      dialogContent: [],
      availableContent: [],
      scheduledContent: [],
      sortByField: "name",
      sortByDir: "asc",
      pageSizeNo: "5",
      currentPage: "1",
      showTable: false,
    };
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
        dialogContent = this.groupBy(dialogContent, "status");
        this.scheduledContent =
          dialogContent.scheduled &&
          dialogContent.scheduled.map(({ device, path }) => ({ device, path }));
        this.availableContent =
          dialogContent.available &&
          dialogContent.available.map(({ device, path }) => ({ device, path }));
        this.showDialog = true;

        return;
      }
    },
    closeDialog() {
      this.showDialog = false;
      this.scheduledContent = [];
      this.availableContent = [];
    },
    groupBy(arr, property) {
      return arr.reduce((acc, cur) => {
        acc[cur[property]] = [...(acc[cur[property]] || []), cur];
        return acc;
      }, {});
    },
    sort(colName) {
      if (colName === this.sortByField) {
        this.sortByDir = this.sortByDir === "asc" ? "desc" : "asc";
      }
      this.sortByField = colName;
    },
    nextPage() {
      if (this.currentPage * this.pageSizeNo < this.data.length)
        this.currentPage++;
    },
    prevPage: function () {
      if (this.currentPage > 1) this.currentPage--;
    },
    rowSelected(id) {
      if (id && !this.selected.includes(id)) {
        this.selected.push(id);
      } else this.selected.splice(this.selected.indexOf(id), 1);
    },
    downloadAvailableFile() {
      alert('Your file is being downloaded now!!');
    }
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

.btn {
  background-color: white;
  font-size: 1em;
  padding: 5px;
  border: 1px solid #999999;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px;
}

.btn-disabled {
  cursor: not-allowed;
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}

dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0;
  bottom: 0;
  padding: 0;
  width: 45%;
  background-color: white;
  border: none;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 2;
}

.dialog-header {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  border-radius: 5px 5px 0px 0px;
  background-color: #cfcfcf;
  border-bottom: 1px solid black;
}

.dialog-header .title {
  font-size: 1em;
  font-weight: bold;
}

.dialog-header .btn-close {
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  font-size: 1em;
  font-weight: bold;
}

.dialog-header .btn-close:hover {
  color:white;
}

.dialog-content {
  padding: 10px;
  height: 40vh;
  overflow: auto;
  text-align: left;
  word-wrap: break-word;
}

.all-content {
  display: inline-block;
  margin-right: 0.2rem;
  text-decoration: none;
}

.all-content .available-content{
  cursor: pointer;
}

.all-content .unavailable-content{
  cursor: not-allowed;
}

.all-content .available-content::before {
  content: "✅";
}

.all-content .unavailable-content::before {
  content: "❌";
}

#overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
  pointer-events: none;
  opacity: 0;
}

#overlay.active {
  opacity: 1;
  pointer-events: all;
}
</style>