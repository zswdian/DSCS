$(function () {
    //监听状态操作
    layui.use('table', function () {
        var form = layui.form;
        form.on('select(Validate1)', function (data) {
            console.log(data.value);
            if (data.value != -1) {
                var _msg = data.value.split('%');
                $('#Validate').val("RegularString." + _msg[0]);
                $('#ValidateMsg').val(_msg[1]);
                $('#Validate').attr("readOnly", "true");
            }
            else {
                $('#Validate').val("");
                $('#ValidateMsg').val("");
                $('#Validate').removeAttr("readOnly");
            }
        });
    });
});
//注册回调事件
var secondTag = $("#SecondTag"); var tagInput = $("#Tags");
AD.fn.regEvent(AD.event.foreign, function (obj) {
    tagInput.val(obj.data.Remark); secondTag.val("/" + obj.data.EntityName + "s/Show");
})
AD.lay.loaded = function () {
    //下拉控件处理
    var ctrArray = $("#points_id,#foreign_id,#tags_id,#second_id"), showChar = $("#show_char"), pointsInput = $("#Points");
    var charLen = $("#CharLength"); ctrArray.hide();
    var showSecond = $("#show_second");
    AD.lay.form.on('select(ControlTypes)', function (data) { selectChange(data) });

    function selectChange(data) { 
        ctrArray.hide(); showChar.show(); secondTag.hide(); showSecond.hide();
        // secondTag.val( "");  tagInput.val("");//数据置空
        var showArry = new Array();
        var charNum = 100, points = 0;
        console.log(1111);
        switch (data.value) {
            case "26": showArry.push(0); charNum = 18, points = 4 //显示小数
                break;
            case "25": charLen.val(11); charNum = 11; //显示整数 
                break;
            case "6": case "7": case "8": case "13"://枚举值 
                if (data.value == "7")
                    charNum = 255;
                else charNum = 11;
                showArry.push(2, 3); showSecond.show();
                break;
            case "15": showArry.push(1, 2, 3); charNum = 36; showChar.hide();//显示外键
                secondTag.show();
                break;
            case "3": case "4": case "10": case "11"://枚举值 
                charNum = 255;
                break;
            case "12":
                charNum = 36; showArry.push(2);
                break;
        }
        for (var i = 0; i < showArry.length; i++) {
            var item = showArry[i];
            $(ctrArray[item]).show();
        }
        charLen.val(charNum); pointsInput.val(points);
    }

    AD.lay.form.on('select(SecondSelect)', function (data) {
        var _self = $(data.elem).find("option:selected");
        var _name = _self.data("name"); tagInput.val(data.value); secondTag.val(_name);
    });
    AD.lay.form.on('select(systemTag)', function (data) {
        var _val = data.value;
        $("#Remark").val(_val); 
    });
}