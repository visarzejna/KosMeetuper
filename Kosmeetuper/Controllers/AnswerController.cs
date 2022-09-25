using Kosmeetuper.Models;
using Microsoft.AspNetCore.Mvc;
using System;

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
        public JsonResult Send(Answer answer)
        {
            var newAnswer = new Answer
            {
                Question = answer.Question,
                Response = answer.Response,
                CreatedAt = DateTime.Now
            };
            if (newAnswer == null)
            {
                return new JsonResult("Please Fill all fields!");
            }
            _repository.Add(newAnswer);
            return new JsonResult("FAQ added succesfully.");
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

