$(document).ready(function () {
   
    $('.za-form').each(function () {
        $(this).bind('submit', function () {
            ajaxSubmit(this, function (data) {
                dataHandle(data);
                console.log(data);

            })
            return false
        })
    });
    var nums = 0;
    //点击返回上一级
    $('.backPage').click(function () {
        if (nums > 0) {
            window.location.href = "/ProjectMobile/Index";
            return;
        }
        window.history.back(-1);
        nums++;
    });
    var urlstr = location.href;
    var urlstatus = false;
    $("#menu a").each(function () {
        if ($(this).attr('href') != '' && (urlstr + '/').indexOf($(this).attr('href')) > -1) {
            $(this).addClass('active');
            urlstatus = true;
    

        } else {
            $(this).removeClass("active")

        }

    })
    if (!urlstatus) {
        $("#menu a").eq(0).addClass('active');

    }
    //退出，跳转链接重写
    $(".az_href").click(function () {
        window.location.href = $(this).data("href");
    });
})
 
//空判断
function isNull(temp) {
    if (temp === null || typeof (temp) === "undefined" || temp === "" || temp === "null")
        return true;
    else
        return false;
}
var outTimeNum = 1000;//超时时间
var dataHandle = function (_result, _form) {
    runComplete(_result);
    if (!isNull(_result.msg)) {
        var iconType = _result.success ? 1 : 0;
        layer.open({
            content: _result.msg
            , skin: 'msg'
            , time: 2
        })
    }

    if (_result.time > 0) {
        setTimeout(function () { dataCode(); }, _result.time);
    }
    else
        dataCode();

    function dataCode() {
        switch (_result.code) {
            case "6001":
                //刷新页面
                window.location.reload();
                break;
            case "6002"://关闭Iframe
                layer.close(_openIndex);
                break;
            case "6003"://关闭父Iframe
                parent.layer.close(_openIndex);
                break;
            case "6100":// 整窗口跳转
                window.top.location.href = _result.url;
                break;
            case "6102":// 刷新父页面
                parent.location.reload();
                break;
            case "6103":// 打开对话框 
                layer_show_set(_result.data);
                break;
            case "6104":// 页面跳转
                window.location.href = _result.url;
                break;
            case "6105":// 页面二级父页面 
                window.parent.parent.location.reload();
                break;

            default:
                if (!isNull(_result.url)) {
                    window.location.href = _result.url;
                }
                break;

        }
    }
}
var runComplete = function (_result) {

}
function ajaxSubmit(frm, fn) {
    var dataPara = getFormJson(frm);
    $.ajax({
        url: frm.action,
        type: frm.method,
        data: dataPara,
        traditional: true,
        dataType: 'json',
        success: fn,
        error: function () {
            layer.open({
                content: '请求失败,请检查网络设置'
                , skin: 'msg'
                , time: 2
            })
        }

    })
    return false;
}
function getFormJson(frm) {
    var o = {};
    var a = $(frm).serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else { o[this.name] = this.value || ''; }
    });
    return o;
}