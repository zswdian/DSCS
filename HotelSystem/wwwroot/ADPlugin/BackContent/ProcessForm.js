$(function () {
    var formLen = 0;
    /*加载表单数据*/
    var loadFormData = function () {
        /*获取az 表单并设置值*/
        var ADForm = $(".az_form");
        formLen = ADForm.length;
        ADForm.each(function () {
            var _form = $(this);//当前表单
            var _pm = $(".ProcessMiddleware", this);//中间件数据
            var _val = _pm.val();//中间件值
            var _ziduan = _pm.data("ctr");//字段控制
            var index = _val.indexOf("DataId:''");
            //字段处理
            if (_ziduan) { 
                $.each(_ziduan, function (i, val) {
                    filedsHandle(val, _form);
                })
            }
            
            if (index <= -1) {
                /*数据获取请求*/
                $.post("/FlowForm/FlowManager/GetData", { id: _pm.val() }, function (result) {
                    if (result.IsSuccess) {
                        dataHandle(result, _form);
                    }
                });

            }
          
        })
    }
    /*数据处理*/
    var dataHandle = function (result, _form) {
        var data = $.parseJSON(result.Objects);
        if (data.length > 0) {
            var item = data[0];
            for (var key in item) {
                //读取元素
                $("[name='" + key + "']", _form).each(function () {
                    var _self = $(this);
                    var _selfVal = _self.val();
                    var _type = _self.attr("type");
                    switch (_type) {
                        case "checkbox":
                        case "radio":
                            if (_selfVal == item[key]) {
                                _self.prop("checked", true);
                            }
                            else {
                                _self.remove("checked");
                            }

                            break;
                        default:
                            _self.val(item[key]);
                            break;
                    }
                })
            }
            AD.lay.updateForm();
        }
    }
    /*字段处理*/
    var filedsHandle = function (ziduan, _form) {
        //[{"Name":"MC","IsMust":false,"IsSecrecy":true,"IsWrite":false,"IsVisible":false}]

        //读取元素
        var selectElement = $("[name='" + ziduan.Name + "']", _form);
        //是否必填
        if (ziduan.IsMust) {
            selectElement.attr("required", "required");
        }
        //是否保密
        if (ziduan.IsSecrecy) {

        }
        //是否可写
        if (!ziduan.IsWrite) {
            selectElement.attr("readonly", "readonly");
            selectElement.attr("disabled", "disabled");
        }
        //是否可见
        if (!ziduan.IsVisible) {
            selectElement.parent().parent().remove();
        }
        AD.lay.updateForm();
    }
    loadFormData();
})

