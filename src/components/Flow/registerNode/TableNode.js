import G6 from '@antv/g6';
import {isInBBox, uniqueId} from "@/utils";

const tableNode = () => {

    /**
     * 表格每行高度
     */
    const itemHeight = 30;

    /**
     * 自定义Table表格节点
     */
    G6.registerNode("tableNode", {

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
            const {
                startIndex = 0,
                selectedIndex,
                tableData,
                size,
                color,
                id
            } = cfg;
            const itemCount = 8;
            const [width, height] = size.map(Number);

            const afterList = tableData.slice(
                Math.floor(startIndex),
                Math.floor(startIndex + itemCount - 1)
            );
            const offsetY = (0.5 - (startIndex % 1)) * itemHeight + 30;

            // 表格矩形
            group.addShape("rect", {
                attrs: {
                    height: height,
                    width,
                    parent: id,
                    stroke: "#ced4d9",
                    radius: 4
                },
                draggable: true
            });
            // 表格标题矩形
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
            // 表格标题文字
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
            // 表格表头
            group.addShape("rect", {
                attrs: {
                    x: 0,
                    y: 35,
                    height: 30,
                    width,
                    parent: id,
                },
                draggable: true
            });

            // 表格表头Header
            const headers = ["时间", "数据"];
            cfg.viewComparison.forEach(vc => {
                if ("hoh" === vc) {
                    headers.push("时段环比")
                } else if ("dod" === vc) {
                    headers.push("日环比")
                } else {
                    headers.push("周环比")
                }
            })
            const columnWidth = width / headers.length;
            headers.forEach((header, index) => {
                group.addShape("text", {
                    attrs: {
                        x: columnWidth * index + 30,
                        y: 60,
                        text: header,
                        fill: "#565758",
                        fontSize: 13,
                        fontWeight: 400,
                        parent: id
                    }
                });
            });

            // 表格整体外边框
            const keyShape = group.addShape("rect", {
                attrs: {
                    id,
                    x: 0,
                    y: 0,
                    width,
                    height,
                    stroke: "#ced4d9",
                    radius: 4
                },
                draggable: true,
            });
            // 表格整体外边框矩形添加颜色块
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

            // 表格内容组装
            const listContainer = group.addGroup({});
            listContainer.setClip({
                type: "rect",
                attrs: {
                    x: -8,
                    y: 70,
                    width: width,
                    height: height,
                },
            });

            if (afterList) {
                afterList.forEach((e, i) => {
                    const isSelected = Math.floor(startIndex) + i === Number(selectedIndex);
                    // 对每一列内容进行位置调整以对齐表头
                    const rowContents = [e.timePeriod, e.value, e.dodRate, e.wowRate];
                    rowContents.forEach((content, contentIndex) => {
                        // 根据表头计算位置
                        let xPosition = columnWidth * contentIndex + 30;
                        listContainer.addShape("text", {
                            attrs: {
                                x: xPosition,
                                y: i * itemHeight + offsetY + 50,
                                text: content,
                                fontSize: 13,
                                fill: isSelected ? "#1890ff" : "#000",
                                fontWeight: isSelected ? 500 : 300,
                                cursor: "pointer",
                            },
                            name: `item-${Math.floor(startIndex) + i}`,
                        });
                    });
                });
            }

            this.drawInPoints(cfg, group);
            this.drawOutPoints(cfg, group);
            return keyShape;
        },

        /**
         * 设置状态
         */
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

    /**
     * 表格滚动行为
     */
    G6.registerBehavior("table-scroll", {
        getDefaultCfg() {
            return {
                multiple: true,
            };
        },
        getEvents() {
            return {
                itemHeight,
                wheel: "scorll",
            };
        },
        // 滚动
        scorll(e) {
            e.preventDefault();
            const {
                graph
            } = this;
            const nodes = graph.getNodes().filter((n) => {
                const bbox = n.getBBox();
                return isInBBox(graph.getPointByClient(e.clientX, e.clientY), bbox);
            });

            const x = e.deltaX || e.movementX;
            let y = e.deltaY || e.movementY;
            if (!y && navigator.userAgent.indexOf('Firefox') > -1) y = (-e.wheelDelta * 125) / 3

            if (nodes) {
                const edgesToUpdate = new Set();
                nodes.forEach((node) => {
                    const model = node._cfg.model;
                    if (model.tableData.length < 2) {
                        return;
                    }
                    const idx = model.startIndex || 0;
                    let startX = model.startX || 0.5;
                    let startIndex = idx + y * 0.02;
                    startX -= x;
                    if (startIndex < 0) {
                        startIndex = 0;
                    }
                    if (startX > 0) {
                        startX = 0;
                    }
                    if (startIndex > model.tableData.length - 1) {
                        startIndex = model.tableData.length - 1;
                    }
                    graph.updateItem(node, {
                        startIndex,
                        startX,
                    });
                    node.getEdges().forEach(edge => edgesToUpdate.add(edge))
                });
                edgesToUpdate.forEach(edge => edge.refresh())
            }
        }
    });
};

export default tableNode;