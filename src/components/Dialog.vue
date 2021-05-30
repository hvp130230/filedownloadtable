<template>
  <div class="modal-container">
    <dialog open id="dialog" v-if="showDialog">
      <div class="dialog-header">
        <slot name="header"> default header </slot>
      </div>
      <div class="dialog-content">
        <slot name="body"> default body </slot>
      </div>
    </dialog>
    <div id="overlay" :class="{ active: showDialog }"></div>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    showDialog: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  transition: all 300ms ease;
}

.dialog-header {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  border-radius: 5px 5px 0px 0px;
  background-color: #cfcfcf;
  border-bottom: 1px solid black;
}

.dialog-content {
  padding: 10px;
  height: 40vh;
  overflow: auto;
  text-align: left;
  word-wrap: break-word;
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
  transition: all 300ms ease;
}

#overlay.active {
  opacity: 1;
  pointer-events: all;
}

@media screen and (max-width: 415px) {
  dialog {
    width: 85%;
  }

  .dialog-content {
    height: 60vh;
  }
}
</style>