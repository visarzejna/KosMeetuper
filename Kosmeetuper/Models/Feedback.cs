using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Kosmeetuper.Models
{
    public class Feedback
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        public string Name { get; set; }
        
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Message is required.")]
        public string MessageDescription { get; set; }

        public DateTime CreatedAt{ get; set; }

    }
}
