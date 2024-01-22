import G6 from '@antv/g6';
import {uniqueId} from "@/utils";

const textCardNode = () => {
    G6.registerNode("textCardNode", {

        drawBackground(cfg, group) {
            const {size, color, id} = cfg;
            const [width, height] = size.map(Number);
            const offsetX = -width / 2;
            const offsetY = -height / 2;
            // 添加矩形
            const shape = group.addShape("rect", {
                attrs: {
                    id: id,
                    x: offsetX,
                    y: offsetY,
                    width: width,
                    height: height,
                    stroke: "#ced4d9",
                    fill: "#fff",
                    radius: 4,
                },
            });
            // 矩形添加颜色块
            group.addShape("rect", {
                attrs: {
                    x: offsetX,
                    y: offsetY,
                    width: 2,
                    height: height,
                    fill: color,
                    parent: id,
                    radius: [4, 0, 0, 4],
                },
            });

            return shape;
        },

        drawTitle(cfg, group) {
            const {size, id, name} = cfg;
            const [width, height] = size.map(Number);
            const offsetX = -width / 2;
            const offsetY = -height / 2;
            group.addShape("text", {
                attrs: {
                    id: "text-title" + uniqueId(),
                    x: offsetX + 10,
                    y: offsetY + 15,
                    textAlign: "left",
                    textBaseline: "top",
                    text: name,
                    parent: id,
                    fill: "#565758",
                    fontWeight: "bold",
                    fontSize: 14
                },
            });
        },

        drawValue(cfg, group) {
            const {size, id, card} = cfg;
            const [width, height] = size.map(Number);
            const offsetX = -width / 2;
            const offsetY = -height / 2;
            if (card) {
                group.addShape("text", {
                    attrs: {
                        id: "text-value" + uniqueId(),
                        x: offsetX + 10,
                        y: offsetY + 50,
                        textAlign: "left",
                        textBaseline: "top",
                        text: card.value,
                        parent: id,
                        fill: "#1890ff",
                        fontSize: 14,
                    },
                });
            }
        },

        drawComparison(type, cfg, group, index) {
            const {card, id, size} = cfg;
            const [width, height] = size.map(Number);
            const offsetX = -width / 2;
            const offsetY = -height / 2;
            const space = index === 1 ? 68 : 86;

            const rate = card[`${type}Rate`];
            const comparisonText = `${rate}`.includes("--")
                ? "--"
                : `${rate}`.includes("-")
                    ? `↓ ${rate}`.replace(/-/g, "")
                    : `↑ ${rate}`;

            group.addShape("text", {
                attrs: {
                    id: `${type}-${uniqueId()}`,
                    x: offsetX + width - 20,
                    y: offsetY + space,
                    textAlign: "right",
                    textBaseline: "bottom",
                    text: comparisonText,
                    parent: id,
                    fill: `${rate}`.includes("--")
                        ? "#d9d9d9"
                        : `${rate}`.includes("-")
                            ? "#f5222d"
                            : "#52c41a",
                    fontWeight: "bold",
                    fontSize: 11,
                },
            });

            group.addShape("text", {
                attrs: {
                    id: `${type}-title-${uniqueId()}`,
                    x: offsetX + width - 80,
                    y: offsetY + space,
                    textAlign: "right",
                    textBaseline: "bottom",
                    text: type === "hoh" ? "时段：" : type === "dod" ? "昨日：" : "上周：",
                    parent: id,
                    fill: "#565758",
                    fontSize: 11,
                },
            });
        },

        // 输入端点控制
        drawInPoints(cfg, group) {
            let size = cfg.size;
            const width = parseInt(size[0]);
            const height = parseInt(size[1]);
            const offsetX = -width / 2;
            const offsetY = -height / 2;
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
            const offsetX = -width / 2;
            const offsetY = -height / 2;
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

        drawPeriod(cfg, group) {
            let size = cfg.size;
            const width = parseInt(size[0]);
            const height = parseInt(size[1]);
            const offsetX = -width / 2;
            const offsetY = -height / 2;
            // 添加文本
            group.addShape("text", {
                attrs: {
                    x: offsetX + width - 10,  // 距离右边缘的距离，可根据需要调整
                    y: offsetY + 10,          // 距离顶部的距离，可根据需要调整
                    textAlign: "right",
                    textBaseline: "top",
                    text: cfg.period,                // 标识文本，可以根据需要设置为 "1d" 或 "1m"
                    fill: ["5m", "10m", "30m"].includes(cfg.period) ? "#00ff00" : "1d" === cfg.period ? "#0000ff" : "#ff0000",           // 设置文本颜色为绿色
                    fontSize: 12,
                },
            });
        },

        // 绘制节点
        draw(cfg, group) {
            console.log("当前节点data:{}", cfg)
            // 背景
            const shape = this.drawBackground(cfg, group);
            // 标题
            this.drawTitle(cfg, group);
            // 数值
            this.drawValue(cfg, group);
            // 环比
            const types = ["hoh", "dod", "wow"];
            const sortedTypes = cfg.viewComparison.sort((a, b) => {
                return types.indexOf(a) - types.indexOf(b);
            });
            for (let index = 1; index <= sortedTypes.length; index++) {
                this.drawComparison(sortedTypes[index - 1], cfg, group, index)
            }
            // 统计时段
            this.drawPeriod(cfg, group);
            // 输入端点控制
            this.drawInPoints(cfg, group);
            // 输出端点控制
            this.drawOutPoints(cfg, group);

            return shape;
        },

        // 设置状态
        setState(name, value, item) {
            const group = item.getContainer();
            const shape = group.get("children")[0];

            const children = group.findAll((g) => {
                return g._attrs.parent === shape._attrs.id;
            });
            const circles = group.findAll((circle) => {
                return circle._attrs.isInPoint || circle._attrs.isOutPoint;
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

export default textCardNode;
