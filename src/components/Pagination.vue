<template>
  <nav>
    Records/Page:
    <select
      name="pageSizes"
      id="pageSize-select"
      @change="pageSizeChanged($event)"
    >
      <option value="3">3</option>
      <option value="5" selected>5</option>
      <option value="7">7</option>
      <option value="10">10</option>
      <option value="20">20</option>
    </select>
    {{ pageSize * currPage - pageSize + 1 }}
    -
    {{ pageSize * currPage - pageSize + Math.min(pageSize, currPageLength) }}
    of
    {{ totalItems }}
    <button type="button" class="btn" @click="prevPage">
      <i class="fas fa-caret-left"></i>
      Prev
    </button>
    <button type="button" id="nextBtn" class="btn" @click="nextPage">
      Next
      <i class="fas fa-caret-right"></i>
    </button>
  </nav>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pageSizeNo: {
      type: String,
      required: true,
    },
    currPageNo: {
      required: true,
    },
    currPageLength: {
      type: Number,
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currPage: "",
      pageSize: "",
    };
  },
  created() {
    this.currPage = this.currPageNo;
    this.pageSize = this.pageSizeNo;
  },
  methods: {
    pageSizeChanged(event) {
      if (this.currPageNo * event.target.value > this.totalItems)
        this.currPage = 1;
      this.pageSize = event.target.value;

      this.$emit("pageSizeUpdated", {
        currentPage: this.currPage,
        pageSizeNo: this.pageSize,
      });
    },
    prevPage() {
      if (this.currPage > 1) this.currPage--;

      this.$emit("prevPageClicked", {
        currentPage: this.currPage,
      });
    },
    nextPage() {
      if (this.currPage * this.pageSize < this.totalItems) this.currPage++;

      this.$emit("nextPageClicked", {
        currentPage: this.currPage,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>