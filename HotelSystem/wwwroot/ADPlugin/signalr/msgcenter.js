/** 消息处理中心 */
var MSG = (function (window) {
    var MSG = function () { };
    //消息事件组
   MSG._MSGEventMap = { key: new Array(), value: new Array() };
    /**链接对象 */
    MSG.connection = new Object();
    /**事件类型 */
    MSG.eventType = {
        receiveMessage: "receiveMessage",
        receiveGroup: "receiveGroup",
    };
    /**  发送类型 */
    MSG.sendType = { NamedUser: 0, SelectUser: 4, Group: 8, SelectGroup: 16, ALL: 64, };
    /**  处理类型  */
    MSG.processType = { normal:0, chat: 9, business: 4, custom: 16 };

    /** 是否启动 */
    MSG.isStart = false;
   
    /** 消息事件处理 */
    MSG.event = {
        length: function () {
           return MSG._MSGEventMap.key.length;
        } ,
       /** 
         *  添加事件
         *  @param {string} _name 事件名称,
         *  @param {Function} _func 回调函数，(回调参数-result:结果，eventName:事件名称)
         */
        add: function (_name, _func) { 
           // _MSGEventMap.key.push(_name);
            MSG._MSGEventMap.key.push(MSG.eventType.receiveMessage);
            MSG._MSGEventMap.value.push(_func);
        },
        /** 
        *  添加事件 通过枚举
        *  @param {MSG.eventType} _name 事件枚举,
        *  @param {string} _func 执行函数
        */
        addFromEnum: function (_name, _func) {
            MSG._MSGEventMap.key.push(_name);
            MSG._MSGEventMap.value.push(_func);
        },
        /**
         * 获取函数事件集合 
         * @return {Function[]} 函数数组
         */
        getMap: function (_name) {
            var funcArray = new Array();
            for (var i = 0; i < MSG._MSGEventMap.key.length; i++) {
                if (MSG._MSGEventMap.key[i].indexOf(_name) > -1) {
                    funcArray.push(MSG._MSGEventMap.value[i]);
                }
            }
            return funcArray;
        },
        /**
       * 获取函数事件
       * @return {Function} 返回函数，无则返回null
       */
        get: function (_name) {
            for (var i = 0; i < _MSGEventMap.key.length; i++) {
                if (_MSGEventMap.key[i].indexOf(_name) > -1) {
                    return _MSGEventMap.value[i];
                }
            }
            return null;
        },
        /** 
        *移除事件
        *@param _name 事件名称  
        */
        remove: function (_name) {
            var _index = _MSGEventMap.key.indexOf(_name);
            if (_index > -1) {
                _MSGEventMap.key.splice(_index, 1);
                _MSGEventMap.value.splice(_index, 1);
            }
        },
        /** 
       *清空事件 
       */
        clear: function () {
            _MSGEventMap.key = new Array();
            _MSGEventMap.value = new Array();
        },

    };
   
    /** 创建消息 */
    MSG.infos = function (_msg, _sendType, _sendObjet, _processType, _apiParam) {
        _sendType = _sendType || MSG.sendType.ALL;
        _processType = _processType || MSG.processType.chat;
        var _data = {
            sendObject: _sendObjet,
            sendType: _sendType,
            processType: _processType,
            apiParam: _apiParam,
            msg: _msg,
        };
        return _data;
    }
    
    //相关函数接口
    MSG.func = {
        /**初始化信息处理 返回promis*/
        init: function (_url) {
            if (_url == null)
                _url = "/msgCenter";
            MSG.connection = new signalR.HubConnectionBuilder().withUrl(_url).build();
            MSG.connection.on("ReceiveMessage", function (result) {　  
                var msgEvents = MSG.event.getMap(MSG.eventType.receiveMessage); 
                for (var i = 0; i < msgEvents.length; i++) {
                    var _func = msgEvents[i];
                    if (_func) _func(result,MSG.eventType.receiveMessage);
                }
            });
            MSG.connection.on("ReceiveGroup", function (result) {
                var msgEvents = MSG.event.getMap(MSG.eventType.receiveGroup);
                for (var i = 0; i < msgEvents.length; i++) {
                    var _func = msgEvents[i];
                    if (_func) _func(result, MSG.eventType.receiveGroup);
                }
            });
           return MSG.func.start();
        },
        /**启动消息 返回promis*/
        start: function () {
            if (MSG.isStart) {
                return;
            }
            MSG.isStart = true;
            var _result = MSG.connection.start();
            _result.then(function (_return) {

            }).catch(function (err) {
                MSG.isStart = false;
                return console.error(err.toString());
                });
            return _result;
        },

        /**停止消息 返回promis*/
        stop: function () {
            if (!MSG.isStart) {
                return;
            }
            var _result = MSG.connection.stop();
            _result.then(function (_return) {

            }).catche(function (err) {

             });
            MSG.isStart = false;
            return _result;
        },
        /** 发送消息  支持异步处理对象(promise:then catch) */
        send: function (_msg, _sendType, _sendObjet, _processType, _apiParam) {
            var info = MSG.infos(_msg, _sendType, _sendObjet, _processType, _apiParam);
            if (!MSG.isStart) {
                return;
            }
            var _result = MSG.connection.invoke("SendMessage", info);
            //回调处理
            _result.then(function (_return) {

            });
            //错误处理
            _result.catch(function (_error) {

            });
            return _result;
        },
    }; 
    return MSG;
})(window);

