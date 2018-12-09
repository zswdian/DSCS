import { setTimeout } from "timers";

/** AZApp: BEGIN LICENSE TEXT
 *
 * @author dwj
 *
 *  AZApp: END LICENSE TEXT */
/*!
 * AZApp JavaScript Library v1.0.0
 * http://null.com/
 *
 * Includes jquery.js
 * http://jquery.com/
 *
 * Copyright 2017, 2045 AZApp Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://null/license
 *
 * Date: 2017-01-18T17:13:23+0800
 */

(function (window, undefined) { 
    $.ajax({
        url: "xxx.json",
        success: function (data) {           
        }
    });
})(window);

BingFa();
function BingFa() {
    var success = 0;
    //并发数
    for (var i = 0; i < 1000; i++) {
        setTimeout(function () {
            //并发请求量
            for (var j = 0; j < 1000; j++) {
                $.post("接口", function (data) {
                    success++;
                    console.log(success);
                });
            }
        });
    }
}