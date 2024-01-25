<template>
  <div class="toolbar">
    <span class="view-name">酒店核心产能数据情况</span>
    <link
        rel="stylesheet"
        type="text/css"
        href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"
    />
    <i
        class="command iconfont icon-undo"
        title="撤销"
        :class="undoList.length>0?'':'disable'"
        @click="handleUndo"
    ></i>
    <i
        class="command iconfont icon-redo"
        title="重做"
        :class="redoList.length>0?'':'disable'"
        @click="handleRedo"
    ></i>
    <span class="separator"></span>
    <span class="separator"></span>
    <i
        data-command="delete"
        class="command iconfont icon-delete-o"
        title="删除"
        :class="selectedItem?'':'disable'"
        @click="handleDelete"
    ></i>
    <span class="separator"></span>
    <span class="separator"></span>
    <i
        data-command="zoomIn"
        class="command iconfont icon-zoom-in-o"
        title="放大"
        @click="handleZoomIn"
    ></i>
    <i
        data-command="zoomOut"
        class="command iconfont icon-zoom-out-o"
        title="缩小"
        @click="handleZoomOut"
    ></i>
    <i
        data-command="autoZoom"
        class="command iconfont icon-fit"
        title="适应画布"
        @click="handleAutoZoom"
    ></i>
    <i
        data-command="resetZoom"
        class="command iconfont icon-actual-size-o"
        title="实际尺寸"
        @click="handleResetZoom"
    ></i>
    <span class="separator"></span>
    <span class="separator"></span>
    <i
        data-command="toBack"
        class="command iconfont icon-to-back"
        :class="selectedItem?'':'disable'"
        title="层级后置"
        @click="handleToBack"
    ></i>
    <i
        data-command="toFront"
        class="command iconfont icon-to-front"
        :class="selectedItem?'':'disable'"
        title="层级前置"
        @click="handleToFront"
    ></i>
    <i
        data-command="multiSelect"
        class="command iconfont icon-select"
        :class="multiSelect?'disable':''"
        title="多选"
        @click="handleMuiltSelect"
    ></i>
    <span class="separator"></span>
    <span class="separator"></span>
    <i
        data-command="clear"
        class="command el-icon-brush"
        title="清空画布"
        @click="handleClear"
        style="font-size: 15px"
    ></i>
    <i
        data-command="fullScreen"
        class="command el-icon-rank"
        :title="this.showFullScreen === 1 ? '右侧全屏' : this.showFullScreen === 2 ? '全屏' : '取消全屏'"
        @click="handleFullScreen"
        :style="{ color: getFullScreenColor(showFullScreen),'font-size':15+'px' }"
    ></i>
    <el-button @click="saveData" type="primary" style="float: right;margin-right: 24px">保存</el-button>
    <el-button @click="closeView" type="info" style="float: right;margin-right:18px">关闭</el-button>
  </div>
</template>

<script>
import * as Util from '@antv/util'
import {getBox, uniqueId} from "../../utils";
import eventBus from "../../utils/eventBus";

export default {
  data() {
    return {
      page: {},
      graph: {},
      redoList: [],
      undoList: [],
      editor: null,
      command: null,
      selectedItem: null,
      multiSelect: false,
      addGroup: false,
      showFullScreen: 1
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  watch: {
    selectedItem(val) {
      this.addGroup = val && val.length > 1;
    }
  },
  methods: {
    handleFullScreen() {
      this.showFullScreen = this.showFullScreen + 1;
      if (this.showFullScreen === 4) {
        this.showFullScreen = 1;
      }
      eventBus.$emit('fullScreen', this.showFullScreen);
    },
    getFullScreenColor(value) {
      switch (value) {
        case 2:
          return '#409EFF';
        case 3:
          return '#32CD32';
        default:
          return 'black';
      }
    },
    init() {
      this.showFullScreen = 1
      const {editor, command} = this.$parent;
      this.editor = editor;
      this.command = command;
    },
    bindEvent() {
      let self = this;
      eventBus.$on("afterAddPage", page => {
        self.page = page;
        self.graph = self.page.graph;
      });
      eventBus.$on("add", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("update", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("delete", data => {
        this.redoList = data.redoList;
        this.undoList = data.undoList;
      });
      eventBus.$on("updateItem", item => {
        this.command.executeCommand("update", [item]);
      });
      eventBus.$on("addItem", item => {
        this.command.executeCommand("add", [item]);
      });
      eventBus.$on("nodeselectchange", () => {
        this.selectedItem = this.graph.findAllByState("node", "selected");
        this.selectedItem = this.selectedItem.concat(
            ...this.graph.findAllByState("edge", "selected")
        );
      });
      eventBus.$on("deleteItem", () => {
        this.handleDelete();
      });
      eventBus.$on("muliteSelectEnd", () => {
        this.multiSelect = false;
        this.selectedItem = this.graph.findAllByState("node", "selected");
      });
    },
    handleUndo() {
      if (this.undoList.length > 0) this.command.undo();
    },
    handleRedo() {
      if (this.redoList.length > 0) this.command.redo();
    },
    handleDelete() {
      if (this.selectedItem.length > 0) {
        this.command.executeCommand("delete", this.selectedItem);
        this.selectedItem = null;
      }
    },
    getFormatPadding() {
      function formatPadding(padding) {
        let top = 0;
        let left = 0;
        let right = 0;
        let bottom = 0;
        if (Util.isNumber(padding) || Util.isString(padding)) {
          top = left = right = bottom = padding;
        } else if (Util.isArray(padding)) {
          top = padding[0];
          right = !Util.isNil(padding[1]) ? padding[1] : padding[0];
          bottom = !Util.isNil(padding[2]) ? padding[2] : padding[0];
          left = !Util.isNil(padding[3]) ? padding[3] : right;
        }
        return [top, right, bottom, left];
      }

      return formatPadding(this.graph.get("fitViewPadding"));
    },
    getViewCenter() {
      const padding = this.getFormatPadding();
      const graph = this.graph;
      const width = this.graph.get("width");
      const height = graph.get("height");
      return {
        x: (width - padding[2] - padding[3]) / 2 + padding[3],
        y: (height - padding[0] - padding[2]) / 2 + padding[0]
      };
    },
    handleZoomIn() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
    },
    handleZoomOut() {
      const currentZoom = this.graph.getZoom();
      this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
    },
    handleToBack() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          item.toBack();
          this.graph.paint();
        });
      }
    },
    handleToFront() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          if (item.getType() === "edge") {
            // const nodeGroup = this.graph.get("nodeGroup");
            // const edgeGroup = item.get("group");
            // nodeGroup.toFront();
            // edgeGroup.toFront()
          } else {
            item.toFront();
          }

          this.graph.paint();
        });
      }
    },
    handleAutoZoom() {
      this.graph.fitView(20);
    },
    handleResetZoom() {
      this.graph.zoomTo(1, this.getViewCenter());
    },
    handleMuiltSelect() {
      this.multiSelect = true;
      this.graph.setMode("mulitSelect");
    },
    handleAddGroup() {
      //TODO 分组功能待开发
      // const nodes = this.selectedItem.map(item => {
      //   return item._cfg.id;
      // });
      // const model = {
      //   groupId: "group" + uniqueId(),
      //   title: "新建分组",
      //   nodes
      // };

      // this.command.executeCommand("add", "group", model);
      // this.getPosition(this.selectedItem);
    },
    getPosition(items) {
      const boxList = [];
      items.forEach(item => {
        const box = item.getBBox();
        boxList.push(getBox(box.x, box.y, box.width, box.height));
      });
      let minX1, minY1, MaxX2, MaxY2;
      boxList.forEach(box => {
        if (typeof minX1 == "undefined") {
          minX1 = box.x1;
        }
        if (typeof minY1 == "undefined") {
          minY1 = box.y1;
        }
        if (typeof MaxX2 == "undefined") {
          MaxX2 = box.x2;
        }
        if (typeof MaxY2 == "undefined") {
          MaxY2 = box.y2;
        }
        if (minX1 > box.x1) {
          minX1 = box.x1;
        }
        if (minY1 > box.y1) {
          minY1 = box.y1;
        }
        if (MaxX2 < box.x2) {
          MaxX2 = box.x2;
        }
        if (MaxY2 < box.y2) {
          MaxY2 = box.y2;
        }
      });
      const width = MaxX2 - minX1,
          height = MaxY2 - minY1,
          x = minX1 + width / 2,
          y = minY1 + height / 2,
          id = "team" + uniqueId();
      const model = {
        id: id,
        width,
        height,
        x,
        y,
        shape: "teamNode"
      };
      this.command.executeCommand("add", model);
      // const item = this.graph.findById(id);
      // item.get("group").toBack();
      // const edgeGroup = this.graph.get("edgeGroup");
      // edgeGroup.toFront();
      // this.graph.paint();
    },
    // 清空画布
    handleClear() {
      this.graph.clear();
      // 清除 undoList 和 redoList
      this.undoList = [];
      this.redoList = [];
      // 重新绘制画布
      this.graph.paint();
    },
    // 保存数据
    saveData() {
      // eslint-disable-next-line no-console
      console.log(this.graph.save());

    },
    // 关闭视图
    closeView() {

    }
  }
};
</script>

<style scoped>
.toolbar {
  box-sizing: border-box;
  padding: 8px 0px;
  width: 100%;
  border: 1px solid #e9e9e9;
  height: 42px;
  z-index: 3;
  box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
  position: absolute;
}

.toolbar .view-name {
  display: inline-block;
  width: 250px;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 400;
  -webkit-user-select: text; /* Chrome, Safari, Opera */
  -moz-user-select: text; /* Firefox */
  -ms-user-select: text; /* Internet Explorer/Edge */
  user-select: text; /* 非前缀版本, 可能在未来的某些浏览器中支持 */
}

.toolbar .command:nth-of-type(1) {
  margin-left: 14%;
}

.toolbar .command {
  box-sizing: border-box;
  width: 27px;
  height: 27px;
  margin: 0px 6px;
  border-radius: 2px;
  padding-left: 4px;
  display: inline-block;
  border: 1px solid rgba(2, 2, 2, 0);
}

.toolbar .command:not(.disable):hover {
  cursor: pointer;
  font-weight: 500;
  color: #1890ff; /* 鼠标移入时的颜色 */
}

.toolbar .disable {
  color: rgba(0, 0, 0, 0.25);
}

.toolbar .separator {
  margin: 4px;
  border-left: 1px solid #e9e9e9;
}
</style>