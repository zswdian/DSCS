$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsEmphases', function (result) {
        console.log(result);
        var kpxdata = [];
        var kpyvalue = [];
        for (var i = 0; i < result.data.length; i++) {
            kpxdata.push(result.data[i].name);
            kpyvalue.push(result.data[i].count);
        }
        var keyper = document.getElementById('keyper');
        var kpChart = echarts.init(keyper);
        var colorList = {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            /* color:'#09b391',*/
            colorStops: [{
                offset: 0,
                color: '#09b391' // 0% 处的颜色
            }, {
                offset: 1,
                color: '#09b391' // 100% 处的颜色
            }],
            globalCoord: false // 缺省为 false
        };

        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                name: '乡镇',
                nameTextStyle: {
                    fontSize: 24,
                    color: '#09b391',
                    padding: [0, 12, 10, 5]
                },
                data: kpxdata,
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
                },
            },

            yAxis: {
                type: 'value',
                min: 0,
                max: 50,
                name: '人数',
                nameTextStyle: {
                    fontSize: 24,
                    color: '#09b391',
                    padding: [0, 12, 10, 40]
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
                    margin: 20,
                    textStyle: {
                        fontSize: 24,
                        color: '#09b391',
                        fontFamily: 'Microsoft YaHei'
                    }
                }
            },

            series: [{
                name: '',
                type: 'bar',
                barWidth: '40%',
                itemStyle: {
                    normal: {
                        color: function (params) {

                            return colorList;
                        },

                    },
                    emphasis: {
                        color: '#fd355b',
                    }

                    //barBorderRadius: 15,
                },

                data: kpyvalue,
            }]
        };

        var app = {
            currentIndex: -1,
        };
        setInterval(function () {
            var dataLen = option.series[0].data.length;

            // 取消之前高亮的图形
            kpChart.dispatchAction({
                type: 'downplay',
                seriesIndex: 0,
                dataIndex: app.currentIndex
            });
            app.currentIndex = (app.currentIndex + 1) % dataLen;
            //console.log(app.currentIndex);
            // 高亮当前图形
            kpChart.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: app.currentIndex,
            });
            // 显示 tooltip
            kpChart.dispatchAction({
                type: 'showTip',
                seriesIndex: 0,
                dataIndex: app.currentIndex
            });


        }, 1000);
        kpChart.setOption(option)
    })


    })
   