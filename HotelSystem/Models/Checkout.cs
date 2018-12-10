using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Checkout
    {
        public int ChkNo { get; set; }
        public int InNo { get; set; }
        public DateTime ChkTime { get; set; }
        public int Days { get; set; }
        public double Money { get; set; }
        public int OperatorId { get; set; }

        public Livein InNoNavigation { get; set; }
        public Operator Operator { get; set; }
    }
}
