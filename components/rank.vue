<template>
    <div>
        <div style="font-size: 16px;font-weight: bold;text-align: center;margin: 30px 10px 0 0">答题排名</div>
        <div :style="{width,height}" :id="id"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';

/**
 * @typedef Data
 * @property {string} name 答题人
 * @property {number} runTime 运行时间
 * @property {number} memoConsume 消耗内存
 */
export default {
    name: "rank",
    props: {
        /**
         * @type Data[]
         */
        data: Array,
    },
    data() {
        return {
            id: "rank-" + Date.now(),
            width: "100%",
            height: "400px",
        };
    },
    mounted() {
        if (!this.data || !this.data.length) {
            this.height = 0;
            return;
        }
        var app = {};
        var chartDom = document.getElementById(this.id);
        var myChart = echarts.init(chartDom);
        var option;
        const posList = [
            'left',
            'right',
            'top',
            'bottom',
            'inside',
            'insideTop',
            'insideLeft',
            'insideRight',
            'insideBottom',
            'insideTopLeft',
            'insideTopRight',
            'insideBottomLeft',
            'insideBottomRight',
        ];
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90,
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right',
                },
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom',
                },
            },
            position: {
                options: posList.reduce(function (map, pos) {
                    map[pos] = pos;
                    return map;
                }, {}),
            },
            distance: {
                min: 0,
                max: 100,
            },
        };
        app.config = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15,
            onChange: function () {
                const labelOption = {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance,
                };
                myChart.setOption({
                    series: [
                        {
                            label: labelOption,
                        },
                        {
                            label: labelOption,
                        },
                    ],
                });
            },
        };
        const labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            // formatter: '{name|{a}}: {c}',
            fontSize: 12,
            rich: {
                name: {},
            },
        };
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            legend: {
                data: ['运行时间(ms)', '消耗内存(MB)'],
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack'] },
                    restore: { show: true },
                    saveAsImage: { show: true },
                },
            },
            xAxis: {
                type: 'category',
                axisTick: { show: false },
                data: this.plotData.names,
                name: "答题人",
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: '运行时间(ms)',
                    type: 'bar',
                    barGap: 0,
                    label: labelOption,
                    emphasis: {
                        focus: 'series',
                    },
                    itemStyle: {
                        color: "#9bea45",
                    },
                    data: this.plotData.runTimes,
                },
                {
                    name: '消耗内存(MB)',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series',
                    },
                    itemStyle: {
                        color: "#0099f8",
                    },
                    data: this.plotData.memoConsumes,
                },
            ],
        };
        option && myChart.setOption(option);
    },
    computed: {
        plotData() {
            const names = [];
            const runTimes = [];
            const memoConsumes = [];
            this.data.forEach(item => {
                names.push(item.name);
                runTimes.push(item.runTime);
                memoConsumes.push(item.memoConsume);
            });
            return {
                names,
                runTimes,
                memoConsumes,
            };
        },
    },
};
</script>

<style scoped>

</style>
