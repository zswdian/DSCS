using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HotelSystem.Controllers
{
    public class SystemHomeController : Controller
    {
        /// <summary>
        /// 系统界面
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 主界面
        /// </summary>
        /// <returns></returns>
        public IActionResult MainHome()
        {
            return View();
        }

        /// <summary>
        /// 主界面
        /// </summary>
        /// <returns></returns>
        public IActionResult Test()
        {
            return View();
        }
    }
}