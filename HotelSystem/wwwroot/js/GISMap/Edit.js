
var lnglat = new AMap.LngLat(107.43, 28.56);
var map = new AMap.Map("map", {
    resizeEnable: true,
    /* pitch: 50,*/
    center: lnglat,
    zoom: 14,
    mapStyle: 'amap://styles/blue', //设置地图的显示样式
    /*  viewMode:'3D',*/
});
//创建右键菜单
var menu = new ContextMenu(map);

//自定义菜单类
function ContextMenu(map) {
    var me = this;

    //地图中添加鼠标工具MouseTool插件
    this.mouseTool = new AMap.MouseTool(map);

    this.contextMenuPositon = null;

    var content = [];

    content.push("<div class='info context_menu'>");
    content.push("<p onclick='menu.addMarkerMenu()'>添加标记</p>");
    content.push("</div>");

    //通过content自定义右键菜单内容
    this.contextMenu = new AMap.ContextMenu({ isCustom: true, content: content.join('') });

    //地图绑定鼠标右击事件——弹出右键菜单
    map.on('rightclick', function (e) {
        me.contextMenu.open(map, e.lnglat);
        me.contextMenuPositon = e.lnglat; //右键菜单位置
    });
}
//单机出现标注图标
function addic(icon) {
    //var me = this;
    //var content = [];
    //content.push("<div class='info context_menu'>");
    //content.push("<p onclick='menu.addMarkerMenu()'>添加标记</p>");
    //content.push("</div>");
    ////通过content自定义右键菜单内容
    //this.contextMenu = new AMap.ContextMenu({ isCustom: true, content: content.join('') });
    ////地图绑定鼠标右击事件——弹出右键菜单
    //map.on('rightclick', function (e) {
    //    me.contextMenu.open(map, e.lnglat);
    //    me.contextMenuPositon = e.lnglat; //右键菜单位置
    //});
    ContextMenu.prototype.addMarkerMenu = function () {  //右键菜单添加Marker标记
        this.mouseTool.close();
        var marker = new AMap.Marker({
            icon: icon.attr("src"),
            map: map,
            position: this.contextMenuPositon //基点位置
        });
        console.log(this.contextMenuPositon);
        //删除标记
        //创建右键菜单
        var contextMenu = new AMap.ContextMenu();
        marker.on('rightclick', function (e) {
            contextMenu.open(map, e.lnglat);
            contextMenuPositon = e.lnglat;
           contextMenu.addItem("删除标记", function (e) {
                map.remove(marker);
              
            });
           
           
        });
        var lat = this.contextMenuPositon.lat; //纬度
        var lng = this.contextMenuPositon.lng;//经度
        var iconname = icon[0].name;
        var iconid = icon[0].id;
        //鼠标点击marker弹出自定义的信息窗体
        AMap.event.addListener(marker, 'click', function () {
            //infoWindow.open(map, marker.getPosition());

            var option = {
                type: 2,
                area: [700, 400],
                shade: 0.4,
                title: "地理信息",
                content: "/DataAnalysis/Geographics/Create?lat=" + lat + "&lng=" + lng + "&IconId=" + iconid + "&IconName=" + iconname,
                maxmin: true,
                success: function (layero) {
                    $(layero).addClass("scroll-wrapper");//苹果 iframe 滚动条失效解决方式
                }
            };
            layer.open(option);

        });
        this.contextMenu.close();
    };
    menu.contextMenu.open(map, lnglat);
}

var selectUrl = "";
$('.addicon').click(function () {
    selectUrl = $(this).find('img');
    addic(selectUrl);
});



//网格绘制
function addg() {
    ContextMenu.prototype.addMarkerMenu = function () {  //右键菜单添加Marker标记
        this.mouseTool.close();
        var marker = new AMap.Marker({
            map: map,
            position: this.contextMenuPositon //基点位置
        });
        /*  console.log(this.contextMenuPositon);*/
        this.contextMenu.close();
    };
    menu.contextMenu.open(map, lnglat);
}

var mouseTool = new AMap.MouseTool(map);

function drawPolygon(name) {

    mouseTool.polygon({
        extData:name,
        strokeColor: "#FF33FF",
       // strokeOpacity: 1,
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        fillText: '',
        // strokeStyle是dashed时有效
        strokeDasharray: [30, 10],
    })
}




$('.addgrid').click(function (e) {
    var self = $(this)
    console.log(e.target.style.backgroundColor);
    var name = self[0].innerText;
    drawPolygon(name);
    addg();
   
  //  getdata();
    mouseTool.on('draw', function (event) {
        // event.obj 为绘制出来的覆盖物对象
        console.log(event.obj);
        //添加文字
        var bounds = event.obj.getBounds();
        var Name = event.obj.C.extData;
        var text = new AMap.Text({
            text: Name,
            /*   textAlign:'center',*/
            verticalAlign: 'middle',
            position: bounds.getCenter(),
            height: 5000,
            style: {
                'background-color': 'transparent',
                '-webkit-text-stroke': 'red',
                '-webkit-text-stroke-width': '0.5px',
                'text-align': 'center',
                'border': 'none',
                'color': 'white',
                'font-size': '24px',
                'font-weight': 600
            }
        });

        text.setMap(map);
        alert('网格已制作完成');
        mouseTool.close();
        //添加的信息
        var Color = event.obj.C.fillColor;
        var Region = event.obj.C.path;
        console.log(Region);
        console.log(Color);
        //添加弹窗
        AMap.event.addListener(event.obj, 'click', function () {  
            var str = "/DataAnalysis/GridInformations/Create?Name=" + Name + "&=Color" + encodeURIComponent(Color)+ "&Region=" + Region
            console.log(encodeURIComponent(Color));
            var option = {
                type: 2,
                area: [700, 400],
                shade: 0.4,
                title: "网格信息",
                content:str,
                maxmin: true,
                success: function (layero) {
                    $(layero).addClass("scroll-wrapper");//苹果 iframe 滚动条失效解决方式
                }
            };
            layer.open(option);

            alert('弹出网格相关信息');
        })
        //右键删除
        var contextMenu = new AMap.ContextMenu();
        event.obj.on('rightclick', function (e) {
            contextMenu.open(map, e.lnglat);
            contextMenuPositon = e.lnglat;
            contextMenu.addItem("删除网格", function (e) {
                event.obj.setMap(null);
                text.setMap(null);
            });

        })
    });
})
//空判断
var GetOrganization = function (data, data2) { };
function isNull(temp) {
    if (temp === null || typeof (temp) === "undefined" || temp === "" || temp === "null")
        return true;
    else
        return false;
}
function layer_show(title, url, w, h, isSave, btnName, qp, callback) {
    if (isNull(title)) {
        title = "系统信息";
    };
    if (isNull(url)) {
        url = "404.html";
    };
    if (isNull(w)) {
        w = 700;
    };
    if (isNull(h)) {
        h = 450;
    };
    var isPx = !isNaN(w);
    if (isPx) {
        w = w + 'px';
        h = h + 'px';
    }

    var option = {
        type: 2,
        area: [w, h],
        shade: 0.4,
        title: title,
        content: url,
        maxmin: true,
        success: function (layero) {
            $(layero).addClass("scroll-wrapper");//苹果 iframe 滚动条失效解决方式
        }
    };
    var layFrame;
    if (isSave) {
        if (isNull(btnName))
            btnName = '保存数据';
        option.btn = [btnName, '取消'],
            option.yes = function () {
                var _btn = $(this);
                _btn.attr("disabled", "true");
                setTimeout(function () {
                    _btn.removeAttr("disabled");
                }, 2000); //设置2秒后提交按钮 显示  

                var _body = layFrame.contents().find("body");
                var frameWindow = layFrame[0].contentWindow;
                frameWindow.AD.cm.formSubmit();
                var formOption = frameWindow.AD.cm.ajaxFormOption;
                _body.find("form").ajaxSubmit(formOption);
            },
            option.btn2 = function () {
                layer_close();
            }
    }
    var windW = $(window).width();
    if (windW < 768 || qp) {
        option.maxmin = false;
        _openIndex = layer.open(option);

        layer.full(_openIndex);
        $(".layui-layer-title").mousedown(function () {
            layer_closes();
        });
    }
    else
        _openIndex = layer.open(option);

    layFrame = $("#layui-layer-iframe" + _openIndex);
    if (isNull(option.title) || option.title === "子标题") {
        layFrame.load(function () {
            $("#layui-layer" + _openIndex).find(".layui-layer-title").html(this.contentWindow.document.title);
        })

    }
    if (callback)
        layFrame.load(function () {
            callback(_openIndex, this.contentWindow);
        })
    else
        return _openIndex;
}
//选择框 <div class="btn btn-primary-outline az_selected" data-value="@item">选择</div>
function layer_select(title, url, w, h, callback) {
    var index = layer_show(title, url, w, h);
    var _frame = $("#layui-layer-iframe" + _openIndex);
    _frame.load(function () {
        var _body = layer.getChildFrame('body', index);
        _body.find(".az_selected").click(function () {
            var _val = $(this).data("value");
            callback(_val);
            close_iframe(index);
        });
    });
}
function close_iframe(index) {
    $("#layui-layer" + index).remove();
    $("#layui-layer-shade" + index).remove();
}


//保存标记

function save(icon) {
    ContextMenu.prototype.addMarkerMenu = function () {  //右键菜单添加Marker标记
        this.mouseTool.close();
        var marker = new AMap.Marker({
            icon: icon.attr("src"),
            map: map,
            position: this.contextMenuPositon //基点位置
        });
        console.log(this.contextMenuPositon);
    }
}
function getdata() {
    AD.cm.customCall = function (that, data) {
        if (data.success) {
            if (data.data != null) {
                console.log(data.data);
            }

        } else {
            alert("提交失败，请重新提交！！！")

        };
    }
}
//$(function () {
//    AD.cm.customCall = function (that, data) {
//        if (data.success && data.data !=null) {
         
//                console.log(data.data);
          

//        } 

//    }
//})