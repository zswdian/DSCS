using System;
using System.Collections.Generic;

namespace HotelSystem.Models
{
    public partial class Member
    {
        public int MId { get; set; }
        public string MName { get; set; }
        public string Sex { get; set; }
        public string CredentialType { get; set; }
        public string CreadentialNo { get; set; }
        public string MTel { get; set; }
        public string Address { get; set; }
    }
}
