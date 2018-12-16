function WeeklyWorkAnalysis(week, ps, cs) {
    // 评分变化统计
    var myChart3 = echarts.init(document.getElementById('main1'));
    var option3 = {
        backgroundColor: '#fff',
        title: {
            text: '评分变化'
        },
        tooltip: {
            trigger: 'axis',
            extraCssText: 'transform: rotate(90deg)',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['负责人评分', '公司评分']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                position: 'left',
                inverse: true,
                boundaryGap: false,
                data: week
            }
        ],
        xAxis: [
            {
                min: 0,
                max: 4,
                inverse: true,
                nameRotate: -90, //坐标轴名字旋转，角度值。
                position: 'top', //x 轴的位置【top bottom】
                axisLabel: {
                    formatter: function (value) {
                        var texts = [];
                        if (value == 0) {
                            texts.push('A');
                        }
                        else if (value == 1) {
                            texts.push('B');
                        }
                        else if (value == 2) {
                            texts.push('C');
                        }
                        else if (value == 3) {
                            texts.push('D');
                        }
                        else {
                            texts.push('E');
                        }
                        return texts;

                    }
                }
            }
        ],
        series: [
            {
                name: '负责人评分',
                type: 'line',
                data: ps
            },
            {
                name: '公司评分',
                type: 'line',
                data: cs
            },
        ]
    };

    myChart3.setOption(option3);
    //线路类型占比统计

}

function Init(result) {
    WeeklyWorkAnalysis(result.data.WeekList, result.data.PrincipalScoreList, result.data.CompanylScoreList);
}
var _Names = $("#UserName").data("id");
$.get("/AnalysisData/WeekDetail?Names=" + _Names, function (result) {
    console.log(result)
    Init(result);
})