using SqlSugar;
using System;
using System.Collections.Generic;
using System.Text;

namespace AD.BLL
{
    /// <summary>
    /// 业务逻辑基础处理类
    /// </summary>
    public abstract class BLLBase : IDisposable
    {
        //属性 数据库链接
        protected SqlSugarClient _db;

        //数据库配置
        public virtual ConnectionConfig dbConfig
        {
            get
            {
                return dbConfig;
            }

        }

        public SqlSugarClient db
        {
            get
            {
                if (_db == null)
                {
                    _db = new SqlSugarClient(dbConfig);
                }
                return _db;
            }
            set
            {
                db = value;
            }
        }

        public virtual void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
