using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Kosmeetuper.Models
{
    public interface IFeedbackRepository
    {
        IEnumerable<Feedback> GetAll();

        Feedback GetById(int id);
        Feedback Add(Feedback item);
        void Remove(int id);
    }
}
