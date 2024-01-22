<template>
  <!-- 左侧列表栏数据列表 -->
  <ul>
    <li
        v-for="(item,index) in list"
        :key="index"
        class="getItem"
        :data-shape="item.shape"
        :data-type="item.type"
        :data-size="item.size"
        draggable="true"
        @dragstart="handleDragstart"
        @dragend="handleDragEnd($event,item)"
    >
      <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
      <span class="item-name">{{ item.name }}</span>
    </li>
  </ul>
</template>

<script>
import eventBus from "../../utils/eventBus";
import okSvg from "../../assets/icons/ok.svg";
import bgImg from "../../assets/bg.jpg";

export default {
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      list: [
        {
          name: "测试节点",
          label: "测试节点",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
              "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        },

        {
          name: "背景图片节点",
          label: "背景图片节点",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
              "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          backImage: bgImg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        },
        {
          name: "双输出节点",
          label: "双输出节点",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
              "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.4], [1, 0.6]]
        },
        {
          name: "大型节点",
          label: "大型节点",
          size: "340*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
              "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        },
        {
          name: "动画开始节点",
          label: "动画开始",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
              "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          outPoints: [[1, 0.5]],
          isDoingStart: true
        },
        {
          name: "动画结束节点",
          label: "动画结束",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
              "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          isDoingEnd: true
        },
        {
          label: "文本卡",
          size: "290*90",
          type: "node",
          x: 0,
          y: 0,
          shape: "textCardNode",
          color: "#1890ff",
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingStart: true,
          id: 58,
          name: "国内酒店抵扣有效订单比（创单）",
          enName: "hotel_mile_sorders_rate",
          groupType: 3,
          period: '1h',
          card: {value: "109.00", dodRate: "-209.68%", wowRate: "430.42%", hohRate: "230.03%", time: "14:30 - 14:35"},
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {},
        },
      ]
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    handleDragstart(e) {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    handleDragEnd(e, item) {
      let data = {};
      Object.assign(data, item);
      data.offsetX = this.offsetX;
      data.offsetY = this.offsetY;
      if (this.page) {
        const graph = this.page.graph;
        const xy = graph.getPointByClient(e.x, e.y);
        data.x = xy.x;
        data.y = xy.y;
        if (item.size) {
          data.size = item.size.split("*");
        }
        data.type = "node";
        this.command.executeCommand("add", [data]);
      }
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
        this.command = page.command;
      });
    }
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
  width: 240px !important;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}

.itempannel ul {
  padding: 0px;
  padding-left: 4px !important;
}

.itempannel li {
  display: flex;
  align-items: center; /* 使用 flex 布局实现垂直居中对齐 */
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 227px;
  height: 30px; /* 增加 li 元素的高度 */
  padding-left: 4px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}

.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

.item-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 210px; /* 修改为更合适的值 */
  vertical-align: middle; /* 垂直居中对齐 */
}
</style>