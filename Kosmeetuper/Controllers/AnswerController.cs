using Kosmeetuper.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kosmeetuper.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly IAnswerRepository _repository;
        public AnswerController(IAnswerRepository repository)
        {
            _repository = repository;
        }
        [HttpPost]
        public IActionResult Send(Answer answer)
        {
            var newAnswer = new Answer
            {
                Question = answer.Question,
                Response = answer.Response,
            };
            if (newAnswer == null)
            {
                return BadRequest("Empty answer!");
            }
            return Created("Feedback sent succesfully.", _repository.Add(newAnswer));
        }

        [HttpGet]
        public JsonResult Get()
        {
            var answer = _repository.GetAll();
            if (answer == null)
            {
                return new JsonResult("No Messages in the database!");
            }
            return new JsonResult(answer);
        }

        [HttpDelete("{id}")]

        public JsonResult Deleted(int id)
        {
            Answer item = _repository.GetById(id);
            if (item == null)
            {
                return new JsonResult("Message Doesn't Exist!");
            }

            _repository.Remove(id);
            return new JsonResult("Message deleted succesfully.");
        }
    }
}

