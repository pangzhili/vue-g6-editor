<template>
  <div class="detailpannel" :style="{width:width + 'px'}">
    <!-- 拖动把手 -->
    <div class="resize-handle" @mousedown="initResize"></div>
    <div>
      <div v-if="status==='node-selected'" class="pannel" id="node_detailpannel">

        <div class="pannel-title">详情</div>
        <div class="block-container">
          <el-col :span="20">中文名称：{{ node.name }}</el-col>
          <el-col :span="20">英文名称：{{ node.enName }}</el-col>
          <el-col :span="20">时间维度：{{ node.timeDimensionName }}</el-col>
          <el-col :span="20">统计时段：{{ node.period.replace("h", "小时").replace("d", "天").replace("m", "分钟") }}</el-col>
          <el-col :span="20">指标类型：{{
              node.quotaType === 1 ? "原子指标" : node.quotaType === 2 ? "派生指标" : "复合指标"
            }}
          </el-col>
          <el-col :span="20">指标级别：{{ node.level }}</el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;负责人：{{ node.owner }}</el-col>
          <el-col :span="20">&nbsp;&nbsp;&nbsp;创建人：{{ node.createBy }}</el-col>
          <el-col :span="20">创建时间：{{ node.createTime }}</el-col>
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
      eventBus.$emit('panelResize', this.width);
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
        eventBus.$on("selectNode", item => {
          self.status = "node-selected";
          self.node = item;
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
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 确保容器也有溢出隐藏 */
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

.block-container .el-col {
  height: 33px;
  min-width: 0; /* 允许元素缩小到内容的最小尺寸 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1; /* 允许元素根据需要收缩 */
  color: gray;
  font-size: 12px;
  user-select: text;
}

</style>
