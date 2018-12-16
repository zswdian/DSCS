$(document).ready(function () {
    $.post('/DisplayInterface/Display/StatisticsMDJFTroubleshooting', function (result) {
        var concie = document.getElementById('concie');
        var CieChart = echarts.init(concie);
        console.log(result);
      
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            legend: {
                x: 'center',
                y: 'bottom'
            },
            calculable: true,
            series: [{
                color: ['#0cfacb', '#20ecc2', '#31debb', '#44cdb1', '#5cbaa7', '#75a59b', '#fd355b', '#e84765', '#d5566e', '#be6878', '#a77c84', '#8f908f'],
                type: 'pie',
                radius: [60, 150],
                center: ['50%', '50%'],
                roseType: 'radius',
                data: (function () {                 
                    var datas = [];
                    for (var i = 0; i <12; i++) {
                        var value = result.data[i].count;
                        var name = result.data[i].name;
                        datas.push({
                            "value": value,
                            "name": name
                        })
                      
                    }
                    return datas;
                })()
                //data: [{
                //    value: datavalue,
                //    name: dataname,
                //},
                //{
                //    value: datavalue,
                //    name: dataname,
                //},
                //{
                //    value: datavalue,
                //    name: dataname,
                //},
                //{
                //    value: datavalue,
                //    name: dataname,
                //},
                //{
                //    value: datavalue,
                //    name: dataname,
                //},
                //{
                //    value: 69.5,
                //    name: '劳动人事争议'
                //},
                //{
                //    value: 70.5,
                //    name: '金融借贷纠纷'
                //},
                //{
                //    value: 80,
                //    name: '土地及资源权属纠纷'
                //},
                //{
                //    value: 71.3,
                //    name: '城乡建设发展纠纷'
                //},
                //{
                //    value: 80.1,
                //    name: '涉法涉诉纠纷'
                //},
                //{
                //    value: 71.3,
                //    name: '其他行政执法纠纷'
                //},
                //{
                //    value: 73.1,
                //    name: '其他'
                //},
                //]
            }]
        };
        CieChart.setOption(option)
    })
   
   
})
