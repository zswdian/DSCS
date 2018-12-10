using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Livein
    {
        public Livein()
        {
            Checkout = new HashSet<Checkout>();
        }

        public int InNo { get; set; }
        public int RoomId { get; set; }
        public string CustomerId { get; set; }
        public int PersonNum { get; set; }
        public DateTime InTime { get; set; }
        public double Money { get; set; }
        public int Days { get; set; }
        public int OperatorId { get; set; }

        public Operator Operator { get; set; }
        public Roominfo Room { get; set; }
        public ICollection<Checkout> Checkout { get; set; }
    }
}
