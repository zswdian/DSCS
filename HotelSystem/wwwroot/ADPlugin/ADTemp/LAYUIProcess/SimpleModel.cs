using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations; 
using AZ.Models;
using AZ.Models.Entity;
namespace {{Namespace}}
{
    /// <summary>
    /// {{TableRemark}}
    /// </summary>
    [Table("{{TableName}}")]
    [Description("{{TableRemark}}")]
    public class {{EntityName}} : AbstractEntity
    {
{{Attr}}
    }
}
