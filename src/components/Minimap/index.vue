<template>
  <div id="navigator" :style="{width:width + 'px'}">
    <div class="pannel-title">导航器</div>
    <div id="minimap" class="minimap" ref="minimap"></div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import eventBus from "../../utils/eventBus";

const {Minimap} = G6;

export default {
  data() {
    return {
      minimap: null,
      graph: null,
      width: 200
    };
  },
  created() {
    this.bindEvent();
  },
  mounted() {
    this.$nextTick(() => {
      this.initMinmap();
    });
    eventBus.$on('panelResize', this.handlePanelResize);
  },
  methods: {
    handlePanelResize(newWidth) {
      // 更新 navigator 宽度
      this.width = `${newWidth}`;
    },
    initMinmap() {
      const cfgs = {
        container: "minimap"
      };
      this.minimap = new Minimap({...cfgs});
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.graph = page.graph;
        this.bindPage();
      });
    },
    bindPage() {
      if (!this.minimap || !this.graph) {
        return;
      }
      this.graph.addPlugin(this.minimap)
    }
  }
};
</script>

<style scoped>
#navigator {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 3;
}

.pannel-title {
  height: 32px;
  border-top: 1px solid #dce3e8;
  border-bottom: 1px solid #dce3e8;
  background: #ebeef2;
  color: #000;
  line-height: 28px;
  padding-left: 12px;
}
</style>