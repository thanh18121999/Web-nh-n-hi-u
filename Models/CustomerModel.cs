using System.ComponentModel.DataAnnotations;
namespace Project.Models
{
    public class Customer
    {
        [Key] 
        public int ID { get; set; }
        public string? USERNAME {get;set;}
        public string? CODE {get;set;}
        public string? NAME {get;set;}
        public int SEX {get;set;}
        public string? IDENTIFY {get;set;}
        public string? EMAIL {get;set;}
        public string? PHONE {get;set;}
        [DataType(DataType.Date)]
        public DateTime CREATEDDATE { get; set; }
        public string? STATUS { get; set; }
        public string? Password {get;set;}
        public string? PasswordHash {get;set;}

    }
}