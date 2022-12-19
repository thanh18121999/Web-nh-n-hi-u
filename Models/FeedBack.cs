using System.ComponentModel.DataAnnotations;

namespace Project.Models
{
    public class CourseFeedBack
    {
        public int ID { get; set; }
        public int IDUSER {get;set;}
        public int IDCOURSE {get;set;}
        public string? FEEDBACK {get;set;}
        [DataType(DataType.Date)]
        public DateTime CREATEDDATE { get; set; }
        public int? Rating { get; set; }
    }
}