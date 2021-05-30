<template>
  <div id="app">
    <VueTable
      :data="tableData"
      sortBy="name"
      sortOrder="asc"
      pageSize="5"
      @downloadSelectedClicked="downloadSelectedClicked"
    />

    <Dialog :showDialog="showDialog">
      <template slot="header">
        <div class="title">Downloadable Content</div>
        <button
          type="button"
          id="closeBtn"
          class="btn-close"
          @click="closeDialog"
        >
          <i class="fas fa-times"></i>
        </button>
      </template>
      <template slot="body">
        <h4>Available Content</h4>
        <div v-if="availableContent && availableContent.length > 0">
          <div
            class="dialog-body-content"
            v-for="(content, idx) in availableContent"
            :key="idx + content.path"
          >
            <div>
              <span
                ><b>{{ content.device }}</b></span
              >
              : {{ content.path }}
            </div>
            <button
              type="button"
              id="downloadAvailableBtn"
              class="btn btn-push btn-green align-right"
              @click="downloadAvailableFile"
            >
              <i class="fas fa-download"></i> Download
            </button>
          </div>
        </div>
        <div v-else>NONE</div>
        <br />
        <h4>Scheduled Content</h4>
        <div v-if="scheduledContent && scheduledContent.length > 0">
          <div
            class="dialog-body-content"
            v-for="(content, idx) in scheduledContent"
            :key="idx + content.path"
          >
            <div>
              <span
                ><b>{{ content.device }}</b></span
              >
              : {{ content.path }}
            </div>
            <button
              type="button"
              id="downloadScheduledBtn"
              class="btn btn-disabled align-right"
            >
              <i class="fas fa-clock"></i> Scheduled
            </button>
          </div>
        </div>
        <div v-else>NONE</div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import tableData from "@/assets/data/data1.json";
import VueTable from "@/components/VueTable.vue";
import Dialog from "@/components/Dialog.vue";

export default {
  name: "App",
  components: {
    VueTable,
    Dialog,
  },
  data() {
    return {
      tableData: tableData,
      availableContent: [],
      scheduledContent: [],
      showDialog: false,
    };
  },
  methods: {
    downloadSelectedClicked(content) {
      let dialogContent = content.dialogContent;

      dialogContent = this.groupBy(dialogContent, "status");
      this.scheduledContent =
        dialogContent.scheduled &&
        dialogContent.scheduled.map(({ device, path }) => ({ device, path }));
      this.availableContent =
        dialogContent.available &&
        dialogContent.available.map(({ device, path }) => ({ device, path }));
      this.showDialog = true;
    },
    groupBy(arr, property) {
      return arr.reduce((acc, cur) => {
        acc[cur[property]] = [...(acc[cur[property]] || []), cur];
        return acc;
      }, {});
    },
    closeDialog() {
      this.showDialog = false;
      this.scheduledContent = [];
      this.availableContent = [];
    },
    downloadAvailableFile() {
      alert("Your file is being downloaded now!!");
    },
  },
};
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

dialog .dialog-body-content {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f3f4;
  padding: 4px;
  margin: 5px;
  border-radius: 5px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

dialog .title {
  font-weight: bold;
}

.btn,
select {
  background-color: #ffffff;
  font-size: 1em;
  padding: 5px;
  border: 1px solid #999999;
  cursor: pointer;
  border-radius: 5px;
  margin: 5px;
  transition: All 250ms ease;
}

.btn-green {
  background-color: #04aa6d;
}

.btn-disabled {
  cursor: not-allowed;
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}

.btn-close {
  cursor: pointer;
  border: none;
  outline: none;
  background: none;
  font-size: 1em;
  font-weight: bold;
}

.btn:hover {
  background-color: #f5deb3;
}

.btn-close:hover {
  color: #ffffff;
}

.btn:active {
  box-shadow: 0 5px #666666;
  transform: translateY(1px);
}

.align-right {
  margin-left: auto;
}

.screenreader-only {
  border: none;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

@media screen and (max-width: 415px) {
  #app {
    font-size: 1em;
  }

  dialog .dialog-body-content {
    display: block;
  }
}
</style>
