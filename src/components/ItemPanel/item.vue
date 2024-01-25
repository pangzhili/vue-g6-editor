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
          name: "国内酒店抵扣有效订单比（创单）",
          enName: "hotel_mile_sorders_rate",
          groupType: 3,
          period: '1h',
          card: {value: "109.00", dodRate: "-209.68%", wowRate: "430.42%", hohRate: "230.03%", time: "14:30 - 14:35"},
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
          name: "国内酒店抵扣有效订单比（离店）",
          enName: "hotel_mile_sorders",
          groupType: 3,
          period: '1d',
          card: {value: "109.00", dodRate: "-209.68%", wowRate: "430.42%", hohRate: "230.03%", time: "14:30 - 14:35"},
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {},
          tableData: [{
            timePeriod: "00:05",
            value: "5.53%",
            hohRate: "--",
            dodRate: "-1.0%",
            wowRate: "-0.75%"
          }, {
            timePeriod: "00:10",
            value: "6.77%",
            hohRate: "--",
            dodRate: "2.13%",
            wowRate: "1.21%"
          }, {
            timePeriod: "00:15",
            value: "5.47%",
            hohRate: "--",
            dodRate: "-1.74%",
            wowRate: "-0.52%"
          }, {
            timePeriod: "00:20",
            value: "5.58%",
            hohRate: "--",
            dodRate: "-1.16%",
            wowRate: "-1.08%"
          }, {
            timePeriod: "00:25",
            value: "4.91%",
            hohRate: "--",
            dodRate: "-1.88%",
            wowRate: "-1.16%"
          }, {
            timePeriod: "00:30",
            value: "5.51%",
            hohRate: "--",
            dodRate: "0.02%",
            wowRate: "0.15%"
          }, {
            timePeriod: "00:35",
            value: "5.87%",
            hohRate: "--",
            dodRate: "-0.28%",
            wowRate: "-1.48%"
          }, {
            timePeriod: "00:40",
            value: "5.55%",
            hohRate: "--",
            dodRate: "0.05%",
            wowRate: "-1.61%"
          }, {
            timePeriod: "00:45",
            value: "6.22%",
            hohRate: "--",
            dodRate: "0.31%",
            wowRate: "-0.86%"
          },]
        },
        {
          label: "文本卡",
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
          name: "国内酒店抵扣有效订-趋势图",
          enName: "hotel_mile_sorders_rate",
          groupType: 3,
          period: '1h',
          card: {value: "109.00", dodRate: "-209.68%", wowRate: "430.42%", hohRate: "230.03%", time: "14:30 - 14:35"},
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {
            legendData: ["昨日", "上时段", "今日"],
            aliasData: ["01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
            todayData: ["617.00", "343.00", "180.00", "126.00", "71.00", "84.00", "182.00", "343.00", "657.00", "920.00", "1089.00", "1257.00", "1141.00"],
            periodData: ["0.00", "617.00", "343.00", "180.00", "126.00", "71.00", "84.00", "182.00", "343.00", "657.00", "920.00", "1089.00", "1257.00"],
            yesterdayData: ["523.00", "314.00", "164.00", "93.00", "74.00", "92.00", "197.00", "371.00", "674.00", "992.00", "1140.00", "1355.00", "1181.00"],
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

          card: {value: "109.00", dodRate: "-209.68%", wowRate: "430.42%", hohRate: "230.03%", time: "14:30 - 14:35"},
          viewComparison: ["dod", "wow"],
          table: {},
          trend: {
            legendData: ["昨日环比", "上周同期环比", "数值"],
            aliasData: ["2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21", "2024-01-22", "2024-01-23", "2024-01-24", "2024-01-25", "2024-01-26", "2024-01-27", "2024-01-28", "2024-01-29", "2024-01-30"],
            todayData: ["6353.00", "7319.00", "6875.00", "7423.00", "6713.00", "6755.00", "7550.00", "7189.00", "6622.00", "4922.00", "4987.00", "4257.00", "3535.00"],
            periodData: null,
            yesterdayData: ["6.79", "15.21", "-6.07", "7.97", "-9.56", "0.63", "11.77", "-4.78", "-7.89", "-25.67", "1.32", "-14.64", "-16.96"],
            weekData: ["112.40", "86.14", "53.22", "38.05", "26.92", "22.04", "26.91", "13.16", "-9.52", "-28.41", "-32.82", "-36.59", "-47.67"]
          },
          createBy: "高升",
          createTime: "2024-01-10 16:42:17",
          deriveId: null,
          description: "国内酒店里程抵扣有效单占比",
          enName: "hotel_mile_sorders_rate",
          groupType: 3,
          hasEdit: true,
          hasUse: true,
          hasView: true,
          id: 58,
          level: "L1",
          name: "国内酒店里程抵扣有效单占比",
          owner: "高升(41137)",
          ownerId: "41137",
          ownerName: "高升",
          params: {},
          period: "1h",
          quotaIdList: null,
          remark: null,
          searchValue: null,
          status: 0,
          timeDimensionId: null,
          timeDimensionName: '创建时间',
          quotaType: 3,
          updateBy: "高升",
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