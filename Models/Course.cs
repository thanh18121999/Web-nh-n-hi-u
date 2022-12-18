using System.ComponentModel.DataAnnotations;

namespace Project.Models
{
    public class Course
    {
        public int ID { get; set; }
        public string? CODE {get;set;}
        public string? NAME {get;set;}
        public string? DESCRIPTION {get;set;}
        [DataType(DataType.Date)]
        public DateTime CREATEDDATE { get; set; }
        public DateTime STARTDATE { get; set; }
        public DateTime ENDDATE { get; set; }
        public string? CREATEDUSER { get; set; }
        public string? STATUS { get; set; }
        public string? TYPE {get;set;}
    }
}