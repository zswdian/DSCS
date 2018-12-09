/// <reference path="../js/_references.js" />

/** AD: BEGIN LICENSE TEXT
 *
 * @author dwj
 *
 *  AD: END LICENSE TEXT */
/*!
 * AD JavaScript Library v1.0.0
 * http://null.com/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2017, 2045 AD Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://null/license
 *
 * Date: 2017-01-18T17:13:23+0800
 */
//AD编辑器核心插件
var adExtend = (function (window, AD) {
     
    var outTimeNum = 1000;//超时时间 
    AD.lay = {
        table: new Object(),
        date: new Object(),
        edit: new Object(),
        layer: new Object(),
        form: new Object(),
        element: new Object(),
        updateForm: function () { },
        /**重置表格参数  ID,及参数{where: { id:'xxx'}}*/
        reload: function (id, option) {
            //AD.lay.reload('',{where: { id:'xxx'}});
            if (AD.lay.table) {
                AD.lay.table.reload(id, option);
            }
            else {
                console.log("未加载表格！");
            }
           
        },
        //加载完毕回调
        loaded: function () { },
        /**刷新表格 */
        refresh: function (result) {
            var id = "az-table";
            if (result && result.data) {
                id = result.data;
            }
            AD.lay.reload(id, { where: { select: true } });
        },
    }
    //常用插件
    AD.params = {
        //RSA加密
        rsaEncrypt: {
            rsa: null,
            getEncrypt: function (str) {
                return AD.params.rsaEncrypt.rsa.encrypt(str);
            }
        },
        //加密时间戳
        timeToRSA: function () {
            var times = AD.params.timeToStamp() + AD.cm.serverTime.timeDiff;
            return "{" + times + "}";
        },
        //获取时间戳
        timeToStamp: function () {
            return new Date() - new Date("1970/1/1 8:0:0");
        },

    }
    AD.cm = {
        /**
        * 百度编辑器
        */
        setUeditor: function (selector, option) {
            if (isNull(selector)) selector = ".az_ueditor";
            var _main = $(selector);
            if (_main.length > 0) {
                setTimeout(function () {
                    AD.fn.loadScript("ueditor").done(function () {
                        _main.each(function () {
                            var _self = $(this);
                            if (isNull(_self.attr("name"))) {
                                _self.attr("name", _self.attr("id"));
                            }
                            if (!isNull(_self.attr("value"))) {
                                _self.html(AD.fn.htmlDecode(_self.attr("value")));
                            }
                            var _ueditor = UE.getEditor(_self.attr("id"), {
                                fullscreen: false,
                                initialFrameWidth: '100%',
                                initialFrameHeight: 225,
                                allowDivTransToP: false,
                                autoHeightEnabled: false,
                                saveInterval: 5000,
                                serverUrl: AD.fn.systemUrl.ueditorAction,
                                enterTag: ''
                            });
                        })
                    });
                }, 500)
            }
        },
        /**自定义函数 */
        customCall: function (that, data) {
            console.log("未给自定义函数!");
        },
        /**判断地址是否有效或无效 */
        urlValid: function (url, call) {
            $.ajax({
                url: url,
                type: 'GET',
                complete: function (response) {
                    if (response.status == 404 || response.statusText == "error") {
                        call(false);
                    } else {
                        call(true);
                    }
                }
            });
        },
        //初始化RSA加密 az_encrypt
        initRsa: function () {
            var azEncrypt = $(".az_encrypt");
            if (azEncrypt.length > 0) {
                AD.cm.serverTime.validate();
                $.post(AD.fn.systemUrl.GetRsa, function (data) {
                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey(data);
                    AD.params.rsaEncrypt.rsa = encrypt;
                })

                azEncrypt.each(function (i, e) {
                    var _self = $(e); var _clone = _self.clone(); _self.attr("data-num", i);
                    _self.removeAttr("id").removeClass("az_encrypt");
                    _clone.hide(); _self.before(_clone);
                })
            }
        },
        //服务器时间校验
        serverTime: {
            timeDiff: 0,//时间差
            validate: function () {
                var times = AD.params.timeToStamp();
                $.get(AD.fn.systemUrl.timeCheck + "?time=" + times, function (data) {
                    AD.cm.serverTime.timeDiff = data;
                });
            }
        },
        //列表页 下拉框改变事件 级联变动TAG 值
        SVChange: function () {
            var _sv = $("#SelectValue");
            if (_sv.length > 0) {
                var nameSV = $("input[name=sv]");
                var openSelect = false;
                var changeTag;
                var svChangeFunc = function (first) {
                    var _option = $("option:selected", _sv);
                    var _tag = _option.data("tag");
                    if (!isNull(_tag)) {
                        openSelect = true;
                        changeTag = $("#" + _tag); changeTag.show(); nameSV.hide();
                        changeTag.change(function () {
                            nameSV.val($(this).val());
                        })
                        if (first)

                            changeTag.val(nameSV.val());
                    }
                    else if (openSelect) {
                        nameSV.val("").show(); changeTag.hide(); openSelect = false;
                    }
                }
                _sv.change(function () { svChangeFunc(false) });
                svChangeFunc(true);
            }

        },
        /**
      *  编辑器展示
      */
        showUeditor: function (selector, option) {
            if (isNull(selector)) selector = ".az_uedtior_parse";
            var _main = $(selector);
            if (_main.length > 0) {
                AD.fn.loadScript("ueditor_show").done(function () {
                    uParse(selector);
                });
            }
        },
        errorTips: function (_obj, _errVal) {
            layer.tips(_errVal, _obj, {
                tips: [3, '#f00'],
                tipsMore: true,
                time:2000
            });
        },
        //文件显示  参数 id,  及显示标识 show
        fileShow: function () {
            var _main = $(".file_show");
            _main.each(function () {
                var _self = $(this);
                var dataId = _self.data("id"), showTag = _self.data("show");
                AD.cm.setFileShow(dataId, showTag, _self, function (img, _result) {
                    //if (_result.data.action == 0) {
                    //    img.attr("src", "/Images/SystemImg/extensions/FileDown.png");
                    //}
                    _self.append(img);
                });
            })
        },
        //设置文件显示
        setFileShow: function (id, showTag, panelObj, callback) {
            if (isNull(id)) {
                return;
            }
            else if (id.indexOf("/") > -1) {
                var showImg = $('<img src="" class="show_img"/>');
                showImg.attr("src", id);
                callback(showImg, null)
                return;
            }
            $.get(AD.fn.systemUrl.showFile + "/" + id, function (_result) {
                if (_result.success) {

                    var data = _result.data, dataOne = data.files[0];
                    if (showTag) {
                        var pathArray = dataOne.path.split(".");
                        dataOne.path = pathArray[0] + "_" + showTag + "." + pathArray[1];
                    }
                    var showImg = $('<img src="" class="show_img"/>');
                    showImg.data("id", dataOne.id);
                    var showUrl = dataOne.path;

                    switch (data.action) {
                        case 0:
                            if (dataOne.path) {
                                showUrl = dataOne.path;
                            }
                            else
                                showUrl = extendFormatList.getExtendImg(dataOne.format);
                            showImg.addClass("file_down");
                            AD.cm.fileDown(showImg);
                            //if (panelObj) {
                            //    var tagTip = $("<span class='file_tip'>" + dataOne.name + "</span>");
                            //    panelObj.append(tagTip);
                            //}
                            break;
                        case 1:
                            if (dataOne.path) {
                                showUrl = dataOne.path;
                            }
                            else
                                showUrl = extendFormatList.getExtendImg(dataOne.format);
                            showImg.addClass("file_down");
                            AD.cm.fileDown(showImg);
                            //if (panelObj) {
                            //    var tagTip = $("<span class='file_tip'>" + dataOne.name + "</span>");
                            //    panelObj.append(tagTip);
                            //}
                            break;

                        case 2:
                            showImg.src = dataOne.path;
                            showImg.click(function () {
                                window.top.layer.open({
                                    type: 1, title: false, area: '500px', closeBtn: 0,
                                    shadeClose: true, skin: 'yourclass',
                                    content: '<img style="width:100%" src="' + showImg.src + '">'
                                });
                            })
                            break;
                        case 4:
                            showImg.src = dataOne.path;
                            var jsonPhotos = getFileJson(data);
                            showImg.click(function () {
                                layer.photos({
                                    photos: jsonPhotos,
                                    anim: 5
                                });
                            })
                            break;
                    }
                    showImg.attr("title", dataOne.name);
                    showImg.attr("src", showUrl);
                    callback(showImg, _result)
                }
            })
            function getFileJson(_json) {
                var arryFile = new Array();
                var _files = _json.files;
                for (var i = 0; i < _files.length; i++) {
                    var newJson = {
                        "alt": _files[i].name,
                        "pid": i, //图片id
                        "src": _files[i].path, //原图地址
                        "thumb": _files[i].path //缩略图地址 
                    };
                    arryFile.push(newJson);
                }
                var fileJson = {
                    "title": "图片展示", //相册标题
                    "id": 0, //相册id
                    "start": 0, //初始显示的图片序号，默认0
                    "data": arryFile
                };
                return fileJson;
            }
        },
        ///文件下载
        fileDown: function (obj) {
            var _main = null;
            if (obj)
                _main = obj;
            else
                _main = $(".file_down");
            _main.click(function () {
                var _self = $(this);
                var dataId = _self.data("id");
                window.open(AD.fn.systemUrl.downFile + "/" + dataId);
            });
        },
        /**
         * 文件 上传
         * 上传参数及各式: data-param='{"id":"","guid":"", "action":2}'
         * src 默认图片, file_name文件名,auto 自动上传 save_type保存类型
         */
        uploaderFiles: function (selector, option) {
            if (isNull(selector)) selector = ".az_upload";

            var _main = $(selector);
            if (_main.length > 0) {
                AD.fn.loadScript("webUploader").done(function () {
                    AD.uploader(selector);
                });
            }
        },
        //数据处理
        dataHandle: function (_result, _form) {
            if (!isNull(_result.msg)) {
                var iconType = _result.success ? 1 : 0;
                layer.msg(_result.msg, { icon: iconType, time: outTimeNum });
            }

            if (_result.time > 0) {
                setTimeout(function () { dataCode(); }, _result.time);
            }
            else
                dataCode();

            function dataCode() {
                if (_result.success && _form) {
                    var jqForm = $(_form); 
                    jqForm.find(".az_upload").each(function () {
                        var _self = $(this);
                        var _inputName = _self.data("param").name;
                        var _inputVal = $("input[name=" + _inputName + "]", jqForm).data("new_value");
                        if (!isNull(_inputVal)) {
                            $.post(AD.fn.systemUrl.fileState + "/" + _inputVal, function (msg) {

                            });
                        }
                    })
                }
                switch (_result.code) {
                    case "6001":
                        //刷新页面
                        window.location.reload();
                        break;
                    case "6002"://关闭Iframe
                        layer.close(_openIndex);
                        break;
                    case "6003"://关闭父Iframe
                        var _parent = window.parent == null ? window : window.parent;
                        _parent.layer.close(_parent._openIndex);
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
                    case "6500":// 调用自定义接口

                        break;
                    case "7000": //刷新表格 
                        var wd = window;
                        if (!AD.lay.table.reload) {
                            wd = window.parent;
                        }
                        wd.AD.lay.refresh(_result);
                        wd.layer.closeAll();
                        break;
                    case "7010"://自定义函数
                        AD.cm.customCall(_form, _result);
                        break;
                    default:
                        if (!isNull(_result.url)) {
                            window.location.href = _result.url;
                        }
                        break;

                }
            }
        },
        ajaxFormOption: {
            beforeSerialize: function () {
                //数据加密处理 
                $(".az_encrypt").each(function (i, v) {
                    var _self = $(v); var sib = _self.siblings("[data-num='" + i + "']");
                    sib.attr("disabled", "disabled");
                    setTimeout(function () { sib.removeAttr("disabled") }, outTimeNum);
                    var _val = AD.params.rsaEncrypt.getEncrypt(sib.val() + AD.params.timeToRSA());
                    _self.val(_val);
                })

            },
            beforeSubmit: function (formData, jqForm, options) {
                this.subForm = jqForm;
                var index = layer.load(0, {
                    shade: [0.1, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function (_result) {
                var jqForm = $(this.subForm);
                layer.closeAll('loading');
                AD.cm.ajaxFormCallback(_result);
                var data = _result.data;
                if (_result.success) {
                    AD.cm.dataHandle(_result, jqForm);
                }
                else {
                    if (!isNull(_result.data)) {
                        jqForm.find(".az_error").remove();
                        for (var i = 0; i < data.length; i++) { 
                            var el = $("[name=" + data[i].Key + "]", this.subForm);
                            var keyId = data[i].Key + "_" + i;
                            el.addClass("layui-form-danger");
                            var sib = el.siblings(".az_tip_error");
                            if (sib.length > 0) {
                                sib.html(data[i].Value); 
                            }
                            else {
                                //var errorSpan = $('<span class="az_tip_error" data-for="' + data[i].Key + '">' + data[i].Value + '</span>');
                                var errorIcon = $('<span class="layui-icon az_error"  data-value="' + data[i].Value + '">&#xe60b;</span>');
                                if (el.siblings(".layui-btn").length > 0) {
                                    errorIcon.addClass("az_error_more");
                                }
                                el.parent().append(errorIcon); AD.cm.errorTips(el, data[i].Value);
                                errorIcon.click(function () {
                                    AD.cm.errorTips(this, $(this).data("value"));
                                })
                            }
                        }
                    }
                    if (_result.msg)
                        layer.msg(_result.msg, { icon: 0, time: outTimeNum });
                    else
                        layer.msg("访问失败！", { icon: 0, time: outTimeNum });
                }

            },
        },
        //异步表单成功回调函数
        ajaxFormCallback: function (_result) {
            //AD.cm.ajaxFormCallback = function () { } 
            return true;
        },
        //表单提交验证
        formSubmit: function () {

        },
        //图片上传浏览 选择器 upload_img,  属性：
        previewImg: function (selector) {
            AD.cm.azForeach(selector, ".upload_img", function (obj) {
                var _self = $(obj);
                var _name = _self.data("name");
                var _addFile = $('<input class="hidden" id="' + _name + '" type="file" name="' + _name + '" accept="image/jpg,image/png,image/jpeg" />');
                _self.after(_addFile);
                _addFile.change(function () {
                    var file = this;
                    if (file.files && file.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (evt) {
                            _self.attr('src', evt.target.result);
                        }
                        reader.readAsDataURL(file.files[0]);
                    } else {
                        _self.attr('src', file.value);
                    }
                })

            })
        },
        /**
         * 异步提交
         */
        ajaxForms: function (selector, option) {
            AD.cm.azForeach(selector, ".az_form", function (obj) {
                var _self = $(obj);
                _self.submit(function (event) {

                    var _btn = $("[type='submit']", _self);
                    _btn.attr("disabled", "true");
                    setTimeout(function () {
                        _btn.removeAttr("disabled");
                    }, outTimeNum); //设置2秒后提交按钮 显示  

                    AD.cm.formSubmit();
                    _self.ajaxSubmit(AD.cm.ajaxFormOption);

                    return false; // 阻止表单自动提交事件 
                })
            })
        },
        azForeach: function (selector, startName, callback) {
            if (isNull(selector)) selector = startName;
            var _main = $(selector);
            if (_main.length > 0) {
                _main.each(function () {
                    callback(this);
                });
            }
        },

        /**
         * 查询表单
         */
        searchForm: function (selector, option) {
            AD.cm.azForeach(selector + " [name]", ".search_form" + " [name]", function (obj) {
                var _self = $(obj);
                _self.val(AD.fn.getUrlParam(_self.attr("name")));
            })
        },
        //复制剪贴板(回调参数) .az_clip
        copyClip: function (selector, callback) {
            $(selector).each(function () {
                var clip = new ZeroClipboard(this);
                $(this).mouseenter(function () {
                    var _val = callback("down");
                    clip.setText(_val);
                }).click(function () {
                    var _val = callback("click");
                    clip.setText(_val);
                })
            })
            // clip.setHtml("<strong>CodePlayer</strong>");
            // clip.setRichText("{\\rtf1\\ansi\n{\\b CodePlayer}}"); 
        },
        /**
         * 图片框 az_light
         */
        lightbox: function (selector, option) {
            AD.cm.azForeach(selector, ".az_light", function (obj) {
                var _self = $(obj);
                AD.fn.loadScript("lightbox").done(function () {
                    _self.append("<img src='" + _self.attr("href") + "' />");
                })
            })
        },
        /**
         * 树菜单 az_tree
         */
        zTree: function (selector, callback) {
            if (isNull(selector)) selector = ".az_tree";
            var _main = $(selector);
            if (_main.length > 0) {
                AD.fn.loadScript("ztree").done(function () {

                });
            }
        },

        /**
         * az模板
         */
        azTemp: function (selector, option) {
            if (isNull(selector)) selector = ".az_upload";
            var _main = $(selector);
            if (_main.length > 0) {
                AD.fn.loadScript("webUploader").done(function () {

                });
            }
        },
    };
    //系统接口
    AD.api = {
        isFullScreen: false,
        //进入全屏
        fullScreen: function (element) {
            if (this.isFullScreen) {
                this.exitFullscreen(element);
            }
            else {
                elem = document.querySelector(element) || document.body;
                if (elem.webkitRequestFullScreen) {
                    elem.webkitRequestFullScreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.requestFullScreen) {
                    elem.requestFullscreen();
                } else {
                    //浏览器不支持全屏API或已被禁用  
                }
            }
            this.isFullScreen = !this.isFullScreen;
        },
        //退出全屏
        exitFullscreen: function (element) {
            var de = document.querySelector(element) || document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        //框架父元素
        iframeParent: function () {
            return window.parent;
        },
        //框架子元素
        iframeChilde: function () {
            return $(window.parent.document).contents().find("#iframename")[0].contentWindow;
        },
        maxHeight: function () {
            var _self = $(".az_height");
            var self_h = _self.data("height");
            var body_height = $(window).height();
            body_height -= isNull(self_h) ? 0 : self_h;
            _self.height(body_height);
        }
    };
    //后台插件
    AD.bk = {
        //当前时间
        dateNow: function () {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
            return currentdate;
        },
        show: function (option) {
            var settings = $.extend({
                "title": "信息",
                "url": null,
                "id": null,
                "w": 800,
                "h": 450,
                "qp": false,//全屏
                "open": false,//打开新页面
                "btn": false,
                "isParent": false,
            }, option);
            if (settings.url === null)
                return;
            else if (!isNull(settings.id)) {
                settings.url += "/" + settings.id;
            }
            if (settings.open) {
                window.open(settings.url);
            }
            else {
                var showWindow = window;
                if (settings.isParent) {
                    showWindow = window.parent
                }
                showWindow.layer_show(settings.title, settings.url, settings.w, settings.h, settings.btn, null, settings.qp);
            }


        },
        token: ""
        ,
        isSubmit: false,
        //POST请求
        post: function (_data, _url, callback, _error) {
            if (this.isSubmit) {
                return;
            }
            var index = layer.load(0, {
                shade: [0.1, '#fff'] //0.1透明度的白色背景
            });
            _data.__RequestVerificationToken = AD.bk.token;

            $.ajax({
                type: 'POST',
                data: _data,
                url: _url,
                async: false,
                dataType: 'json',
                success: function (data) {
                    AD.cm.ajaxFormCallback(data);
                    callback(data);
                    AD.bk.isSubmit = false;
                },
                error: function (data) {
                    layer.msg("访问失败", { icon: 1, time: outTimeNum });
                    AD.bk.isSubmit = false;
                },
                complete: function () {
                    setTimeout(function () {
                        layer.closeAll('loading');
                    }, outTimeNum);
                }
            });
        },
        //数据确认对话框 
        visit: function (obj, url, id, title, isPrompt) {
            if (isPrompt) {
                layer.prompt({ title: title, formType: 0 }, function (val, index) {
                    layer.close(index);
                    if (isNull(val)) {
                        layer.msg("不能输入空值!", { icon: 1, time: outTimeNum });
                    }
                    else {
                        AD.bk.post({ id: id, input: val }, url, function (_result) {
                            AD.cm.dataHandle(_result);
                        });
                    }
                });
            }
            else {
                layer.confirm(title, function (index) {
                    AD.bk.post({ id: id }, url, function (_result) {
                        AD.cm.dataHandle(_result);

                    });
                });
            }
        },
        sendPost: function (obj, url, data) {
            AD.bk.post(data, url, function (data) {
                AD.cm.dataHandle(_result);
            });
        },
        //数据确认对话框
        confirm: function (url, title) {
            layer.confirm(title, function (index) {
                AD.bk.post(url, function (_result) {
                    AD.cm.dataHandle(_result);
                });

            });
        },
        //删除数据
        del: function (obj, url, id, title, call, sys) {
            if (isNull(title)) {
                title = '确认要删除吗？';
            }
            layer.confirm(title, function (index) {
                AD.bk.post({ id: id }, url, function (_result) {
                    if (sys) {
                        AD.cm.dataHandle(_result);
                        return;
                    }
                    if (_result.success) {
                        obj.del();
                        if (call)
                            call(data);
                    }
                    layer.msg(data.Message, { icon: 1, time: outTimeNum });
                });
            });
        },
        //批量删除
        dels: function (url, chk_value, title, call) {
            if (chk_value.length === 0) {
                layer.msg('未选择任何数据!', { icon: 0, time: outTimeNum });
                return;
            }
            if (isNull(title)) {
                title = '您好！确认要批量删除吗？';
            }
            layer.confirm(title, function (index) {
                AD.bk.post({ id: chk_value }, url, function (_result) {
                    AD.cm.dataHandle(_result);
                });
            });
        },
        //前端权限控制,控制属性， data-auth="details" 或id   
        //拉取授权信息 <i id="auth_data" class= "hidden" data-str="@ADAuthButton.Instance.GetAuthButton(ViewContext.RouteData)"></i>
        authControl: function () {
            var authStr = $("#auth_data").data("str");
            if (!isNull(authStr)) {
                var _btnArray = authStr.split(',');
                for (var i = 0; i < _btnArray.length; i++) {
                    var _xzbtn = _btnArray[i];
                    if (!isNull(_xzbtn)) {
                        var _xzq = "#" + _xzbtn + ",[data-auth='" + _xzbtn + "']";
                        $(_xzq).remove();
                    }
                }
            }
        }
    };
    //事件注册
    AD.register = function () {
        //外键注册
        $(".ad_foreign").each(function () {
            var _self = $(this);
            _self.attr("readonly", "readonly").hide();
            var _copy_lab = $('<label class="layui-btn for_lab">选择</label>');
            var _copyInput = $("<input class='layui-input' readonly='readonly'>"); _copyInput.val(_self.data("main"));
            _self.after(_copy_lab).before(_copyInput);
            _copy_lab.click(function () {
                var _href = _self.data("href");
                // var index = layer_full("关联选择", _href); 
                var showContainer = window.parent ? window.parent : window;
                var index = showContainer.layer_show("关联选择", _href, null, null, null, null, null, function (index, _window) {
                    _window.ForeignSelect = function (_id, _name, _data) {
                        _self.val(_id); _copyInput.val(_name);
                        AD.fn.allCallback(AD.event.foreign, { id: _id, name: _name, data: _data, self: _self });//回调注册事件
                        _window.parent.close_iframe(index);
                    }
                });
            })
        })
        $(".foreign_lab").click(function () {
            var _sib = $(this).siblings(".down_tree");
            var _ipt = $(this).siblings("input");
            _sib.children("*").unbind().click(function () { _ipt.val($(this).text()); _sib.hide(); })
            if (_sib.length > 0) {
                if (_sib.is(":visible")) {
                    _sib.hide();
                }
                else
                    _sib.show();
            }
        })
        //分类操作
        var classifyList = $(".az_classify");
        if (classifyList.length > 0) {
            AD.fn.loadScript("classify").done(function () {
                classifyList.each(function () {
                    loadSelectTree(this);
                })
            });
        }
        //刷新指定iframe
        $(".az_update_iframe").click(function () {
            var tag = $("#" + $(this).data("action"));
            tag.attr("src", tag.attr("src"))
        })
        //设置文档高度，并且 可减去相应高度 class="az_height" data-height="70"
        $(".az_height").each(function () {
            var _self = $(this);
            var _wipeHeight = _self.data("height");//去除高度
            var _docHeight = $(document).height();  //文档高度
            if (_wipeHeight) _wipeHeight = 0;
            _self.height(_docHeight - _wipeHeight);
        })
        //读取cookie 需要 name
        $(".az_cookie").each(function () {
            var _self = $(this), _name = _self.attr("name");
            _self.val($.cookie(_name));//区域名
            _self.change(function () {
                $.cookie(_name, _self.val(), { expires: 7 });
            })
        })
        //清空密码自动记录
        $(".az_clear_pwd").focus(function () {
            if ($(this).attr("type") != "password") {
                $(this).attr("type", "password");
            }
        });
        //安全事件驱动
        AD.bk.token = $('input[name="__RequestVerificationToken"]', "#token_cmd").val();
        AD.cm.ajaxForms();
        AD.cm.previewImg();
        AD.cm.initRsa();
        //普通事件  
        $(".az_show").click(function () {
            AD.bk.show($(this).data("param"));
        })
        $(".az_vist").click(function () {
            var _params = $(this).data("param");
            AD.bk.visit(this, _params.url, _params.id, _params.title);
        })
        $(".az_details dd").each(function () {
            var self = $(this);
            self.html(self.attr("value"));
        })

        if ($(".az_form").length > 0) {
            UseForm();
        }

        if ($(".layui-table,.az_table").length > 0) {
            UseTable();
        }
    }
    //初始化函数
    AD.init = function (option) {
        AD.bk.authControl();
        AD.register();
        AD.cm.lightbox();

        AD.cm.showUeditor();

        AD.cm.setUeditor();
        AD.api.maxHeight();
        AD.cm.fileShow();
        AD.cm.uploaderFiles();
        $(".ad_slide").change(function () {
            var _self = $(this);
            _self.attr("data-value", _self.val());
        })
        AD.loadComplete();
        UserSlider();
    }
    AD.loadComplete = function () {
    }
})

$(function () {
    //预加载模块
    layui.use('layer', function () {
    });
    adExtend(window,AD);

    AD.init();
})
/*弹出层*/
function layer_close() {
    layer.close(layer.index)
    //var index = 0;
    //if (parent.layer) {
    //    index = parent.layer.getFrameIndex(window.name);
    //}
    //else
    //    index = window.layer.getFrameIndex(window.name);
    //parent.layer.close(index);
}
function layer_show_save(title, url, w, h, btnName) {
    layer_show(title, url, w, h, true, btnName);
}
function layer_show_set(option) {
    layer_show(option.title, option.url, option.w, option.h, false);
}

var _openIndex;
/*弹出层*/
/*
	参数解释：
	title	标题
	url		请求的url
	id		需要操作的数据id
	w		弹出层宽度（缺省调默认值）
	h		弹出层高度（缺省调默认值）
    isSave 是否保存按钮
    btnName 按钮名称
    callback   返回：contentWindow
*/
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

/*关闭弹出框口*/
function layer_closes() {
    var player;
    if (parent.layer) {
        player = parent;
    }
    else if (parent.parent.layer) {
        player = parent.parent;
    }
    player.layer.close(player._openIndex);
}
/*图片/文件显示*/
function layer_full(title, url, id) {
    url = url + "?id=" + id;
    var index = layer.open({
        type: 2,
        title: title,
        content: url,
    });
    layer.full(index);
    return index;
}

//打开选项卡   kit-target data-options="{url:'/home/index',id:'10001',title:'表单生成'}" data-title="表单生成"  
function OpenKitTab(obj) {
    var _parent = window.parent;

    for (var i = 0; i < 4; i++) {
        if (isNull(_parent.OpenNavTab)) {
            _parent = _parent.parent;
        }
        else {
            _parent.OpenNavTab(obj);
            return;
        }
    }
}