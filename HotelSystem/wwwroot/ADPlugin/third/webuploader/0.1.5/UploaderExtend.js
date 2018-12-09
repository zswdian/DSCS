 
/**
* 文件上传扩展插件
*/
/** AZ: BEGIN LICENSE TEXT
 *
 * @author dwj
 *
 *  AZ: END LICENSE TEXT */
/*!
 * AZ JavaScript Library v1.0.0
 * http://null.com/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2017, 2045 AZ Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://null/license
 *
 * Date: 2017-01-18T17:13:23+0800
 */ 
AD.uploader = function (selector, option) { 
    var _selector = $(selector);
    for (var i = 0; i < _selector.length; i++) {
        let _target = $(_selector.get(i));
        if (i != 0) {
            setTimeout(function () { loadUploader(_target); }, 35);
        }
        else
            loadUploader(_target);
    }

    function loadUploader(_target) {
        var _option = _target.data("param");
        console.log(_option);
        //插件配置
        var settings = $.extend({
            "name": "names",//上传名称
            "action": 0,//上传接口
            "id": "",//上传编号
            "saveType": "other",//存储类型
            "auto": true,//是否自动上传
            "show_ico": false, //显示图标
            "types": 0,//返回类型 0 ID,1 地址, 2 显示INPUT
            "thumb": 0,//缩略图处理接口
            "tags": null,//相关标识 
            "show": null,
            "clip": null,//裁剪参数 
            "cacheId": null,//备用字段
            "accept": null,
            "newPath": null,//后台存储指定，相关路径 格式\\path\\
        }, _option);
        //setOptionId(settings);

        if (settings.action == 4 || settings.action == 1) {
            MutipleFile(_target, settings);
        }
        else if (settings.action == 0 || settings.action == 2) {
            SingleFile(_target, settings);
        }
    }
}

function setOptionId(option) {
    if (isNull(option.id)) {
        $.get(AD.fn.systemUrl.getUid, function (data) {
            option.cacheId = data;
        })
    }
}
//设置文件上传前参数
function setUploadBeforSend(uploader, option) {
    uploader.on('uploadBeforeSend', function (object, data, header) {
        // 修改data可以控制发送哪些携带数据。 
        data.guid = option.id;
    })
}
//单文件上传
function SingleFile(targets, option) {
    //动态控件
    var $list = $("<div id='" + option.name + "List' class='uploader-list'></div>"),
        $select_pic = $("<div id='" + option.name + "Picker' >选择" + (option.action > 1 ? "图片" : "文件") + "</div>"),
        $btn = $("<button id='" + option.name + "btn-star' class='btn btn-default btn-uploadstar radius ml-10'>开始上传</button>"),
        $_input = $("<input id='" + option.name + "' name='" + option.name + "' value='" + option.id + "' type='text' class='layui-input upload_input'  />"),
       
        ratio = window.devicePixelRatio || 1,
        thumbnailWidth = 110 * ratio, // 缩略图大小
        thumbnailHeight = 110 * ratio,       // 优化retina, 在retina下这个值是2

        state = "pending";
    targets.append($list).append($select_pic).append($_input);
    if (!option.auto) {
        targets.append($btn);
    }
    if (option.types == 2) {
        $_input.show();
    } 
    var _accept = option.action > 1 ? {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/jpg,image/jpeg,image/png'
    } : null;
   
    if (option.accept!=null) _accept = GetUploadAccept(option.accept);//赋予格式
    var uploader = WebUploader.create({
        auto: option.auto,
        swf: 'lib/webuploader/0.1.5/Uploader.swf',
        // 文件接收服务端。
        server: AD.fn.systemUrl.uploader_server,
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: {
            id: $select_pic,
            multiple: false,
        },
        // fileSingleSizeLimit: 2 * 1024 * 1024,
        chunked: false,
        // 只允许选择图片文件。
        accept: _accept,
        formData: {
            action: option.action,
            guid: option.id,
            tags: option.tags,
            thumb: option.thumb,
            newPath:option.newPath,
            types: option.types
            // '__RequestVerificationToken': AD.bk.token,
        }
    });
    setUploadBeforSend(uploader, option);
    uploader.on('beforeFileQueued', function (file) {
        if (uploader.getFiles().length > 0) {
            for (var i = 0; i < uploader.getFiles().length; i++) {
                uploader.removeFile(uploader.getFiles()[i]);
            }
        }
    });
    var delButton, pState, imgLi;//删除按钮
    function setImage(id, name, isHide) {//设置展示图片
        var $li = $(
            '<div id="' + id + '" class="file-item thumbnail">' +
            '<img>' +
            '<div class="info">' + name + '</div>' +
            '<i class="layui-icon del">&#xe640;</i>' +
            '<p class="state">等待上传...</p>',
            '</div>'
        ),
            $img = $li.find('img');
        imgLi = $li;
        delButton = $li.find(".del");
        pState = $li.find(".state");
        if (isHide) {
            $li.find(".state").hide();
        }
        // $list为容器jQuery实例
        $list.html($li);
        return $img;
    }
    function showDeleteFile(id) {// 删除文件按钮操作
        if (delButton) {
            delButton.show();
            delButton.click(function () {
                $.post(AD.fn.systemUrl.delFile + "?id=" + id, function (_result) {
                    if (_result.success) {
                        setStateValue(false, "删除成功"); $_input.val(null);
                        imgLi.remove();
                    }
                    else {
                        setStateValue(false, "删除失败");
                    }
                });
            });
        }
    }
    //设置状态值
    function setStateValue(_show, _value) {
        if (_show) {
            pState.text(_value); pState.slideUp("slow");
        }
        else {
            pState.text(_value); pState.slideDown();
        }
    }
    //读取文件数据
    if (!isNull(option.id)) {
        var id = "file_" + option.name;
        AD.cm.setFileShow(option.id, option.show, null, function (img, _result) {
            if (_result==null) {
                var $img = setImage(id, option.name, true).replaceWith(img);
                showDeleteFile(option.id);
            }
            else {
                var $img = setImage(id, _result.data.files[0].name, true).replaceWith(img);
                showDeleteFile(_result.data.files[0].id);
            } 
        });
    }
    uploader.on('fileQueued', function (file) {
        var $img = setImage(file.id, file.name);
        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                var ext = AD.fn.getFileExt(file.name);
                src = extendFormatList.getExtendImg(ext);
                //  $img.replaceWith('<span>不能预览</span>'); 
            }
            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress-box .sr-only');
        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<div class="progress-box"><span class="progress-bar radius"><span class="sr-only" style="width:0%"></span></span></div>').appendTo($li).find('.sr-only');
        }
        pState.text("上传中");
        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, _result) {
        var $li = $('#' + file.id);
        if (_result.success) { 
            var _fileData = _result.data[0];
            if (option.types==1) {
                $_input.val(_fileData.path);
                $_input.data("new_value", _fileData.path);
            }
            else {
                $_input.val(_fileData.rid);
                $_input.data("new_value", _fileData.rid);
            } 
            setStateValue(_result.success, "上传成功");
            showDeleteFile(_fileData.id);
        }
        else {
            setStateValue(_result.success, "上传失败");
            $li.addClass('upload-state-error')
        }
    });

    // 文件上传失败，显示上传失败。
    uploader.on('uploadError', function (file) {
        $('#' + file.id).addClass('upload-state-error').find(".state").text("上传失败");
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function (file) {
        $('#' + file.id).find('.progress-box').fadeOut();
    });
    uploader.on('all', function (type) {
        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.text('暂停上传');
        } else {
            $btn.text('开始上传');
        }
    });

    $btn.on('click', function () {
        if (state === 'uploading') {
            uploader.stop();
        } else {
            uploader.upload();
        }
    });
}

//多文件上传
function MutipleFile(targets, option) {
    var selectName = option.action > 1 ? "图片" : "文件", fileUnit = option.action > 1 ? "张" : "个";//文件单位
    var filestyle = option.action > 1 ? 'img' : 'file';
    var mutipleHtml = "<div class='uploader-list-container'>  <div class='queueList'> <div id='dndArea" + option.name + "' class='placeholder " + filestyle + "'> <div id='filePicker-2" + option.name + "'></div> <p>或将" + selectName + "拖到这里，单次最多可选300" + fileUnit + "</p> </div> </div> <div class='statusBar' style='display:none;'> <div class='progress'> <span class='text'>0%</span> <span class='percentage'></span> </div> <div class='info'></div> <div class='btns'> <div id='filePicker2" + option.name + "'></div> <div class='uploadBtn'>开始上传</div> </div> </div></div>";
    var $wrap = $(mutipleHtml),
        $_input = $("<input id='" + option.name + "' name='" + option.name + "' value='" + option.id + "' type='text' class='hidden'/>"),
        // 图片容器
        $queue = $('<ul class="filelist"></ul>')
            .appendTo($wrap.find('.queueList')),

        // 状态栏，包括进度和控制按钮
        $statusBar = $wrap.find('.statusBar'),

        // 文件总体选择信息。
        $info = $statusBar.find('.info'),

        // 上传按钮
        $upload = $wrap.find('.uploadBtn'),

        // 没选择文件之前的内容。
        $placeHolder = $wrap.find('.placeholder'),

        $progress = $statusBar.find('.progress').hide(),

        // 添加的文件数量
        fileCount = 0,

        // 添加的文件总大小
        fileSize = 0,

        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 110 * ratio,
        thumbnailHeight = 110 * ratio,

        // 可能有pedding, ready, uploading, confirm, done.
        state = 'pedding',

        // 所有文件的进度信息，key为file id
        percentages = {},
        // 判断浏览器是否支持图片的base64
        isSupportBase64 = (function () {
            var data = new Image();
            var support = true;
            data.onload = data.onerror = function () {
                if (this.width != 1 || this.height != 1) {
                    support = false;
                }
            }
            data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            return support;
        })(),

        // 检测是否已经安装flash，检测flash的版本
        flashVersion = (function () {
            var version;

            try {
                version = navigator.plugins['Shockwave Flash'];
                version = version.description;
            } catch (ex) {
                try {
                    version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                        .GetVariable('$version');
                } catch (ex2) {
                    version = '0.0';
                }
            }
            version = version.match(/\d+/g);
            return parseFloat(version[0] + '.' + version[1], 10);
        })(),

        supportTransition = (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),

        // WebUploader实例
        uploader;
    targets.append($_input);
    targets.append($wrap);

    if (!WebUploader.Uploader.support('flash') && WebUploader.browser.ie) {
        // flash 安装了但是版本过低。
        if (flashVersion) {
            (function (container) {
                window['expressinstallcallback'] = function (state) {
                    switch (state) {
                        case 'Download.Cancelled':
                            alert('您取消了更新！')
                            break;

                        case 'Download.Failed':
                            alert('安装失败')
                            break;

                        default:
                            alert('安装已成功，请刷新！');
                            break;
                    }
                    delete window['expressinstallcallback'];
                };

                var swf = 'expressInstall.swf';
                // insert flash object
                var html = '<object type="application/' +
                    'x-shockwave-flash" data="' + swf + '" ';

                if (WebUploader.browser.ie) {
                    html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                }

                html += 'width="100%" height="100%" style="outline:0">' +
                    '<param name="movie" value="' + swf + '" />' +
                    '<param name="wmode" value="transparent" />' +
                    '<param name="allowscriptaccess" value="always" />' +
                    '</object>';

                container.html(html);

            })($wrap);

            // 压根就没有安转。
        } else {
            $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
        }

        return;
    } else if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！');
        return;
    }
    
    var _accept = option.action > 1 ? {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/jpg,image/jpeg,image/png'
    } : null;
    if (option.accept!= null) _accept = GetUploadAccept(option.accept);//赋予格式
    // 实例化 
    uploader = WebUploader.create({
        pick: {
            id: '#filePicker-2' + option.name,
            label: '点击选择' + selectName
        },
        formData: {
            action: option.action,
            guid: option.id,
            tags: option.tags,
            newPath: option.newPath,
            thumb: option.thumb,
        },
        dnd: '#dndArea' + option.name,
        paste: '#uploader' + option.name,
        swf: 'lib/webuploader/0.1.5/Uploader.swf',
        chunked: false,
        chunkSize: 512 * 1024,
        server: AD.fn.systemUrl.uploader_server,
        // runtimeOrder: 'flash',

        accept: _accept,
        // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
        disableGlobalDnd: true,
        fileNumLimit: 300,
        fileSizeLimit: 200 * 1024 * 1024,    // 200 M
        fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
    });
    setUploadBeforSend(uploader, option);
    // 拖拽时不接受 js, txt 文件。
    uploader.on('dndAccept', function (items) {
        var denied = false,
            len = items.length,
            i = 0,
            // 修改js类型
            unAllowed = 'text/plain;application/javascript ';

        for (; i < len; i++) {
            // 如果在列表里面
            if (~unAllowed.indexOf(items[i].type)) {
                denied = true;
                break;
            }
        }
        return !denied;
    });
    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file, _result) {
        if (_result.success) {
            if (isNull(option.id)) {
                var _fileData = _result.data[0];
                option.id = _fileData.rid;
                $_input.val(_fileData.rid);
                $_input.data("new_value", _fileData.rid);
            }
        }
    });

    uploader.on('dialogOpen', function () {
        console.log('here');
    });

    // 添加“添加文件”的按钮，
    uploader.addButton({
        id: '#filePicker2' + option.name,
        label: '继续添加'
    });

    uploader.on('ready', function () {
        window.uploader = uploader;
    });

    // 当有文件添加进来时执行，负责view的创建
    function addFile(file, edit) {

        var $li = $('<li id="' + file.id + '">' +
            '<p class="title">' + file.name + '</p>' +
            '<p class="imgWrap"></p>' +
            '<p class="progress"><span></span></p>' +
            '</li>'),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo($li),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find('p.imgWrap'),
            $info = $('<p class="error"></p>'),

            showError = function (code) {
                switch (code) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text(text).appendTo($li);
            };

        if (edit) {

            var img = $('<img>');
            img.width(thumbnailWidth).height(thumbnailHeight);
             var ext = AD.fn.getFileExt(file.name);
            var src = extendFormatList.getExtendImg(ext); 
            if (!isNull(file.src)) {
                src = file.src;
            }
            img.attr("src", src);
            $wrap.empty().append(img);
            $li.append('<span class="success"></span>');
         
            // percentages[file.name] = [file.size, 0];
            // file.rotation = 0;
        }
        else {
            if (file.getStatus() === 'invalid') {
                showError(file.statusText);
            } else {
                // @todo lazyload 
                uploader.makeThumb(file, function (error, src) {
                    var img;
                    if (error) {
                        var ext = AD.fn.getFileExt(file.name);
                        src = extendFormatList.getExtendImg(ext);
                    }
                    if (isSupportBase64) {
                        img = $('<img src="' + src + '">');
                        $wrap.empty().append(img);
                    }
                }, thumbnailWidth, thumbnailHeight);

                percentages[file.name] = [file.size, 0];
                file.rotation = 0;
            }
            file.on('statuschange', function (cur, prev) {
                if (prev === 'progress') {
                    $prgress.hide().width(0);
                } else if (prev === 'queued') {
                    $li.off('mouseenter mouseleave');
                    $btns.remove();
                } 
                // 成功
                if (cur === 'error' || cur === 'invalid') {
                    console.log(file.statusText);
                    showError(file.statusText);
                    percentages[file.name][1] = 1;
                } else if (cur === 'interrupt') {
                    showError('interrupt');
                } else if (cur === 'queued') {
                    percentages[file.name][1] = 0;
                } else if (cur === 'progress') {
                    $info.remove();
                    $prgress.css('display', 'block');
                } else if (cur === 'complete') {
                    $li.append('<span class="success"></span>');
                }

                $li.removeClass('state-' + prev).addClass('state-' + cur);
            });
        }
        $li.on('mouseenter', function () {
            $btns.stop().animate({ height: 30 });
        });

        $li.on('mouseleave', function () {
            $btns.stop().animate({ height: 0 });
        });

        $btns.on('click', 'span', function () {
            var index = $(this).index(),
                deg;
            switch (index) {
                case 0:
                    if (edit) { 
                        $.post(AD.fn.systemUrl.delFile + "?id=" + file.id , function (_result) {
                            if (_result.success) { 
                                removeFile(file); 
                            }
                            else {
                                $info.text("删除失败").appendTo($li);  
                            }
                        }); 
                    }
                        
                    else
                    uploader.removeFile(file);
                    return;
                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }
            if (!edit) {
                if (supportTransition) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $wrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                    $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');

                }
            }
        });

        $li.appendTo($queue);
    }
    //读取文件数据 
    if (!isNull(option.id)) {
        AD.cm.setFileShow(option.id, option.show, null, function (img, _result) {
            var dataFiles = _result.data.files;
            for (var i = 0; i < dataFiles.length; i++) {
                var item = dataFiles[i]; 
                var cloneFile = {
                    id: item.id, name: item.name, src: item.path, getStatus: function () { return "success"; }
                };
                addFile(cloneFile, true);
                fileCount++;
                fileSize += AD.fn.getFileSize(item.size) ;
              
            }
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
            setState('ready');
            updateTotalProgress();
        });
    }
    // 负责view的销毁
    function removeFile(file) {
        var $li = $('#' + file.id);
        delete percentages[file.name];
        updateTotalProgress();
        $li.off().find('.file-panel').off().end().remove();
    }

    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each(percentages, function (k, v) {
            total += v[0];
            loaded += v[0] * v[1];
        });

        percent = total ? loaded / total : 0;


        spans.eq(0).text(Math.round(percent * 100) + '%');
        spans.eq(1).css('width', Math.round(percent * 100) + '%');
        updateStatus();
    }

    function updateStatus() {
        var text = '', stats;

        if (state === 'ready') {
            text = '选中' + fileCount + fileUnit + selectName + '，共' +
                WebUploader.formatSize(fileSize) + '。';
        } else if (state === 'confirm') {
            stats = uploader.getStats();
            if (stats.uploadFailNum) {
                text = '已成功上传' + stats.successNum + fileUnit + selectName + '，' +
                    stats.uploadFailNum + fileUnit + selectName + '上传失败，<a class="retry" href="#">重新上传</a>失败' + selectName + '或<a class="ignore" href="#">忽略</a>'
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + fileUnit + '（' +
                WebUploader.formatSize(fileSize) +
                '），已上传' + stats.successNum + fileUnit;

            if (stats.uploadFailNum) {
                text += '，失败' + stats.uploadFailNum + fileUnit;
            }
        }

        $info.html(text);
    }

    function setState(val) {
        var file, stats;

        if (val === state) {
            return;
        }

        $upload.removeClass('state-' + state);
        $upload.addClass('state-' + val);
        state = val;

        switch (state) {
            case 'pedding':
                $placeHolder.removeClass('element-invisible');
                $queue.hide();
                $statusBar.addClass('element-invisible');
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass('element-invisible');
                $('#filePicker2').removeClass('element-invisible');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $('#filePicker2').addClass('element-invisible');
                $progress.show();
                $upload.text('暂停上传');
                break;

            case 'paused':
                $progress.show();
                $upload.text('继续上传');
                break;

            case 'confirm':
                $progress.hide();
                $('#filePicker2').removeClass('element-invisible');
                $upload.text('开始上传');

                stats = uploader.getStats();
                if (stats.successNum && !stats.uploadFailNum) {
                    setState('finish');
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if (stats.successNum) {
                    alert('上传成功');
                } else {
                    // 没有成功的文件，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }

    uploader.onUploadProgress = function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        $percent.css('width', percentage * 100 + '%');
        percentages[file.name][1] = percentage;
        updateTotalProgress();
    };

    uploader.onFileQueued = function (file) {
        fileCount++;
        fileSize += file.size;

        if (fileCount === 1) {
            $placeHolder.addClass('element-invisible');
            $statusBar.show();
        }

        addFile(file, false);
        setState('ready');
        updateTotalProgress();
    };

    uploader.onFileDequeued = function (file) {
        fileCount--;
        fileSize -= file.size;

        if (!fileCount) {
            setState('pedding');
        }

        removeFile(file);
        updateTotalProgress();

    };

    uploader.on('all', function (type) {
        var stats;
        switch (type) {
            case 'uploadFinished':
                setState('confirm');
                break;

            case 'startUpload':
                setState('uploading');
                break;

            case 'stopUpload':
                setState('paused');
                break;

        }
    });
    uploader.onError = function (code) {
        alert('Eroor: ' + code);
    };

    $upload.on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }

        if (state === 'ready') {
            uploader.upload();
        } else if (state === 'paused') {
            uploader.upload();
        } else if (state === 'uploading') {
            uploader.stop();
        }
    });

    $info.on('click', '.retry', function () {
        uploader.retry();
    });

    $info.on('click', '.ignore', function () {
        alert('todo');
    });

    $upload.addClass('state-' + state);
    updateTotalProgress();
}
function GetUploadAccept(list) {
    var _array = list.split(',');
    var accept = {
        title: '选择文件',
        extensions: "",
        mimeTypes: ""
    };

    var _mapKey = ["jpg", "mp4", "pdf", "png", "ppt", "doc", "xls", "docx", "xlsx", "pptx"];
    var _mapValue = ["image/jpeg", "video/mp4", "application/pdf", "image/png", "application/vnd.ms-powerpoint", "application/msword", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    for (var i = 0; i < _array.length; i++) {
        var _val = _array[i];
        var _index = _mapKey.indexOf(_val);
        if (_index>-1) {
            accept.extensions += _mapKey[_index]+",";
            accept.mimeTypes += _mapValue[_index] + ",";
        }
    } 
    return accept;
  }


