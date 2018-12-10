using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Customertype
    {
        public Customertype()
        {
            Customer = new HashSet<Customer>();
        }

        public int TypeId { get; set; }
        public string Type { get; set; }
        public double Discount { get; set; }

        public ICollection<Customer> Customer { get; set; }
    }
}
