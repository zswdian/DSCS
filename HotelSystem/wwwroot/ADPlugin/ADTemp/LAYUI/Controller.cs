using AD.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
{{ModelName}}
namespace ADAdmin{{NameSpace}}.Controllers
{
   
    {{AreaName}} //{{TableRemark}}控制器
    public class {{FileName}}Controller : AuthController
    {
        #region 核心函数 
        /// <summary>
        /// 授权字段
        /// </summary>
        string authorizeField = "{{authorize}}";

        /// <summary>
        /// 业务操作类
        /// </summary>
        ALLManager<{{TableName}}> bllManager = new ALLManager<{{TableName}}>();
        #endregion

        #region 请求函数
        // GET: 首页
        public ActionResult Index(SearchLayer search)
        { 
            return View(search);
        }
        // GET: 首页
        public ActionResult Show(SearchLayer search)
        { 
            return View(search);
        }
        //获取LIST数据
        public ActionResult GetList(SearchLayer search)
        {
            result = bllManager.GetPageResult(search{{ForeignQuery2}}); 
            return Json();
        }
{{ForeignFunc}}        
        // GET: 数据添加
        public ActionResult Create()
        {
            return View();
        }
        // POST: 数据添加请求
        //  防止“过多发布”攻击，请启用要绑定到的特定属性。
        [HttpPost]
        [ValidateAntiForgeryToken] 
        public ActionResult Create({{TableName}} entity)
        {
            result.msg = "保存失败";
            if (ModelState.IsValid)
            {
                {{SystemTag}}    
                int row = bllManager.Insert(entity,authorizeField);
                if (row > 0)
                {
                    result.SetCode =CodeEnums.RefreshTable; 
                    result.success = true;
                    result.msg = "保存成功";
                }
            }
            else
            {
                ValidError();
            }
            return Json();
        }

        // GET: 详细信息
        public ActionResult Details(string Id)
        {
            var entity = bllManager.FindKey(Id{{ForeignQuery}});
            if (entity == null)
            {
                return ErrorPage();
            }
            return View(entity);
        }
        // GET: 修改页
        public ActionResult Edit(string Id)
        {
            var entity = bllManager.FindKey(Id{{ForeignQuery}});
            if (entity == null)
            {
                return ErrorPage();
            }
            return View(entity);
        }
        // POST: 确认修改
        // 防止“过多发布”攻击，请启用要绑定到的特定属性。
        [HttpPost]
        [ValidateAntiForgeryToken] 
        public JsonResult Edit({{TableName}} entity)
        {
         
            result.msg = "修改失败";
            if (ModelState.IsValid)
            {
                {{SystemTag}}  
                int row = bllManager.Update(entity, authorizeField);
                if (row > 0)
                {
                    result.SetCode = CodeEnums.RefreshTable;
                    result.success = true;
                    result.msg = "修改成功";
                }
            }
            else
            {
                ValidError();
            }
            return Json();
        }
        // POST: 确认删除
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken] 
        public JsonResult DeleteConfirmed(string Id)
        { 
            result.msg = "删除失败";
            var entity = bllManager.FindKey(Id);
            if (entity == null)
            {
                return Json();
            }
            int num = bllManager.Delete(Id);
            if (num > 0)
            {
                result.SetCode = CodeEnums.RefreshTable;
                result.success = true;
                result.msg = "删除成功";
            }
            return Json();
        }
        // POST: 确认批量删除
        [HttpPost]
        [ValidateAntiForgeryToken] 
        public JsonResult DeleteArry(string[] Id)
        { 
            result.msg = "批量删除失败";
            var row = bllManager.Delete(Id.ToList());
            if (row > 0)
            {
                result.success = true;
                result.SetTime();
                result.SetCode = CodeEnums.RefreshTable;
                result.msg = string.Format("批量删除成功,共{0}条", row);
            }
            return Json();
        }

        /// <summary>
        /// 释放资源
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                bllManager.Dispose();
            }
            base.Dispose(disposing);
        }
        #endregion
    }
}