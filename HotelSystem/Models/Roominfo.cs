using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Roominfo
    {
        public Roominfo()
        {
            Livein = new HashSet<Livein>();
        }

        public int RoomId { get; set; }
        public int TypeId { get; set; }
        public string State { get; set; }
        public string Statetime { get; set; }
        public string Remark { get; set; }

        public Roomtype Type { get; set; }
        public ICollection<Livein> Livein { get; set; }
    }
}
