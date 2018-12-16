$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsRealPopulation', function (result) {
        var Actual = document.getElementById('Actual')
        var acChart = echarts.init(Actual);
        console.log(result);
        var values = [];
        //流动人口
        var flow = result.data[2].name;
        //境外人口
        var overseas = result.data[1].name;
        //为落实人口
        var carry = result.data[3].name;
        //户籍人口
        var registration = result.data[0].name;
        for (var i = 0; i < result.data.length; i++) {
            values.push(result.data[i].count);
        }

        // 指定图表的配置项和数据
        var option = {
            radar: [{

                indicator: [
                    {
                        text: registration,
                        max: 30
                    },
                    {
                        text: overseas,
                        max: 10
                    },
                    {
                    text: flow,
                    max: 10
                },
                {
                    text: carry,
                    max: 10
                },
                

                ],
                /*
                                        textStyle: {
                                            color: '#fff'
                                        },*/
                center: ['50%', '50%'],
                radius: 142,
                startAngle: 90,
                splitNumber: 3,
                orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'vertical'为纵向.
                // shape: 'circle',
                // backgroundColor: {
                //     image:imgPath[0]
                // },
                name: {
                    formatter: '{value}',
                    textStyle: {
                        fontSize: 24, //外圈标签字体大小
                        color: '#09b391' //外圈标签字体颜色
                    }
                },
                splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                    show: true,
                    areaStyle: { // 分隔区域的样式设置。
                        color: ['#001321', '#001321'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                    }
                },
                // axisLabel:{//展示刻度
                //     show: true
                // },
                axisLine: { //指向外圈文本的分隔线样式
                    lineStyle: {
                        color: '#09b391'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#1b7d69', // 分隔线颜色
                        width: 1, // 分隔线线宽
                    }
                }
            },],
            series: [{
                name: '雷达图',
                type: 'radar',
                symbol: 'circle',
                itemStyle: {
                    emphasis: {
                        lineStyle: {
                            width: 2
                        }
                    },
                    normal: {
                        color: '#fff',
                        /*  borderColor:'#fff',*/
                        lineStyle: {
                            color: '#09b391',
                            width: 1
                        }
                    }
                },
                symbolSize: 8,
                data: [{
                    value: values,
                    areaStyle: {
                        normal: { // 单项区域填充样式
                            color: {
                                type: 'linear',
                                x: 0, //右
                                y: 0, //下
                                x2: 1, //左
                                y2: 1, //上
                                ccolor: '#09b391',
                                /* colorStops: [{
                                     offset: 0,
                                     color: '#09b391'
                                 }, {
                                     offset: 0.5,
                                     color: 'rgba(0,0,0,0)'
                                 }, {
                                     offset: 1,
                                     color: '#1b7d69'
                                 }],*/
                                /*     globalCoord: false*/
                            },
                            opacity: 0.5 // 区域透明度
                        }
                    },
                    /* label: {                    // 单个拐点文本的样式设置
                         normal: {
                             show: true,             // 单个拐点文本的样式设置。[ default: false ]
                             position: 'top',        // 标签的位置。[ default: top ]
                             distance: 2,            // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                             color: '#09b391',          // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                             fontSize: 14,           // 文字的字体大小
                             formatter:function(params) {
                                 return params.value;
                             }
                         }
                     },*/
                    itemStyle: {
                        normal: { //图形悬浮效果
                            borderColor: '#09b391',
                            borderWidth: 2
                        }
                    },
                    // lineStyle: {
                    //     normal: {
                    //         opacity: 0.5// 图形透明度
                    //     }
                    // }
                }]
            },]
        };

        acChart.setOption(option)

    })
  
})
