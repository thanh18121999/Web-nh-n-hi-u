using System;
namespace Project.Models
{
    public class QA
    {
        public int ID { get; set; }
        public int IDQUESTIONUSER { get; set; }
        public int IDANSWERUSER{ get; set; }
        public string? QUESTION { get; set; }
        public string? ANSWER { get; set; }
        public int? ASSIGNEXPERT { get; set; }
        public int? NEEDASSIGN { get; set; }
        public int STATUS { get; set; }
    }
}

