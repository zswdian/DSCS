using AZ.BLL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
{{ModelName}}
namespace HZAdmin{{NameSpace}}.Controllers
{
    //{{TableRemark}}控制器
    public class {{FileName}}Controller : ControllerBase
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
            search.count = bllManager.GetSearchCount(search);
            return View(search);
        }
        //获取LIST数据
        public ActionResult GetList(SearchLayer search)
        {
            result.Objects = bllManager.GetPageData(search);
            return Json(result.GetNew(search.count), JsonRequestBehavior.AllowGet); 
        }

        // GET: 数据添加
        public ActionResult Create()
        {
            return View();
        }
        // POST: 数据添加请求
        //  防止“过多发布”攻击，请启用要绑定到的特定属性。
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public ActionResult Create([Bind(Include = "{{authorize}}")] {{TableName}}
entity)
        {
            result.Message = "添加失败";
            if (ModelState.IsValid)
            {
                int row = bllManager.Insert(entity);
                if (row > 0)
                {
                    result.SetCode =CodeWeb.RefreshPage; 
                    result.IsSuccess = true;
                    result.Message = "添加成功";
                }
            }
            else
            {
                ValidError();
            }
            return Json(result);
        }

        // GET: 详细信息
        public ActionResult Details(int Id)
        {
            var entity = bllManager.FindKey(Id);
            if (entity == null)
            {
                return ErrorPage();
            }
            return View(entity);
        }
        // GET: 修改页
        public ActionResult Edit(long Id)
        {
            var entity = bllManager.FindKey(Id);
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
        [ValidateInput(false)]
        public JsonResult Edit({{TableName}} entity)
        {
            JSONReturn result = new JSONReturn();
            result.Message = "修改失败";
            if (ModelState.IsValid)
            {
                int row = bllManager.Update(entity, authorizeField);
                if (row > 0)
                {
                    result.SetCode = CodeWeb.RefreshPage;
                    result.IsSuccess = true;
                    result.Message = "修改成功";
                }
            }
            return Json(result);
        }
        // POST: 确认删除
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public JsonResult DeleteConfirmed(long Id)
        { 
            result.Message = "删除失败";
            var entity = bllManager.FindKey(Id);
            if (entity == null)
            {
                return Json(result);
            }
            int num = bllManager.Delete(Id);
            if (num > 0)
            {
                result.SetCode = CodeWeb.RefreshPage;
                result.IsSuccess = true;
                result.Message = "删除成功";
            }
            return Json(result);
        }
        // POST: 确认批量删除
        [HttpPost]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public JsonResult DeleteArry(long[] Id)
        {
            JSONReturn result = new JSONReturn();
            result.Message = "批量删除失败";
            var row = bllManager.Delete(Id.ToList());
            if (row > 0)
            {
                result.IsSuccess = true;
                result.SetTime();
                result.SetCode = CodeWeb.RefreshPage;
                result.Message = string.Format("批量删除成功,共{0}条", row);
            }
            return Json(result);
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