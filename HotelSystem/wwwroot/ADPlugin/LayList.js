layui.use(['table', 'laydate'], function () {
    var table = layui.table;
    //日期生成
    var laydate = layui.laydate;
    AD.lay.table = table;
    AD.lay.date = laydate;

    table.on('checkbox(az-table)', function (obj) {

    });
    //工具事件 data-zd="uid"
    table.on('tool(az-table)', function (obj) {
        var data = obj.data;
        var $obj = $(this);
        var selectId = data.Id;
        if (obj.event === 'del') {
            var url = $obj.data("href");
            if (isNull(url)) {
                url = "Delete";
            }
            AD.bk.del(obj, url, selectId);
        }
            // kit-target data-options="{url:'/FormTables/index?*id',id:'1',title:'表单生成'}" data-title="表单生成"
        else if (obj.event === 'nav') {//打开新导航
            var str = $obj.attr("data-options").replace("*id", "id=" + selectId);
            $obj.attr("data-options", str);
            OpenKitTab(this);
        }
        else if (obj.event === 'select') { //回调外键数据
            ForeignSelect(selectId, data[$obj.data("name")]);
        }
        else {
            var option = $(this).data("param");
            option.id = selectId;
            //弹出页面逻辑
            if ('detail,edit,show'.indexOf(obj.event) > -1) {
                AD.bk.show(option);
            }//访问导航选项卡

            else if (obj.event === 'visit') {
                AD.bk.visit(null, option.url, option.id, option.title);
            }
        }
    });

    laydate.render({
        elem: '.layer_date'
    });
    //批量删除
    $(".az_dels").click(function () {
        var checkStatus = table.checkStatus('az-table');
        var delArray = new Array();

        for (var i = 0; i < checkStatus.data.length; i++) {
            delArray.push(checkStatus.data[i].Id);
        }
        var url = $(this).data("href");
        if (isNull(url)) {
            url = "DeleteArry";
        }
        var title = $(this).data("title");
        AD.bk.dels(url, delArray, title);
    })
})