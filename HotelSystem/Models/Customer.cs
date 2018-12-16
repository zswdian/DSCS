using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Customer
    {
        public int CustomerId { get; set; }
        public int TypeId { get; set; }
        public string CustomerName { get; set; }
        public string Sex { get; set; }
        public string CredentialType { get; set; }
        public string CredentialNo { get; set; }

        public Customertype Type { get; set; }
    }
}
