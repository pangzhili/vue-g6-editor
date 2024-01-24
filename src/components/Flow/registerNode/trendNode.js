import G6 from '@antv/g6';
import Chart from '@antv/chart-node-g6';
import {uniqueId} from "@/utils";

const trendNode = () => {

    G6.registerNode("trendNode", {
        // 输入端点控制
        drawInPoints(cfg, group) {
            let size = cfg.size;
            const width = parseInt(size[0]);
            const height = parseInt(size[1]);
            const offsetX = 0;
            const offsetY = 0;
            if (cfg.inPoints) {
                for (let i = 0; i < cfg.inPoints.length; i++) {
                    let x, y = 0;
                    if (cfg.inPoints[i][0] === 0) {
                        y = 0;
                    } else {
                        y = height;
                    }
                    x = width * cfg.inPoints[i][1];
                    const id = "circle" + uniqueId();
                    group.addShape("circle", {
                        attrs: {
                            id: "circle" + uniqueId(),
                            parent: id,
                            x: x + offsetX,
                            y: y + offsetY,
                            r: 10,
                            isInPointOut: true,
                            fill: "#1890ff",
                            opacity: 0,
                        },
                    });
                    group.addShape("circle", {
                        attrs: {
                            id: id,
                            x: x + offsetX,
                            y: y + offsetY,
                            r: 3,
                            isInPoint: true,
                            fill: "#fff",
                            stroke: "#1890ff",
                            opacity: 0,
                        },
                    });
                }
            }
        },

        // 输出端点控制
        drawOutPoints(cfg, group) {
            let size = cfg.size;
            const width = parseInt(size[0]);
            const height = parseInt(size[1]);
            const offsetX = 0;
            const offsetY = 0;
            if (cfg.outPoints) {
                for (let i = 0; i < cfg.outPoints.length; i++) {
                    let x, y = 0;
                    if (cfg.outPoints[i][0] === 0) {
                        y = 0;
                    } else {
                        y = height;
                    }
                    x = width * cfg.outPoints[i][1];
                    const id = "circle" + uniqueId();
                    group.addShape("circle", {
                        attrs: {
                            id: "circle" + uniqueId(),
                            parent: id,
                            x: x + offsetX,
                            y: y + offsetY,
                            r: 10,
                            isOutPointOut: true,
                            fill: "#1890ff",
                            opacity: 0,
                        },
                    });
                    group.addShape("circle", {
                        attrs: {
                            id: id,
                            x: x + offsetX,
                            y: y + offsetY,
                            r: 3,
                            isOutPoint: true,
                            fill: "#fff",
                            stroke: "#1890ff",
                            opacity: 0,
                        },
                    });
                }
            }
        },

        draw(cfg, group) {
            const {size, color, id, trend} = cfg;
            const [width, height] = size.map(Number);

            // 趋势图最外层矩形
            const keyShape = group.addShape('rect', {
                attrs: {
                    id,
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    stroke: "#ced4d9",
                    fill: "#fff",
                    radius: 4,
                },
                draggable: true
            });
            // 趋势图标题矩形
            group.addShape("rect", {
                attrs: {
                    height: 35,
                    width,
                    parent: id,
                    stroke: "#ced4d9",
                    radius: [4, 4, 0, 0]
                },
                draggable: true
            });
            // 趋势图标题文字
            group.addShape("text", {
                attrs: {
                    y: 26,
                    x: 12,
                    text: cfg.name,
                    fill: "#565758",
                    fontWeight: "bold",
                    fontSize: 14,
                    parent: id
                }
            });
            // 趋势图最外层矩形添加颜色块
            group.addShape("rect", {
                attrs: {
                    x: 0,
                    y: 0,
                    width: 2,
                    height: height,
                    fill: color,
                    parent: id,
                    radius: [4, 0, 0, 4],
                },
            });

            this.drawInPoints(cfg, group);
            this.drawOutPoints(cfg, group);

            const legendMapping = {
                today: "今日",
                period: "上时段",
                yesterday: "昨日",
                week: "上周"
            };


            // 处理数据，转换为 G2 能理解的格式
            const data = trend.aliasData.flatMap((time, index) => {
                const record = [];

                if (trend.todayData != null && trend.todayData[index] !== null) {
                    const legendText = legendMapping.today;
                    const legendType = trend.legendData.find(type => type === legendText);
                    record.push({time, type: legendType, value: parseFloat(trend.todayData[index])});
                }

                if (trend.periodData != null && trend.periodData[index] !== null) {
                    const legendText = legendMapping.period;
                    const legendType = trend.legendData.find(type => type === legendText);
                    record.push({time, type: legendType, value: parseFloat(trend.periodData[index])});
                }

                if (trend.yesterdayData != null && trend.yesterdayData[index] !== null) {
                    const legendText = legendMapping.yesterday;
                    const legendType = trend.legendData.find(type => type === legendText);
                    record.push({time, type: legendType, value: parseFloat(trend.yesterdayData[index])});
                }

                if (trend.weekData != null && trend.weekData[index] !== null) {
                    const legendText = legendMapping.weekData;
                    const legendType = trend.weekData.find(type => type === legendText);
                    record.push({time, type: legendType, value: parseFloat(trend.weekData[index])});
                }
                return record;
            });

            // 创建 G2 图表实例
            const chart = new Chart({
                group,
                padding: [30, 5, 10, 20],
                width: width - 50,
                height: height - 70,
                x: 35,
                y: 45,
                autoFit: true,
            });

            // 加载数据
            chart.data(data);

            // 配置图表比例尺
            chart.scale({
                time: {
                    range: [0, 1],
                    tickCount: 10
                },
                value: {
                    nice: true,
                    tickCount: 10
                }
            });

            // 配置图例
            chart.legend({
                position: 'top',
                marker: {
                    symbol: 'hyphen'
                },
                offsetY: -3
            });

            // 配置坐标轴
            chart.axis('value', {
                label: {
                    formatter: (val) => `${val} %`
                }
            });
            chart.axis('time', {
                label: {
                    autoRotate: false, // 避免标签旋转
                }
            });

            // 绘制三条趋势线
            chart.line().position('time*value').color('type', ['#fdae6b', '#e6550d', '#31a354']).shape('smooth');
            chart.point().position('time*value').color('type', ['#fdae6b', '#e6550d', '#31a354']).shape('circle');

            // 渲染图表
            chart.render();


            return keyShape;
        },

        update: null,

        // 设置状态
        setState(name, value, item) {
            const group = item.getContainer();
            const shape = group.get("children")[0];

            const children = group.findAll((g) => {
                return g.attrs.parent === shape.attrs.id;
            });
            const circles = group.findAll((circle) => {
                return circle.attrs.isInPoint || circle.attrs.isOutPoint;
            });
            const selectStyles = () => {
                shape.attr("fill", "#f3f9ff");
                shape.attr("stroke", "#6ab7ff");
                shape.attr("cursor", "move");
                children.forEach((child) => {
                    child.attr("cursor", "move");
                });
                circles.forEach((circle) => {
                    circle.attr("opacity", 1);
                });
            };
            const unSelectStyles = () => {
                shape.attr("fill", "#fff");
                shape.attr("stroke", "#ced4d9");
                circles.forEach((circle) => {
                    circle.attr("opacity", 0);
                });
            };
            switch (name) {
                case "selected":
                case "hover":
                    if (value) {
                        selectStyles();
                    } else {
                        unSelectStyles();
                    }
                    break;
            }
        },
    });
};

export default trendNode;