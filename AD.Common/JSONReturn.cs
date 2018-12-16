/// <summary>
/// 通用JSON返回
/// </summary>
public class JSONReturn
{
    /// <summary>
    /// 构造函数
    /// </summary>
    public JSONReturn() {
        Msg = "请求成功";
        Code = "0";

    }
    /// <summary>
    /// 是否成功
    /// </summary>
    public bool Success { get; set; }
    /// <summary>
    /// 返回信息
    /// </summary>
    public string Msg { get; set; }
    /// <summary>
    /// 相关地址
    /// </summary>
    public string Url { get; set; }
    /// <summary>
    /// 返回数据
    /// </summary>
    public object Data { get; set; }
    /// <summary>
    /// 回馈代码
    /// </summary>
    public string Code { get; set; }
    /// <summary>
    /// 获取简JSON    核心代码
    /// </summary>
    public string GetJson()
    {
        string json = "{{success:{0},msg:'{1}',code:'{2}',url:'{3}'}}";
        string Json = string.Format(json, Success, Msg, Code, Url);
        return Json;
    }

}
