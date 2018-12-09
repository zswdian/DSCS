$(function(){
    var linkUrl = $("#LinkUrl"), areas = $("#Areas"), controllers = $("#Controllers"), actions = $("#Actions");
    //异步请求回调刷新
    AD.cm.ajaxFormCallback = function (data) {
        window.parent.RefreshTree(data.Objects);
    }
    linkUrl.keyup(function () {
        var _val = linkUrl.val();
        if (_val.indexOf("http") < 0 && _val.indexOf("/") > -1) {
            var result = linkUrl.val().split("/");
            if (isNull(result[0])) {
                result.splice(0, 1);
            }
            if (result.length == 2) {
                areas.val(null);
                controllers.val(result[0]);
                actions.val(result[1]);

            }
            else if (result.length == 3) {
                areas.val(result[0]);
                controllers.val(result[1]);
                actions.val(result[2]);

            }
        }
        else {
            areas.val(null);
            controllers.val(null);
            actions.val(null);
        }
    });
})
    