namespace Project.Models.Dto
{
    public class StaffDto
    {
        public int ID { get; set; }
        public string? CODE {get;set;}
        public string? USERNAME {get;set;}

        public string? NAME {get;set;}
        public int SEX {get;set;}
        public string? IDENTIFY {get;set;}
        public string? EMAIL {get;set;}
        public string? PHONE {get;set;}
        public string? TITLE { get; set; }
        public DateTime STARTWORKDATE { get; set; }
        public string? STATUS { get; set; }
        public int LEVEL { get; set; }
    }
    public class StaffLoginDto : StaffDto
    {
        public string? TOKEN {get;set;}
    }
}