using System.Collections.Generic;
using System.Linq;

namespace Kosmeetuper.Models
{
    public class AnswerRepository : IAnswerRepository
    {
        private readonly KosmeetuperDbContext _context;

        public AnswerRepository(KosmeetuperDbContext context)
        {
            _context = context;
        }
        public Answer Add(Answer item)
        {
            _context.Answers.Add(item);
            item.Id = _context.SaveChanges();

            return item;
        }

        public IEnumerable<Answer> GetAll()
        {
            return _context.Answers.ToList();
        }

        public Answer GetById(int id)
        {
            return _context.Answers.FirstOrDefault(a => a.Id == id);
        }

        public void Remove(int id)
        {
            _context.Remove(_context.Answers.Single(a => a.Id == id));
            _context.SaveChanges();
        }
    }
}
