<template>
  <!-- 鼠标右击菜单列表 -->
  <div>
    <ul class="el-scrollbar__view el-select-dropdown__list context-menu" ref="contextMenu">
      <li
          class="el-select-dropdown__item"
          v-for="menu in menus"
          :key="menu.key"
          @click="handleClick(menu)"
      >{{ menu.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import eventBus from "../../utils/eventBus";

export default {
  data() {
    return {
      menus: [{key: 'transform', name: "切换类型"}],
      /* ToolBar相关数据，用于保存当前选中的节点和一些画布信息 */
      page: {},
      graph: {},
      redoList: [],
      undoList: [],
      editor: null,
      command: null,
      selectedItem: null,
      multiSelect: false,
      addGroup: false
    };
  },
  created() {
    this.bindEvent();
  },
  watch: {
    selectedItem(val) {
      this.addGroup = val && val.length > 1;
    }
  },
  mounted() {
    document.addEventListener('contextmenu', this.contextMenuHandler, false);
  },
  unmounted() {
    document.removeEventListener('contextmenu', this.contextMenuHandler, false);
  },
  methods: {
    contextMenuHandler(e) {
      e.preventDefault(); // 阻止默认的菜单弹出

      const menu = this.$refs.contextMenu;
      const node = this.selectedItem && this.selectedItem[0];
      if (node) {
        // 如果有选中的节点，则显示菜单
        menu.style.left = e.clientX + "px";
        menu.style.top = e.clientY + "px";
        menu.style.display = "block";
      } else {
        // 如果没有选中的节点，则隐藏菜单
        menu.style.display = "none";
      }
    },
    init() {
      const {editor, command} = this.$parent;
      this.editor = editor;
      this.command = command;
    },
    bindEvent() {
      /* ToolBar组件中的监听事件 */
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

      /* ContextMenu组件中的监听事件 */
      eventBus.$on("contextmenuClick", e => {
        const menu = this.$refs.contextMenu;
        const node = this.selectedItem && this.selectedItem[0];
        if (node) {
          // 如果有选中的节点，则显示菜单
          menu.style.left = e.clientX + "px";
          menu.style.top = e.clientY + "px";
          menu.style.display = "block";
        } else {
          // 如果没有选中的节点，则隐藏菜单
          menu.style.display = "none";
        }
      });
      eventBus.$on("mousedown", () => {
        const menu = this.$refs.contextMenu;
        menu.style.display = "none";
      });
    },
    handleClick(item) {
      const menu = this.$refs.contextMenu;
      menu.style.display = "none";
      this.transform()
    },
    transform() {
      if (this.selectedItem && this.selectedItem.length > 0) {
        this.selectedItem.forEach(item => {
          const model = item.getModel(); // 获取节点的数据模型
          model.size = [290, 90]
          model.shape = "textCardNode"; // 将矩形节点切换为圆形节点
          this.graph.updateItem(item, model); // 更新节点的数据模型
        });
      }
    }
  }
};
</script>

<style>
.context-menu {
  position: absolute;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
  z-index: 1;
  display: none;
}

.context-menu li {
  cursor: pointer;
  font-size: 12px;
  height: 28px;
  line-height: 28px;
}

.context-menu li:hover {
  background-color: #f5f7fa;
}
</style>