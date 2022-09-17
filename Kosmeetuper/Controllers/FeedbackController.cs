using Kosmeetuper.Models;
using Microsoft.AspNetCore.Mvc;

namespace Kosmeetuper.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IFeedbackRepository _repository;
        public FeedbackController(IFeedbackRepository repository)
        {
            _repository = repository;
        }
        [HttpPost]
        public IActionResult Send(Feedback feedback)
        {
            var newFeedback = new Feedback
            {
                Name = feedback.Name,
                Email = feedback.Email,
                MessageDescription = feedback.MessageDescription
            };

            return Created("Feedback sent succesfully.", _repository.Add(newFeedback));
        }

        [HttpGet]
        public JsonResult Get()
        {
            var feedback = _repository.GetAll();
            return new JsonResult(feedback);
        }

        [HttpDelete("{id}")]

        public JsonResult Deleted(int id)
        {
            Feedback item = _repository.GetById(id);
            if (item == null)
            {
                return new JsonResult("Message Doesn't Exist!");
            }

            _repository.Remove(id);
            return new JsonResult("Message deleted succesfully.");
        }
        }
}
