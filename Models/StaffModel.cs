using System.ComponentModel.DataAnnotations;

namespace Project.Models
{
    public class Staff
    {
        public int ID { get; set; }
        public string? CODE {get;set;}
        public string? NAME {get;set;}
        public int SEX {get;set;}
        public string? IDENTIFY {get;set;}
        public string? EMAIL {get;set;}
        public string? PHONE {get;set;}
        public string? TITLE { get; set; }

        [DataType(DataType.Date)]
        public DateTime STARTWORKDATE { get; set; }
        public string? STATUS { get; set; }
        public int LEVEL { get; set; }
        public string? Password {get;set;}
        public string? PasswordHash {get;set;}
    }
}