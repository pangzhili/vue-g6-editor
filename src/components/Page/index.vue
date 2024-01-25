<template>
  <div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import {initBehavors} from "@/behavior";

export default {
  data() {
    return {
      pageId: "graph-container",
      graph: null
    };
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  created() {
    initBehavors();
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      const height = this.height - 42
      const width = this.width - 10

      this.graph = new G6.Graph({
        container: "graph-container",
        height: height,
        width: width,
        groupType: 'rect',
        groupStyle: {
          default: {},
          hover: {},
          collapse: {},
        },
        modes: {
          // 支持的 behavior
          default: [
            "drag-canvas",
            // "zoom-canvas",
            "hover-node",
            "select-node",
            "hover-edge",
            "keyboard",
            "customer-events",
            "add-menu",
            "drag-node",
            // 表格下滑滚动
            "table-scroll"
          ],
          mulitSelect: ["mulit-select"],
          addEdge: ["add-edge"],
        }
      });
      const {editor, command} = this.$parent;
      editor.emit("afterAddPage", {graph: this.graph, command});
      this.readData();
    },
    readData() {
      let data = this.data;
      if (data) {
        this.graph.read(data);
      }
    }
  }
};
</script>

<style scoped>
.page {
  margin-left: 0;
  margin-right: 0;
}
</style>