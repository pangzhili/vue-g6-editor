import G6 from '@antv/g6';

const tableNode = () => {

    /**
     * 判断当前是否处于Box中
     */
    const isInBBox = (point, bbox) => {
        const {
            x,
            y
        } = point;
        const {
            minX,
            minY,
            maxX,
            maxY
        } = bbox;
        return x < maxX && x > minX && y > minY && y < maxY;
    };

    /**
     * 表格每行高度
     */
    const itemHeight = 25;

    G6.registerNode("tableNode", {
        draw(cfg, group) {
            const width = 250;
            const height = 96;
            const itemCount = 10;
            const boxStyle = {
                stroke: "#096DD9",
                radius: 4,
            };

            const {
                startIndex = 0,
                selectedIndex,
                collapsed,
                icon,
                attrs
            } = cfg;
            const list = attrs;
            const afterList = list.slice(
                Math.floor(startIndex),
                Math.floor(startIndex + itemCount - 1)
            );
            const offsetY = (0.5 - (startIndex % 1)) * itemHeight + 30;

            group.addShape("rect", {
                attrs: {
                    fill: boxStyle.stroke,
                    height: 30,
                    width,
                    radius: [boxStyle.radius, boxStyle.radius, 0, 0],
                },
                draggable: true,
            });

            let fontLeft = 12;

            if (icon && icon.show !== false) {
                group.addShape("image", {
                    attrs: {
                        x: 8,
                        y: 8,
                        height: 16,
                        width: 16,
                        ...icon,
                    },
                });
                fontLeft += 18;
            }

            group.addShape("text", {
                attrs: {
                    y: 22,
                    x: fontLeft,
                    fill: "#fff",
                    text: cfg.label,
                    fontSize: 12,
                    fontWeight: 500,
                },
            });

            group.addShape("rect", {
                attrs: {
                    x: 0,
                    y: collapsed ? 30 : 80,
                    height: 15,
                    width,
                    fill: "#eee",
                    radius: [0, 0, boxStyle.radius, boxStyle.radius],
                    cursor: "pointer",
                },
                name: collapsed ? "expand" : "collapse",
            });

            group.addShape("text", {
                attrs: {
                    x: width / 2 - 6,
                    y: (collapsed ? 30 : 80) + 12,
                    text: collapsed ? "+" : "-",
                    width,
                    fill: "#000",
                    radius: [0, 0, boxStyle.radius, boxStyle.radius],
                    cursor: "pointer",
                },
                name: collapsed ? "expand" : "collapse",
            });

            const keyshape = group.addShape("rect", {
                attrs: {
                    x: 0,
                    y: 0,
                    width,
                    height: collapsed ? 45 : height,
                    ...boxStyle,
                },
                draggable: true,
            });

            if (collapsed) {
                return keyshape;
            }

            const listContainer = group.addGroup({});
            listContainer.setClip({
                type: "rect",
                attrs: {
                    x: -8,
                    y: 30,
                    width: width + 16,
                    height: 80 - 30,
                },
            });
            listContainer.addShape({
                type: "rect",
                attrs: {
                    x: 1,
                    y: 30,
                    width: width - 2,
                    height: 80 - 30,
                    fill: "#fff",
                },
                draggable: true,
            });

            if (list.length > itemCount) {
                const barStyle = {
                    width: 4,
                    padding: 0,
                    boxStyle: {
                        stroke: "#00000022",
                    },
                    innerStyle: {
                        fill: "#00000022",
                    },
                };

                listContainer.addShape("rect", {
                    attrs: {
                        y: 30,
                        x: width - barStyle.padding - barStyle.width,
                        width: barStyle.width,
                        height: height - 30,
                        ...barStyle.boxStyle,
                    },
                });

                const indexHeight =
                    afterList.length > itemCount ?
                        (afterList.length / list.length) * height :
                        10;

                listContainer.addShape("rect", {
                    attrs: {
                        y: 30 +
                            barStyle.padding +
                            (startIndex / list.length) * (height - 30),
                        x: width - barStyle.padding - barStyle.width,
                        width: barStyle.width,
                        height: Math.min(height, indexHeight),
                        ...barStyle.innerStyle,
                    },
                });
            }
            if (afterList) {
                afterList.forEach((e, i) => {
                    const isSelected =
                        Math.floor(startIndex) + i === Number(selectedIndex);
                    let {
                        key = "", type
                    } = e;
                    if (type) {
                        key += " - " + type;
                    }
                    const label = key.length > 26 ? key.slice(0, 24) + "..." : key;

                    listContainer.addShape("rect", {
                        attrs: {
                            x: 1,
                            y: i * itemHeight - itemHeight / 2 + offsetY,
                            width: width - 4,
                            height: itemHeight,
                            radius: 2,
                            lineWidth: 1,
                            cursor: "pointer",
                        },
                        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                        name: `item-${Math.floor(startIndex) + i}-content`,
                        draggable: true,
                    });

                    if (!cfg.hideDot) {
                        listContainer.addShape("circle", {
                            attrs: {
                                x: 0,
                                y: i * itemHeight + offsetY,
                                r: 3,
                                stroke: boxStyle.stroke,
                                fill: "white",
                                radius: 2,
                                lineWidth: 1,
                                cursor: "pointer",
                            },
                        });
                        listContainer.addShape("circle", {
                            attrs: {
                                x: width,
                                y: i * itemHeight + offsetY,
                                r: 3,
                                stroke: boxStyle.stroke,
                                fill: "white",
                                radius: 2,
                                lineWidth: 1,
                                cursor: "pointer",
                            },
                        });
                    }

                    listContainer.addShape("text", {
                        attrs: {
                            x: 12,
                            y: i * itemHeight + offsetY + 6,
                            text: label,
                            fontSize: 12,
                            fill: "#000",
                            fontFamily: "Avenir,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
                            full: e,
                            fontWeight: isSelected ? 500 : 100,
                            cursor: "pointer",
                        },
                        name: `item-${Math.floor(startIndex) + i}`,
                    });
                });
            }


            return keyshape;
        },
        getAnchorPoints() {
            return [
                [0, 0],
                [1, 0],
            ];
        },
    });

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
                click: "click",
                "node:mousemove": "move",
                "node:mousedown": "mousedown",
                "node:mouseup": "mouseup"
            };
        },
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
                    if (model.attrs.length < 2) {
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
                    if (startIndex > model.attrs.length - 1) {
                        startIndex = model.attrs.length - 1;
                    }
                    graph.updateItem(node, {
                        startIndex,
                        startX,
                    });
                    node.getEdges().forEach(edge => edgesToUpdate.add(edge))
                });
                edgesToUpdate.forEach(edge => edge.refresh())
            }
        },
        click(e) {
            const {
                graph
            } = this;
            const item = e.item;
            const shape = e.shape;
            if (!item) {
                return;
            }
            if (shape.get("name") === "collapse") {
                graph.updateItem(item, {
                    collapsed: true,
                    size: [300, 50],
                });
                setTimeout(() => graph.layout(), 100);
            } else if (shape.get("name") === "expand") {
                graph.updateItem(item, {
                    collapsed: false,
                    size: [300, 80],
                });
                setTimeout(() => graph.layout(), 100);
            }
        },
        mousedown(e) {
            this.isMousedown = true;
        },
        mouseup(e) {
            this.isMousedown = false;
        },
        move(e) {
            if (this.isMousedown) return;
            const name = e.shape.get("name");
            const item = e.item;

            if (name && name.startsWith("item")) {
                this.graph.updateItem(item, {
                    selectedIndex: Number(name.split("-")[1]),
                });
            } else {
                this.graph.updateItem(item, {
                    selectedIndex: NaN,
                });
            }
        },
    });

};

export default tableNode;