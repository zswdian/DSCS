using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Roomtype
    {
        public Roomtype()
        {
            Roominfo = new HashSet<Roominfo>();
        }

        public int TypeId { get; set; }
        public string Type { get; set; }
        public int BedNum { get; set; }
        public double Price { get; set; }
        public double Foregift { get; set; }
        public string ClRoom { get; set; }
        public double? ClPrice { get; set; }

        public ICollection<Roominfo> Roominfo { get; set; }
    }
}
