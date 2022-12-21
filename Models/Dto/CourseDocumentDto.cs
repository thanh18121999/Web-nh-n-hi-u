using System.ComponentModel.DataAnnotations;

namespace Project.Models.Dto
{
    public class CourseDocumentDto
    {
        public int ID { get; set; }
        public int IDCOURSE {get;set;}
        public string? NAME {get;set;}
        public string? CODE {get;set;}
        public string? DESCRIPTION {get;set;}
        [DataType(DataType.Date)]
        public DateTime CREATEDDATE { get; set; }
        public int? CREATEDUSER { get; set; }
        public string? DOWNLOADLINK {get;set;}
    }
}