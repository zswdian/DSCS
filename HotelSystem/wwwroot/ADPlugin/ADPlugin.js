
/** ADPlugin: BEGIN LICENSE TEXT
 *
 * @author dwj
 *
 *  ADPlugin: END LICENSE TEXT */
/*!
 * ADPlugin JavaScript Library v1.0.0
 * http://null.com/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2017, 2045 ADPlugin Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://null/license
 *
 * Date: 2017-01-18T17:13:23+0800
 */
var AD = (function (window, undefined) {
    var version = "1.0.0";
    // document.domain = "localhost";
    var AD = function (option) {
        return new Object();
    }
    /**
     * 伪JSON 解析
     * @param {any} data
     */
    AD.json = function (data) {
        if (data) {
            var newData = new Function('return' + data);
            return newData();
        }
        return undefined;
    };
    var _htmlBody = $("body");
    /**字典类 */
    AD.dictionary = function () {
        var self = function () { };
        self.keys = new Array();
        self.values = new Array();
        self.size = 0;
        //设置值
        self.set = function (key, value) {
            if (self.index(key) > -1) {
                self.values[self.index(key)] = value;
            }
            else {
                self.add(key, value);
            }
        };
        //添加值
        self.add = function (key, value) {
            self.keys.push(key);
            self.values.push(value);
            self.size++;
        }
        //获取键对应的值
        self.get = function (key) {
            return self.values[self.index(key)];
        };
        //获取键索引
        self.index = function (key) {
            return self.keys.indexOf(key);
        }
        //移除键值
        self.removeKey = function (key) {
            this.keys.remove(key);
            self.size--;
        };
        //移除键值
        self.remove = function (key, _id) {
            for (var i = 0; i < this.keys[key].length; i++) {
                if (this.keys[key][i].key === _id) {
                    this.keys[key].remove(_id);
                    self.size--;
                }
            }
        };
        //判断键值元素是否为空
        self.isEmpty = function () {
            return this.keys.length === 0;
        };

        return self;
    }
    //推送会话框  
    AD.mapList = AD.dictionary();
    var enums = { ajaxForms: 0, web_push: 1, ajaxLoadForms: 2 };   //枚举集合 
    //键值对集合
    var _listenMap = new AD.dictionary();
    var loadScritpState = false;
    var apiClass = function (_name, _path, _files, _way) {
        this.name = _name;
        this.path = _path,
            this.files = _files,
            this.way = isNull(_way) ? false : true;
        this.loadState = false;
    };
    /**
     *  @description(扩展插件) 
     */
    AD.event = AD.prototype = {
        foreign: 0,
    }
    AD.fn = AD.prototype = {
        //第三方插件
        thirdAPI: [
            new apiClass("webUploader", "/ADPlugin/third/webuploader/0.1.5/", ["webuploader.css", "webuploader.js", "UploaderExtend.js"]),
            new apiClass("ueditor", "/ADPlugin/third/ueditor/1.4.3/", ["ueditor.config.js", "ueditor.all.min.js"]),
            new apiClass("ueditor_show", "/ADPlugin/third/ueditor/1.4.3/", ["ueditor.parse.min.js"]),
            new apiClass("ztree", "/ADPlugin/third/zTree/v3/", ["css/zTreeStyle/zTreeStyle.css", "js/jquery.ztree.core-3.5.min.js", "js/jquery.ztree.exedit-3.5.min.js"]),
            new apiClass("classify", "/ADPlugin/BackContent/", ["drop_down.js"]),
            new apiClass("lightbox", "/AssetPlugin/H-ui.admin/lib/lightbox2/2.8.1/", ["css/lightbox.css", "js/lightbox.min.js"]),
            new apiClass("zeroClipboard", "/AssetPlugin/PluginGather/Clipboard/", ["ZeroClipboard.js"]),
        ],
        htmlDecode: function (text) {

            return text.replace(/&/g, '&').replace(/"/g, '\"').replace(/</g, '<').replace(/>/g, '>');
        },
        getFileSize: function (size) {
            var _arry = size.split(' ');
            var num = parseFloat(_arry[0]);
            var str = _arry[1];
            var fileSizeArray = ["B", "K", "M", "G", "T"];
            for (var i = 0; i < fileSizeArray.length; i++) {
                if (str == fileSizeArray[i]) {
                    return num * Math.pow(1024, i);
                }
            }
            return 0;
        },
        //AD.fn.systemUrl.delFile
        systemUrl: {
            uploader_server: "/SystemApi/FileUploads/upload",
            getUid: "/SystemApi/ParamsApi/getuid",
            showFile: "/SystemApi/GetFile/ShowFile",
            downFile: "/SystemApi/GetFile/DownFile",
            delFile: "/SystemApi/FileUploads/DeleteFile",
            fileState: "/SystemApi/FileUploads/UpdateTemp",
            GetRsa: "/SystemApi/ParamsApi/GetRsa",
            timeCheck: "/SystemApi/ParamsApi/TimeCheck",
            ueditorAction: "/SystemAPI/UEditor/do",
        },
        //创建样式
        createStyle: function (url, id) {
            var style = document.createElement("link");
            style.type = "text/css";
            style.rel = 'stylesheet'
            style.href = getRoot(url);
            if (!isNull(id)) {
                style.id = id;
            }
            $("head").append(style);
        },
        //创建脚本
        createScript: function (url, id) {
            var script = document.createElement("script");
            script.type = "text/javacript";
            script.src = getRoot(url);

            if (!isNull(id)) {
                script.id = id;
            }
            document.body.appendChild(script);
        },
        //获取API
        getAPI: function (pluginName, len) {
            for (var i = 0; i < len; i++) {
                if (this.thirdAPI[i].name === pluginName) {
                    return this.thirdAPI[i];
                }
            }
            return new apiClass();
        },
        /**
         * 动态加载插件
         * @param {string} pluginName 
         * @returns done
         */
        loadScript: function (pluginName, len) {
            if (!len) { len = this.thirdAPI.length; }
            var _api = this.getAPI(pluginName, len);
            if (!isNull(_api.name)) {
                loadScritpState = true;
                return _loadFile(_api);
            }
            return {
                //回调函数
                done: function (callback) {
                }
            };
        },
        //获取文件扩展名
        getFileExt: function (str) {
            var reg = /\.[^\.]+$/;
            return reg.exec(str).join("");
        },
        //获取Url参数
        getUrlParam: function (name) {
            if (isNull(window.location.search))
                return null;
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (!isNull(r)) return decodeURI(r[2]); return null;
        },
        //所有事件回调
        allCallback: function (action, data) {
            var func = _listenMap.get(action);
            if (func) {
                func(data);
            }
        },
        /**获取参数 promise*/
        getParam: function (name) {
            var _def = new jQuery.Deferred();
            $.post("/SystemAPI/ParamsApi/GetParams?name=" + name, function (data) {
                _def.resolve(data);
            });
            return $.when(_def.promise()); 
        },
        //注册事件  AD.fn.regEvent("", function () { })
        regEvent: function (action, callback) {

            _listenMap.set(action, callback);
        }
    };
    //加载文件
    var _loadFile = function (plugin) {
        if (plugin.loadState) {
            return {
                done: function (callback) {
                    if (isFunc(callback)) {
                        setTimeout(callback, 200);
                    }
                }
            };
        }
        else {
            plugin.loadState = true;
        }
        var arryScript = Array();//脚本数量
        var _loadCounde = 0;
        var files = typeof plugin.files === "string" ? [plugin.files] : plugin.files;
        for (var i = 0; i < files.length; i++) {
            var itemFile = files[i];
            if (isNull(files[i])) {
                continue;
            }
            var isCSS = _getFileType(files[i]) === "css";
            if (isCSS) {
                AD.fn.createStyle(plugin.path + files[i]);
            }
            else {
                arryScript.push(files[i]);
            }
            _loadCounde++
        }

        if (arryScript.length > 0) {
            if (plugin.way) {
                for (var i = 0; i < arryScript.length; i++) {
                    AD.fn.createScript(plugin.path + arryScript[i]);
                }
            }
            else {
                AD.fn.createScript(plugin.path, "cach_script");
                return _getMutilScripts(arryScript, plugin);
            }
        }
        if (_loadCounde > 0) {
            return {
                done: function (callback) {
                    if (isFunc(callback)) {
                        setTimeout(callback, 200);
                    }
                }
            };
        }
    }
    //获取文件类型
    var _getFileType = function (fileName) {
        return fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length);
    }
    //获取多脚本处理
    var _getMutilScripts = function (arr, plugin) {
        $.ajaxSetup({ cache: true });
        var _arr = $.map(arr, function (src) {
            return $.getScript(getRoot((plugin.path || "") + src));
        });
        _arr.push($.Deferred(function (deferred) {
            $(deferred.resolve);
        }));
        return $.when.apply($, _arr);
    }
    var getRoot = function (_url) {
        return _url;
        //return window.location.protocol + "//" + window.location.host + _url;
    }
    return AD;
})(window)

//空判断
function isNull(temp) {
    if (temp === null || typeof (temp) === "undefined" || temp === "" || temp === "null")
        return true;
    else
        return false;
}
function isFunc(obj) {
    if (typeof callback === "function") {
        return true;
    }
    return false;
}
function isHide(obj) {
    return obj.css("display") === 'none';
}
//返回首页
function resetHome() {
}
//外键事件注册
function ForeignSelect(_id, _name) {
}

var extendFormatList = {
    extendSrc: "/Images/SystemImg/extensions/",
    fileClass: function (_src, _files) {
        this.files = _files;
        this.src = _src;
    },
    arrays: null,
    formatArray: function () {
        if (this.arrays == null) {
            var fClass = this.fileClass;
            var extendArry = new Array();
            extendArry.push(new fClass("word.png", ["doc", "docx", "dotx", "dot", "docm", "dotm", "xps", "mht", "mhtml", "txt", "xml", "rtf", "hip"]))
            extendArry.push(new fClass("pdf.png", ["pdf"]))
            extendArry.push(new fClass("wav.png", ["rm", "rmvb", "mpeg1", "mpeg2", "mpeg3", "mpeg4", "mov", "mtv", "dat", "wmv", "avi", "3gp", "amv", "dmv", "flv"]));
            extendArry.push(new fClass("ppt.png", ["ppt"]));
            extendArry.push(new fClass("ppt.png", ["ISO"]));
            extendArry.push(new fClass("ppt.png", ["tmp"]));
            extendArry.push(new fClass("html.png", ["htm"]));
            extendArry.push(new fClass("excel.png", ["xls", "xlsx"]));
            extendArry.push(new fClass("rar.png", ["zip", "rar", "CAB"]));
            extendArry.push(new fClass("mp3.png", ["mp3", "WMA", "WAV", "MOD", "RA", "CD", "MD", "ASF", "AAC", "MP3PRO", "VQF", "FLAC", "APE", "MID", "OGG", "AAC+", "AIFF", "AU"]));
            this.arrays = extendArry;
        }
        return this.arrays;
    },
    getExtendImg: function (ext) {
        ext = ext.replace(".", "");
        var _src = "other.png";
        var extendArry = this.formatArray();
        for (var i = 0; i < extendArry.length; i++) {
            for (var j = 0; j < extendArry[i].files.length; j++) {
                if (ext == extendArry[i].files[j]) {
                    _src = extendArry[i].src;
                    break;
                }
            }
        }
        return this.extendSrc + _src;
    }

}
//引用表单
function UseForm() {
    layui.use(['form', 'layedit', 'laydate', 'element'], function () {
        var form = layui.form
            , layedit = layui.layedit,
            laydate = layui.laydate;
        AD.lay.form = form;
        AD.lay.edit = layedit;
        AD.lay.date = laydate;
        AD.lay.element = layui.element;
        AD.lay.updateForm = function () {
            form.render();
        }
        AD.lay.loaded();
        $(".layer_date").each(function () {
            var _time = AD.json($(this).data("param"));
            if (_time) {
                _time.type = _time.type || 'datetime';
                laydate.render({
                    elem: this,
                    format: _time.format //可任意组合 
                    , type: _time.type
                });
            }
            else {
                laydate.render({
                    elem: this,
                    format: 'yyyy-MM-dd HH:mm:ss' //可任意组合 
                    , type: 'datetime'
                });
            }

        })
    })

    $("form [data-check]").each(function () {
        var _self = $(this);
        var _val = _self.attr("data-check");
        var sibLen = _self.siblings().length;//兄弟节点个数
        var isTrue = _self.val().toLowerCase() == _val.toLowerCase();//是否选中为当前值 
        if (sibLen == 0) {
            if (isTrue) {
                _self.prop("checked", true);
            }
        }
        else if (!isNull(_val)) {
            if (!isTrue) {
                var attrSelector = "";
                if (_self.prop("type") == "checkbox") {
                    var arry = _val.split(',');
                    for (var i = 0; i < arry.length; i++) {
                        attrSelector += "[value='" + arry[i] + "']";
                        if (i < arry.length - 1) {
                            attrSelector += ",";
                        }
                    }
                }
                else
                    attrSelector = "[value='" + _val + "']";
                _self = _self.parent().children(attrSelector);
            }

            if (_self.is("input")) {
                _self.prop("checked", true);
            }
            else
                _self.prop("selected", true);
        }

    })
}
//引用表格
function UseTable() {

    $(".az_select").each(function () { var _sk = $(this).data("select"); $("[value='" + _sk + "']", this).prop("selected", true); })
    layui.use(['table', 'laydate'], function () {
        var table = layui.table;
        //日期生成
        var laydate = layui.laydate;
        AD.lay.table = table;
        AD.lay.date = laydate;
        
        //表格字典
        var tableMap = AD.dictionary();
        //layui 表格操作
        var layTable = {
            /**按钮对象，表格数据 */
            dels: function (obj, data) {
                var checkStatus = table.checkStatus(data.config.id);
                var delArray = new Array();
                for (var i = 0; i < checkStatus.data.length; i++) {
                    delArray.push(checkStatus.data[i].Id);
                }
                var url = $(obj).data("href");
                if (isNull(url)) {
                    url = "DeleteArry";
                }
                var title = $(obj).data("title");
                AD.bk.dels(url, delArray, title);
            },
            del: function (obj, data) {
                var url = $(obj).data("href");
                if (isNull(url)) {
                    url = "Delete";
                }
                AD.bk.del(obj, url, data.data.Id);
            },
            select: function (obj, data) {
                var selectNames = $(obj).data("name");
                ForeignSelect(data.data.Id, data.data[selectNames], data.data);
            },
            nav: function (obj, data) {
                // kit-target data-options="{url:'/FormTables/index?*id',id:'1',title:'表单生成'}" data-title="表单生成"
                var $obj = $(obj);
                var option = $obj.attr("data-param");
                if (option && option.indexOf("*id") > -1) {
                    option = option.replace("*id", "id=" + data.data.Id);
                }
                $obj.attr("kit-target", "");
                $obj.data("title", option.title);
                $obj.attr("data-options", option);
                OpenKitTab(obj);
            },
            other: function (obj, data) {
                var $obj = $(obj);
                if ($obj.hasClass("layui-inline")) return;
                var option = $obj.data("param");//参数包含 "title":"","url":"","isParent":true,"qp":true
                if (!option) {
                    return;
                }
                var _ad = AD;//判断是否父级操作

                if (option.isParent && window.parent) {
                    _ad = window.parent.AD;
                }
                if (!option.id) {
                    if (data.data) option.id = data.data.Id;
                    else option.id = "";
                }

                //弹出页面逻辑
                if ('detail,edit,show,add'.indexOf(data.event) > -1) {
                    _ad.bk.show(option);
                }//访问导航选项卡 
                else if (data.event === 'visit') {
                    if (!option.title) {
                        option.title = "是否确认" + $obj.text() + "!";
                    }
                    _ad.bk.visit(null, option.url, option.id, option.title, option.isPrompt);
                }
                else if (data.event == 'editdeal') {
                    //特殊自写的弹窗
                    _ad.layer_show("规则", option.url, "800", "450", false, null, true);
                }
            }
        };
        /**表格初始化 */
        var layTableInit = {
            /**工具初始化*/
            initTool: function () {
                $(".lay_tool").each(function () {
                    var _self = $(this);
                    var _id = _self.attr("id");
                    if (!_id) {
                        _self.attr("id", "table_toolbar");
                    }
                })
            },
            //表格设置
            tableSet: function () {
                var _self = $(this), id = _self.attr("id"); id = id || "az-table";
                var _filter = _self.attr("lay-filter");
                _filter = _filter || id ; 
                //初始化属性参数
                var _param = AD.json(_self.data("param"));
                _self.attr("lay-filter", _filter); 
                _self.attr("id", id);
                if (!_self.hasClass("layui-table")) {
                    var _option = AD.json(_self.attr("lay-data"));

                    _option.elem = '#' + id;
                    _option.cols = new Array();
                    var _colsArray = new Array();
                    $("[lay-data]", this).each(function (i, e) {
                        var _eJQ = $(e);
                        _colsArray[i] = AD.json(_eJQ.attr("lay-data"));
                        _colsArray[i].title = _eJQ.text();
                    });
                    _option.cols.push(_colsArray);
                    if (!_option.toolbar) {
                        if (_option.toolbar != false) {
                            _option.toolbar = '#table_toolbar';
                        }
                    }

                    _option.done = function (res, curr, count) {
                        if (res) {
                            this.where.count = count;
                        }
                    }
                    if (_param) {
                        if (!isNull(_param.toolbar)) {
                            _option.toolbar = _param.toolbar;
                        }
                        if (_param.defaultToolbar) {
                            _option.defaultToolbar = _param.defaultToolbar;
                        }
                    }
                    tableMap.set(id, table.render(_option));
                    //头工具栏事件
                    table.on('toolbar(' + _filter + ')', layTableInit.tableToolbar);
                }
                table.on("checkbox(" + _filter + ")", function (obj) {
                });
                //工具事件 data-zd="uid"
                table.on("tool(" + _filter + ")", layTableInit.tableTool);
                if (_param && _param.link) {
                    console.log(_filter);
                    AD.lay.table.on('row(' + _filter + ')', function (obj) {

                        AD.lay.reload(_param.link, { where: { id: obj.data.Id } });
                    });
                }
            },
            /**表格工具 */
            tableTool: function (data) {
                switch (data.event) {
                    case "del":
                        layTable.del(this, data);
                        break;
                    case "nav":
                        layTable.nav(this, data);
                        break;
                    case "select":
                        layTable.select(this, data);
                        break;
                    default:
                        layTable.other(this, data);
                        break;
                }
            },
            /**表格工具条*/
            tableToolbar: function (data) {
                switch (data.event) {
                    case "dels":
                        layTable.dels(this, data);
                        break;
                    default:
                        layTable.other(this, data);
                        break;
                }
            },
            /**时间设置*/
            layDate: function () {
                var startTime = laydate.render({
                    elem: "#ts",
                    done: function (value, date) {
                        endTime.config.min = date;
                        endTime.config.min.month = date.month - 1;

                    }
                });
                var endTime = laydate.render({
                    elem: "#te",
                    done: function (value, date) {
                        startTime.config.max = date;
                        startTime.config.max.month = date.month - 1;
                    }
                });
            },
            initALL: function () {
                layTableInit.initTool();
                //表格 级联点击  data-action, data-src
                $(".az_table_click").each(function () {
                    var _self = $(this), _filter = _self.attr("lay-filter");
                    table.on('rowDouble(' + _filter + ')', function (obj) {
                        var _action = _self.data("action");
                        var _target = $("#" + _action);
                        _target.attr("src", _target.data("src") + "?id=" + obj.data.Id)
                    });
                })
                /**表格表单操作 */
                $(".table_form").each(function () {
                    var tform = $(this);
                    var $_btn = $(".layui-icon", this);
                    $("input", this).keyup(function (event) {
                        if (event.keyCode == 13) {
                            $_btn.trigger("click");
                        }
                    });
                    $_btn.click(function () {
                        var obj = tform.serializeJson(); obj.select = true;
                        var _target = $_btn.data("id") || "az-table";
                        AD.lay.reload(_target, { where: obj });
                    })
                })
                $(".az_table,.layui-table").each(layTableInit.tableSet);

                layTableInit.layDate();
            }
        };
        layTableInit.initALL();
        AD.lay.loaded();
    })
}
//引用滑块
function UserSlider() {
    if ($(".az_slider").length > 0) {
        layui.use('slider', function () {
            var slider = layui.slider;
            $(".az_slider").each(function () {
                var _self = $(this);
                var data = AD.json(_self.data("params"));
                var newSlider = $("<div class='slider_div'></div>");
                _self.parent().append(newSlider)
                data.elem = newSlider;
                data.change = function (value) {
                    _self.val(value);
                }
                //渲染
                slider.render(data);
            })
        });
    }
}
//跳转顶部窗口
function loadTopWindow() {
    if (window.top != null && window.top.document.URL != document.URL) {
        window.top.location = document.URL;
    }
}
if ($("#loadTopWindow").length>0) {
    loadTopWindow();
}
(function (window, $) {
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(
            function () {
                if (serializeObj[this.name]) {
                    if ($.isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [
                            serializeObj[this.name], this.value];
                    }
                } else {
                    serializeObj[this.name] = this.value;
                }
            });
        return serializeObj;
    };
})(window, jQuery);

