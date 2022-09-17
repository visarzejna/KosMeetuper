using System.Collections.Generic;
using System.Linq;

namespace Kosmeetuper.Models
{
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly KosmeetuperDbContext _context;

        public FeedbackRepository(KosmeetuperDbContext context)
        {
            _context = context;
        }
        public Feedback Add(Feedback item)
        {
            _context.FeedbackMessages.Add(item);
            item.Id = _context.SaveChanges();

            return item;
        }

        public IEnumerable<Feedback> GetAll()
        {
            return _context.FeedbackMessages.ToList();
        }
        public Feedback GetById(int id)
        {
            return _context.FeedbackMessages.FirstOrDefault(f => f.Id == id);
        }

        public void Remove(int id)
        {
            _context.Remove(_context.FeedbackMessages.Single(f => f.Id == id));
            _context.SaveChanges();
        }
    }
}
