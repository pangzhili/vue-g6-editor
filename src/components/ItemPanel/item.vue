<template>
  <!-- 左侧列表栏数据列表 -->
  <div>
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
          :style="{width: width - 12 + 'px'}"
          @click="selectItemInfo(item)"
      >
        <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
        <span class="item-name" :style="{ maxWidth : width + 'px' }">{{ item.name }}</span>
      </li>
    </ul>
    <div class="resizer" @mousedown="initResize"></div>
  </div>
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
      width: 250,
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
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
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
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
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
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
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
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
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
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
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
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
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
          name: "指标体系测试指标1",
          enName: "指标体系测试指标1",
          groupType: 3,
          period: '1h',
          card: {value: "23.00", dodRate: "-29.68%", wowRate: "0.42%", hohRate: "20.03%", time: "14:30 - 14:35"},
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {},
        },
        {
          label: "表格",
          size: "485*280",
          type: "node",
          x: 0,
          y: 0,
          shape: "tableNode",
          color: "#1890ff",
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingStart: true,
          id: 53,
          name: "指标体系测试指标2",
          enName: "指标体系测试指标1",
          groupType: 3,
          period: '1d',
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {},
          tableData: [{
            timePeriod: "00:05",
            value: "2.53%",
            hohRate: "--",
            dodRate: "-11.0%",
            wowRate: "-10.75%"
          }, {
            timePeriod: "00:10",
            value: "6.17%",
            hohRate: "--",
            dodRate: "3.13%",
            wowRate: "2.21%"
          }, {
            timePeriod: "00:15",
            value: "4.47%",
            hohRate: "--",
            dodRate: "-5.74%",
            wowRate: "-0.56%"
          }, {
            timePeriod: "00:20",
            value: "10.58%",
            hohRate: "--",
            dodRate: "-11.16%",
            wowRate: "-1.58%"
          }, {
            timePeriod: "00:25",
            value: "41.91%",
            hohRate: "--",
            dodRate: "-11.88%",
            wowRate: "-13.16%"
          }, {
            timePeriod: "00:30",
            value: "51.51%",
            hohRate: "--",
            dodRate: "10.02%",
            wowRate: "20.15%"
          }, {
            timePeriod: "00:35",
            value: "15.87%",
            hohRate: "--",
            dodRate: "-10.28%",
            wowRate: "-11.48%"
          }, {
            timePeriod: "00:40",
            value: "15.55%",
            hohRate: "--",
            dodRate: "10.05%",
            wowRate: "-1161%"
          }, {
            timePeriod: "00:45",
            value: "26.22%",
            hohRate: "--",
            dodRate: "20.31%",
            wowRate: "-20.86%"
          },]
        },
        {
          label: "趋势图",
          size: "690*380",
          type: "node",
          x: 0,
          y: 0,
          shape: "trendNode",
          color: "#1890ff",
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingStart: true,
          id: 58,
          name: "指标体系测试指标3",
          enName: "指标体系测试指标3",
          groupType: 3,
          period: '1h',
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {
            legendData: ["昨日", "上时段", "今日"],
            aliasData: ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
            todayData: ["7.00", "33.00", "180.00", "16.00", "71.00", "84.00", "182.00", "343.00", "657.00", "920.00", "1089.00", "1257.00", "141.00"],
            periodData: ["12.00", "617.00", "343.00", "180.00", "16.00", "71.00", "84.00", "12.00", "343.00", "657.00", "920.00", "1089.00", "157.00"],
            yesterdayData: ["23.00", "314.00", "164.00", "93.00", "74.00", "92.00", "197.00", "371.00", "674.00", "992.00", "110.00", "135.00", "181.00"],
            weekData: null
          }
        },
        {
          label: "混合图",
          size: "690*380",
          type: "node",
          x: 0,
          y: 0,
          shape: "trendBarNode",
          color: "#1890ff",
          image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingStart: true,
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {
            legendData: ["昨日环比", "上周同期环比", "数值"],
            aliasData: ["2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21", "2024-01-22", "2024-01-23", "2024-01-24", "2024-01-25", "2024-01-26", "2024-01-27", "2024-01-28", "2024-01-29", "2024-01-30"],
            todayData: ["353.00", "739.00", "687.00", "723.00", "673.00", "675.00", "750.00", "719.00", "622.00", "492.00", "487.00", "4257.00", "3535.00"],
            periodData: null,
            yesterdayData: ["16.79", "15.21", "-6.07", "7.97", "-9.56", "0.63", "11.77", "-4.78", "-7.89", "-5.67", "1.32", "-14.64", "-16.96"],
            weekData: ["12.40", "86.14", "3.22", "8.05", "6.92", "2.04", "6.91", "3.16", "-19.52", "-8.41", "-2.82", "-36.59", "-47.67"]
          },
          createBy: "createBy",
          createTime: "2024-01-10 16:42:17",
          deriveId: null,
          description: "指标体系测试指标4",
          enName: "指标体系测试指标4",
          groupType: 3,
          hasEdit: true,
          hasUse: true,
          hasView: true,
          id: 58,
          level: "L1",
          name: "指标体系测试指标4",
          owner: "owner",
          ownerId: "ownerId",
          ownerName: "owner",
          params: {},
          period: "1h",
          quotaIdList: null,
          remark: null,
          searchValue: null,
          status: 0,
          timeDimensionId: null,
          timeDimensionName: '创建时间',
          quotaType: 3,
          updateBy: "owner",
          updateTime: "2024-01-10 16:42:17",
          usageTime: "2024-01-10 16:42:20",
        },
      ]
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    selectItemInfo(item) {
      eventBus.$emit('selectNode', item);
    },
    initResize(event) {
      window.addEventListener('mousemove', this.startResize);
      window.addEventListener('mouseup', this.stopResize);
      event.preventDefault();
    },
    startResize(event) {
      let newWidth = event.clientX;
      if (newWidth < 250) {
        newWidth = 250;
      }
      this.width = newWidth
      eventBus.$emit('itemPanelResize', this.width);
    },
    stopResize(event) {
      window.removeEventListener('mousemove', this.startResize);
      window.removeEventListener('mouseup', this.stopResize);
    },
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
.itempannel ul {
  padding: 0px;
  padding-left: 4px !important;
}

.itempannel li {
  display: flex;
  align-items: center; /* 使用 flex 布局实现垂直居中对齐 */
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
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
  vertical-align: middle; /* 垂直居中对齐 */
}

/* 添加新的调整大小手柄样式 */
.resizer {
  width: 3px;
  height: 100%;
  cursor: ew-resize;
  position: absolute;
  right: -5px; /* 使其部分重叠，增加可点击面积 */
  top: 0;
}
</style>