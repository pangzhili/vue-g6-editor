<template>
  <div class="itempannel" :style="{width:width + 'px'}">
    <Item/>
  </div>
</template>

<script>
import Item from "./item";
import eventBus from "../../utils/eventBus";

export default {
  components: {Item},
  data() {
    return {
      page: null,
      command: null,
      width: 250
    };
  },
  created() {
    this.bindEvent();
  },
  mounted() {
    eventBus.$on('itemPanelResize', newWidth => {
      this.width = `${newWidth}`
    });
  },
  methods: {
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
      });
    },
  }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0;
  z-index: 2;
  background: #f7f9fb;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
</style>