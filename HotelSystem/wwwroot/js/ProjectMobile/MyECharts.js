function ProjectPrograss(data) {
    var chartId = document.getElementById('main1');

    var myChart1 = echarts.init(chartId);
    var option1 = {
        backgroundColor: '#fff',
        title: {
            text: '项目进度',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#000'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br />{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: -20,
            max: 100,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [{
            name: '项目进展',
            type: 'pie',
            radius: [30, 120],
            center: ['50%', '50%'],
            roseType: 'radius',
            data: data,

            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(0, 0, 0, 1)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#eb2100',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.1)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }]
    };
    myChart1.setOption(option1);
    myChart1.on('click', function (params) {
        var id = params.data.id;
        $.post("/ProjectMobile/ProjectContent?Id=" + id, function (result) {
            console.log(result);
            $("#detail").html(result.data);
        });
       
    });
}
$(function () {
    function Init(result) { 
        var time = setInterval(function () {
            if (echarts) {
                clearInterval(time);
                ProjectPrograss(result.data);
            }
        },300); 
    }

    var id = document.getElementById('xmid').value;
    $.post("/ProjectMobile/ProjectDetails?Id=" + id, function (result) {
        Init(result);

    });
    $(".bar-nav").click(function () {
        window.history.back(-1);
    })
})

