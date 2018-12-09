using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HotelSystem.Models;

namespace HotelSystem.Controllers
{
    public class HomeController : ADController
    {
        /// <summary>
        /// 登录界面
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }
        ///// <summary>
        ///// 登录请求接口
        ///// </summary>
        ///// <returns></returns>
        [HttpPost("~/Login")]
        public IActionResult Login(string userName, string passWord)
        {
            result.Success = true;
            result.Code = "6100"; //整窗口跳转
            if (result.Success)
            {
                result.Url = "/SystemHome/Index";

            }
            return Json(result);
        }


        //[HttpPost("~/Login")]
        //public IActionResult Login(string userName, string passWord)
        //{
        //    result.Success = true;
        //    result.Code = "6100"; //整窗口跳转
        //    if (result.Success)
        //    {
        //        return Redirect("/SystemHome/Index");
        //    }
        //    return Json(result);
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
