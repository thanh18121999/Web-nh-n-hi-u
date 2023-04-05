using System;
using System.ComponentModel.DataAnnotations;

namespace Project.Models
{
    public class Booking
    {
        public int ID { get; set; }
        public string? CUSTOMPHONE { get; set; }
        public string? CUSTOMNAME { get; set; }
        public string? CUSTOMEMAIL { get; set; }
        //public string? AVATAR { get; set; }
        [DataType(DataType.Date)]
        public DateTime BOOKINGDATE { get; set; }
        public int? ASSIGNEDEXPERT { get; set; }
    }
}


