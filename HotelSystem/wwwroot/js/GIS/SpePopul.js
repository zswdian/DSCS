$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsSpecialPopulation', function (result) {
        console.log(result);
        var spdata = [];
        var spvalue = [];
        for (var i = 0; i < result.data.length; i++) {
            spdata.push(result.data[i].name);
            spvalue.push(result.data[i].count);
        }
        var Special = document.getElementById('Special');
        var spChart = echarts.init(Special);
        // 颜色
        var lightBlue = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: 'rgba(7, 179, 145, 1)' // 0% 处的颜色
            }, {
                offset: 1,
                color: 'rgba(7, 179, 145, 0.2)' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        };
        var darkBlue = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 0,
                color: 'rgba(253, 53, 91, 1)' // 0% 处的颜色
            }, {
                offset: 1,
                color: 'rgba(253, 53, 91, 0.2)' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        };

        //function randomData() {
        //    value = Math.random() * 50;
        //    return {
        //        value: Math.round(value)
        //    }
        //}
        // 时间设置
        //function checkTime(i) {
        //    if (i < 10) {
        //        i = "0" + i;
        //    }
        //    return i;
        //}

        //function timeSet() {
        //    var newTime = new Date();
        //    var m = newTime.getMinutes();
        //    var s = newTime.getSeconds();
        //    m = checkTime(m);
        //    s = checkTime(s);
        //    return [m, s].join(':');
        //}

        //var data = [];
        //var timeData = [];

        //for (var i = 0; i < 4; i++) {
        //    timeData.unshift(timeSet());
        //    data.unshift(randomData());
        //}

        // 指定图表的配置项和数据
        var option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                position: 'bottom',
                min: -1,
                max: 4,
                /* splitNumber:6,*/
                // boundaryGap: 100,
                data: spdata,
                axisLine: {
                    show: true,
                    onZero: false,
                    lineStyle: {
                        color: '#3b4a48'
                    }

                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#12242d'
                    }
                },

                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 18,
                        color: '#09b391',
                        fontFamily: 'Microsoft YaHei'
                    }
                },
                axisTick: {
                    interval: (index) => {
                        if (index === -1 || index === 4) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }

            },
            yAxis: [{
                type: 'value',
                name: '人数',
                boundaryGap: true,
                max: 50,
                min: 0,
                nameTextStyle: {
                    fontSize: 24,
                    color: '#09b391',
                    padding: [0, 12, 10, 40]
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#3b4a48'
                    }

                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#12242d'
                    }
                },

                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 24,
                        color: '#09b391',
                        fontFamily: 'Microsoft YaHei'
                    }
                }
            }],
            series: [{
                name: '数量',
                type: 'pictorialBar',
                barCategoryGap: '-30%',
                symbol: 'path://d="M150 0 L75 200 L225 200 Z"',
                /*  symbolOffset: [60,0],*///柱子的位置
                /*   symbolSize: [300,490],//size,单个symbol的大小*/

                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{c}',
                            position: 'top',
                            color: '#fff',
                            fontSize: 14,
                            /*  symbolOffset: [60,0]*/
                        },
                        color: function (params) {
                            var colorlist = [darkBlue, lightBlue, darkBlue, lightBlue]
                            return colorlist[params.dataIndex]
                        },
                    },
                   
                },
                data: spvalue,
                //刻度显示在顶部

            }],
        };

        //var key = 0;
        //setInterval(function () {

        //    timeData.shift();
        //    timeData.push(timeSet());

        //    data.shift();
        //    data.push(randomData());

        //    // 颜色控制
        //    key = (key === 1) ? 0 : 1;

        //    spChart.setOption({
        //        series: [{
        //            itemStyle: {
        //                normal: {
        //                    color: function (params) {
        //                        return (params.dataIndex + key) % 2 ? darkBlue : lightBlue;
        //                    }
        //                }
        //            },
        //            data: data
        //        }]
        //    });
        //}, 1000);
        spChart.setOption(option)


    })
})
