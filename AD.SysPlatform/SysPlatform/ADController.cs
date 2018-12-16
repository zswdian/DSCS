using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;

/// <summary>
///封装自己需要的控制器基类
/// </summary>

public class ADController : Controller {
    /// <summary>
    /// 在程序运行的过程中，所有变量都在内存中
    /// 序列化：把变量从内存中变成可存储或可传输的过程称之为序列化
    /// </summary>
    #region 核心属性
    static JsonSerializerSettings _jsonSerializerSettings;//Json序列化设置
    /// <summary>
    /// Json转换配置
    /// </summary>
    public static JsonSerializerSettings JsonSetting
    {
        get
        {
            if (_jsonSerializerSettings == null)
            {
                _jsonSerializerSettings = new JsonSerializerSettings();
                _jsonSerializerSettings.Converters.Add(new StringEnumConverter());
                _jsonSerializerSettings.DateFormatHandling = DateFormatHandling.MicrosoftDateFormat;
                _jsonSerializerSettings.DateFormatString = "yyyy/MM/dd HH:mm:ss";
            }
            return _jsonSerializerSettings;
        }
    }
    /// <summary>
    /// 记得在项目层面添加引用
    /// </summary>
    protected JSONReturn result = new JSONReturn();
    #endregion
    /// <summary>
    /// result 格式化
    /// </summary> 
    public JsonResult Json()
    {
        return Json(result, JsonSetting);
    }
    /// <summary>
    /// result格式化
    /// </summary>
    /// <returns></returns>
    public JsonResult JsonToBase() {
        return Json(result, _jsonSerializerSettings);
    }

}

