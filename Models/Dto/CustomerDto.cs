namespace Project.Models.Dto
{
    public class CustomerDto
    {
        public int ID { get; set; }
        public string? CODE {get;set;}
        public string? NAME {get;set;}
        public int SEX {get;set;}
        public string? IDENTIFY {get;set;}
        public string? EMAIL {get;set;}
        public string? PHONE {get;set;}
        public DateTime CREATEDDATE { get; set; }
        public string? STATUS { get; set; }

    }
}