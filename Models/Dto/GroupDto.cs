using System.ComponentModel.DataAnnotations;

namespace Project.Models.Dto
{
    public class GroupDto
    {
        public int ID { get; set; }
        public string? CODE {get;set;}
        public string? NAME {get;set;}
        public string? DESCRIPTION {get;set;}
        public DateTime CREATEDDATE { get; set; }
        public string? CREATEDUSER { get; set; }
        public string? STATUS { get; set; }

        public IEnumerable<StaffDto>? ListStaff {get;set;} 
    }
}