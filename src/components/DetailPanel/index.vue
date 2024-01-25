<template>
  <div class="detailpannel" :style="{width:width + 'px'}">
    <!-- 拖动把手 -->
    <div class="resize-handle" @mousedown="initResize"></div>
    <div>
      <div v-if="status==='node-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">详情</div>
        <div class="block-container">
          <el-row :gutter="10">
            <el-col :span="8">名称</el-col>
            <el-col :span="16">
              <el-input v-model="node.label" @change="handleChangeName"/>
            </el-col>
            <el-col :span="8">任意属性</el-col>
            <el-col :span="16">
              <el-input v-model="node.xxx"/>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
        <div class="pannel-title">画布</div>
        <div class="block-container">
          <el-checkbox v-model="showGrid" @change="changeGridState">网格对齐</el-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6';
import eventBus from "../../utils/eventBus";

const {Grid} = G6;

export default {
  data() {
    return {
      status: "canvas-selected",
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {},
      grid: null,
      width: 200
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  methods: {
    initResize(event) {
      window.addEventListener('mousemove', this.startResize);
      window.addEventListener('mouseup', this.stopResize);
      event.preventDefault();
    },
    startResize(event) {
      const newWidth = document.documentElement.clientWidth - event.clientX;
      if (newWidth > 200) { // 200px 是最小宽度
        this.width = newWidth;
      } else {
        this.width = 200; // 如果计算的新宽度小于200px，则保持200px不变
      }
    },
    stopResize(event) {
      window.removeEventListener('mousemove', this.startResize);
      window.removeEventListener('mouseup', this.stopResize);
    },
    init() {
    },
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
        eventBus.$on("nodeselectchange", item => {
          if (item.select === true && item.target.getType() === "node") {
            self.status = "node-selected";
            self.item = item.target;
            self.node = item.target.getModel();
          } else {
            self.status = "canvas-selected";
            self.item = null;
            self.node = null;
          }
        });
      });
    },
    handleChangeName(e) {
      const model = {
        label: e
      };

      this.graph.update(this.item, model);
    },
    changeGridState(value) {
      if (value) {
        this.grid = new Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    }
  }
};
</script>

<style scoped>
.detailpannel {
  height: 100%;
  position: absolute;
  right: 0px;
  z-index: 2;
  background: #f7f9fb;
  border-left: 1px solid #e6e9ed;

}

.resize-handle {
  width: 2px;
  height: 100%;
  cursor: ew-resize;
  position: absolute;
  left: 0;
  top: 0;
}

.detailpannel .block-container {
  padding: 16px 8px;
}

.block-container .el-col {
  height: 28px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
