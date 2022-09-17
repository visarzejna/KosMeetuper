using System.Collections.Generic;

namespace Kosmeetuper.Models
{
    public interface IAnswerRepository
    {
        IEnumerable<Answer> GetAll();

        Answer GetById(int id);
        Answer Add(Answer item);
        void Remove(int id);
    }
}
