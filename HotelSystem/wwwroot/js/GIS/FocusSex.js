$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsETBySex', function (result) {
        console.log(result);
        var sexy = document.getElementById('sexyoung');
        var sxChart = echarts.init(sexy);
        var option = {
            /*  backgroundColor: '#424956',*/
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",

            },
            /*    legend: {
        
                    orient: 'vertical',
                    x: 'right',
                    itemWidth: 14,
                    itemHeight: 14,
                    align: 'left',
        
                    data:['女性','男性'],
                    textStyle: {
                        color: '#fff'
                    }
                },*/
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['42%', '55%'],
                    color: ['#0cfccc', '#045b53'],
                    label: {
                        normal: {
                            formatter: '{b}\n{d}%'
                        },

                    },
                    /*labelLine:{
                      normal:{
                          length:40,
                      }
                    },*/
                    data: (function () {
                        var datas = [];
                        for (var i = 0; i < result.data.length; i++) {
                            var value = result.data[i].count;
                            var name = result.data[i].name;
                            datas.push({
                                "value": value,
                                "name": name
                            })

                        }
                        return datas;
                    })()
                }
            ]
        };
        sxChart.setOption(option);
    })

    })
   