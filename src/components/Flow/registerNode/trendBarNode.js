import G6 from '@antv/g6';
import Chart from '@antv/chart-node-g6';
import {uniqueId} from "@/utils";

const trendBarNode = () => {

    G6.registerNode("trendBarNode", {

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

            // 创建 G2 图表实例
            const chart = new Chart({
                group,
                padding: [50, 10, 10, 15],
                width: width - 70,
                height: height - 70,
                x: 35,
                y: 45,
                autoFit: true,
            });

            // 处理数据
            const data = trend.aliasData.map((date, index) => ({
                date,
                today: parseFloat(trend.todayData[index]),
                yesterday: parseFloat(trend.yesterdayData[index]),
                week: parseFloat(trend.weekData[index])
            }));

            chart.data(data);

            // 使用 G2 图表方法来配置数据映射
            chart.scale({
                date: {
                    range: [0.03, 0.97]
                },
                today: {
                    nice: true,
                },
                yesterday: {
                    nice: true,
                },
                week: {
                    nice: true,
                },
            });

            // 配置左侧 y 轴（为柱状图）
            chart.axis('today', {
                position: 'left',
            });

            chart.axis('week', {
                position: 'right',
            });
            chart.axis('yesterday', false)

            // 在图表顶部添加文本标注
            chart.annotation().text({
                position: ['25%', '-9%'],  // 位置设置为顶部中央，'5%' 用于稍微向下偏移
                content: '数值',      // 这里填写您想要显示的文本
                style: {
                    fontSize: 11,         // 字体大小
                    textAlign: 'center',  // 文本居中
                    fill: '#666',         // 文本颜色
                },
                offsetX: -(width / 4),    // 根据图表宽度进行水平偏移，以适当分散两侧文本
            });

            chart.annotation().text({
                position: ['74%', '-9%'],  // 同样设置为顶部中央
                content: '环比',           // 这里填写您想要显示的文本
                style: {
                    fontSize: 11,         // 字体大小
                    textAlign: 'center',  // 文本居中
                    fill: '#666',         // 文本颜色
                },
                offsetX: width / 4,       // 同样根据图表宽度进行水平偏移
            });



            // 绘制图表元素
            chart.interval()
                .position('date*today')
                .color('#5B8FF9')
                .tooltip('date*today')
                .style({radius: [2, 2, 0, 0]})
                .label("今日")
            ; // 设置柱状图顶部圆角

            chart.line()
                .position('date*yesterday')
                .color('#fdae6b')
                .shape('smooth')
                .tooltip('date*yesterday')
                .label("今日")
            ;

            chart.line()
                .position('date*week')
                .color('#e8684a')
                .shape('smooth')
                .tooltip('date*week');

            // 添加点图层，增强折线图的交互性
            chart.point()
                .position('date*yesterday')
                .color('#fdae6b')
                .shape('circle') // 可以根据需要调整形状
                .style({
                    r: 0, // 点的大小
                    stroke: '#fdae6b', // 点的描边色
                    lineWidth: 2, // 描边宽度
                });

            chart.point()
                .position('date*week')
                .color('#e8684a')
                .shape('circle')
                .style({
                    r: 0,
                    stroke: '#e8684a',
                    lineWidth: 2,
                });

            // 配置图例
            chart.legend({
                position: 'top',
                marker: {
                    symbol: 'hyphen'
                },
                offsetY: 0
            });

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

export default trendBarNode;