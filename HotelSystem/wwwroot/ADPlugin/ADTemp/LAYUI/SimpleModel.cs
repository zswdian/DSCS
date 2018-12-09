using System;
using System.ComponentModel; 
using AD.Models.Entity;
namespace {{Namespace}}
{
    /// <summary>
    /// {{TableRemark}}
    /// </summary>
    [Table("{{TableName}}")]
    [Description("{{TableRemark}}")]
    public class {{EntityName}} : {{BaseName}}
    {
{{Attr}}
{{Foreign}}
    }
    {{enums}}
}
