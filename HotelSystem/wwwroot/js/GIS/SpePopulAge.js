﻿$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsSpecialPopulationByAge', function (result) {
        console.log(result);
        var age = document.getElementById('age');
        var ageChart = echarts.init(age);
        var option = {
            /*  backgroundColor: '#424956',*/
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",

            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['42%', '55%'],
                    color: ['#fd355b', '#0cfccc', '#045b53'],
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
        ageChart.setOption(option);

    })
  
})
