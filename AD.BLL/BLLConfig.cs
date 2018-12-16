using SqlSugar;
using System;
using System.Collections.Generic;
using System.Text;

namespace AD.BLL
{
    /// <summary>
    /// 业务处理参数
    /// </summary>
    class BLLConfig
    {
        private static Dictionary<string, ConnectionConfig> connList = new Dictionary<string, ConnectionConfig>();
        /// <summary>
        /// 系统默认配置
        /// </summary>
        //public static ConnectionConfig DBConfig
        //{
        //    get
        //    {
        //        return GetDBConfig("MAINDB");
        //    }
        //}




        //public static ConnectionConfig GetDBConfig(string configName)
        //{
        //    if (connList.ContainsKey(configName))
        //    {
        //        return connList[configName];
        //    }
        //    else
        //    {
        //        lock (connList)
        //        {
        //            if (connList.Count <= 0)
        //            {
        //                foreach (var item in)
        //                { }
        //            }
        //        }

        //    }

        //}





    }
}
