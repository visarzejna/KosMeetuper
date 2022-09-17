using Kosmeetuper.Models;
using Microsoft.EntityFrameworkCore;

namespace Kosmeetuper.Models
{
    public class KosmeetuperDbContext : DbContext
    {
        public KosmeetuperDbContext(DbContextOptions<KosmeetuperDbContext> options) : base(options)
        {

        }                                          
        public DbSet<Feedback> FeedbackMessages { get; set; }

        public DbSet<Answer> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

        }
    }
}
