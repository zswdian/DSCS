using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Operator
    {
        public Operator()
        {
            Checkout = new HashSet<Checkout>();
            Livein = new HashSet<Livein>();
        }

        public int OperatorId { get; set; }
        public string OperatorName { get; set; }
        public string Pwd { get; set; }

        public ICollection<Checkout> Checkout { get; set; }
        public ICollection<Livein> Livein { get; set; }
    }
}
