import G6 from '@antv/g6';

const trendNode = () => {

    /**
     * 自定义Table表格节点
     */
    G6.registerNode("trendNode", {
        draw(cfg, group) {
            const { barData = [], lineData = [], width = 200, height = 100 } = cfg;

            // 绘制节点背景
            const keyShape = group.addShape('rect', {
                attrs: {
                    x: 0,
                    y: 0,
                    width,
                    height,
                    fill: '#fff',
                    stroke: '#666',
                },
            });

            // 计算柱状图和折线图的最大值和最小值
            const maxBarValue = Math.max(...barData);
            const maxLineValue = Math.max(...lineData);
            const maxValue = Math.max(maxBarValue, maxLineValue);
            const minBarValue = Math.min(...barData);
            const minLineValue = Math.min(...lineData);
            const minValue = Math.min(minBarValue, minLineValue);

            // 绘制柱状图
            const barWidth = width / (2 * barData.length); // 柱子的宽度
            barData.forEach((value, index) => {
                const barHeight = ((value - minValue) / (maxValue - minValue)) * height;
                group.addShape('rect', {
                    attrs: {
                        x: 2 * barWidth * index,
                        y: height - barHeight,
                        width: barWidth,
                        height: barHeight,
                        fill: '#1890ff',
                    },
                });
            });

            // 绘制折线图
            if (lineData.length > 1) {
                const points = lineData.map((value, index) => {
                    const x = (width / (lineData.length - 1)) * index;
                    const y = ((maxValue - value) / (maxValue - minValue)) * height;
                    return [x, y];
                });

                group.addShape('polyline', {
                    attrs: {
                        points,
                        stroke: '#ff4d4f',
                        lineWidth: 2,
                    },
                });
            }

            return keyShape;
        },
    });

};

export default trendNode;