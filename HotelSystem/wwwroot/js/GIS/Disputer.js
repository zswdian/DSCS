$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsMDJFTroubleshootingLine', function (result) {
        var contra = document.getElementById('contra');
        var ContraChart = echarts.init(contra);
        console.log(result);
        var xdata = [];
        var ydata = [];
        for (var i = 0; i < result.data.length; i++) {

            xdata.push(result.data[i].name.slice(5,7));
            ydata.push(result.data[i].count);
          
        }
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                name: '月份',
                boundaryGap: true,
                nameTextStyle: {
                    fontSize: 18,
                    color: '#09b391',
                    padding: [0, 12, 10, 5]
                },
                axisLine: {
                    lineStyle: {
                        color: '#3b4a48'
                    }
                },
                axisLabel: {
                    margin: 10,
                    interval: 0,
                    textStyle: {
                        fontSize: 24,
                        color: '#09b391'
                    }
                },
                data: xdata,
            }],
            yAxis: [{
                type: 'value',
                min: 0,
                max: 50,
                name: '事件',
                // nameGap:25,
                nameTextStyle: {
                    fontSize: 24,
                    color: '#09b391',
                    padding: [0, 12, 10, 40]
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#3b4a48'
                    },
                    textStyle: {
                        color: '#000',

                    }
                },
                axisLabel: {
                    margin: 20,
                    textStyle: {
                        fontSize: 24,
                        color: '#09b391',
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#12242d'
                    }
                }
            }],
            series: [{
                type: 'line',
                smooth: true,
                // symbolSize:10,
                lineStyle: {
                    normal: {
                        width: 2
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(9, 179, 145, 0.4)'
                        }, {
                            offset: 0.9,
                            color: 'rgba(9, 179, 145, 0.03)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'rgb(9, 179, 145)'
                    }
                },
                data: ydata
            }]
        };
        ContraChart.setOption(option);

    })
   
   
   

})
