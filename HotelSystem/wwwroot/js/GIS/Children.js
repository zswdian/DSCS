$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsMinorPopulation', function (result) {
        console.log(result);

    })
    var Aminor = document.getElementById('Aminor');
    var AmChart = echarts.init(Aminor);
    // Generate data
    var category = ['凤仪街道', '安场镇', '苗塘镇', '格林镇', '中观镇',
        '新洲镇', '芙蓉江镇', '和溪镇', '流渡镇', '瑞溪镇', '小雅镇', '碧峰镇',
        '斑竹镇', '土坪镇', '乐俭镇', '杨兴镇', '桴木焉镇', '市坪苗族仡佬族乡', '谢坝仡佬足苗族乡'
    ];
    var lineData = [40, 23, 34, 24, 12, 25, 32, 47, 15, 27, 29, 13, 14.4, 40, 28, 12, 32, 12, 11];
    var barData = [47, 15, 27, 29, 13, 14.4, 40, 28, 12, 32, 12, 11, 40, 23, 34, 24, 12, 25, 32,];


    // option
    var option = {
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0%',
            containLabel: true
        },
        xAxis: {
            data: category,
            name: '乡镇',
            nameTextStyle: {
                fontSize: 24,
                color: '#09b391',
                padding: [0, 12, 10, 5]
            },
            axisLine: {
                lineStyle: {
                    color: '#3b4a48'
                }
            },

            axisLabel: {
                interval: 0,
                formatter: function (value) {
                    var ret = ""; //拼接加\n返回的类目项
                    var maxLength = 1; //每项显示文字个数
                    var valLength = value.length; //X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1) //如果类目项的文字大于3,
                    {
                        for (var i = 0; i < rowN; i++) {
                            var temp = ""; //每次截取的字符串
                            var start = i * maxLength; //开始截取的位置
                            var end = start + maxLength; //结束截取的位置
                            //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                            temp = value.substring(start, end) + "\n";
                            ret += temp; //凭借最终的字符串
                        }
                        return ret;
                    } else {
                        return value;
                    }
                },
                margin: 10,
                textStyle: {
                    fontSize: 24,
                    color: '#09b391',
                    fontFamily: 'Microsoft YaHei'
                }
            }
        },
        yAxis: {
            name: '人数（占比）',
            min: 0,
            max: 50,
            /*   splitLine: {show: false},*/
            nameTextStyle: {
                fontSize: 24,
                color: '#09b391',
                padding: [0, 12, 10, 150]
            },
            axisLine: {
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
                interval: 0,
                margin: 10,
                textStyle: {
                    fontSize: 24,
                    color: '#09b391',
                    fontFamily: 'Microsoft YaHei'
                }
            }
        },
        series: [{
            name: 'line',
            type: 'line',
            smooth: true,
            showAllSymbol: true,
            symbol: 'emptyCircle',
            symbolSize: 15,
            data: lineData
        }, {
            name: 'bar',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
                normal: {
                    barBorderRadius: 5,
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#09b391' },
                            { offset: 1, color: '#09b391' }
                        ]
                    )
                }
            },
            data: barData
        }, {
            name: 'line',
            type: 'bar',
            barGap: '-100%',
            barWidth: 10,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: 'rgba(9,179,145,0.05)' },
                            { offset: 1, color: 'rgba(9,179,145,0)' }
                        ]
                    )
                }
            },
            z: -12,
            data: lineData
        }, {
            name: 'dotted',
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: 'rgba(9,179,145,0.05)' },
                            { offset: 1, color: 'rgba(9,179,145,0)' }
                        ]
                    )
                }
            },
            symbolRepeat: true,
            symbolSize: [12, 4],
            /*  symbolMargin: 1,*/
            z: -10,
            data: lineData
        }]
    };
    AmChart.setOption(option);
})
