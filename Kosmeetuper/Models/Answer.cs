using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kosmeetuper.Models
{
    public class Answer
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Question { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Response { get; set; }
    }
}
