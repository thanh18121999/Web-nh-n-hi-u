using System.ComponentModel.DataAnnotations;

namespace Project.Models
{
    public class CourseDocument
    {
        public int ID { get; set; }
        public int IDCourse {get;set;}
        public string? NAME {get;set;}
        public string? DESCRIPTION {get;set;}
        [DataType(DataType.Date)]
        public DateTime CREATEDDATE { get; set; }
        public int? CREATEDUSER { get; set; }
        public string? DOCUMENT {get;set;} 
        public string? FILETYPE {get;set;}
    }
}