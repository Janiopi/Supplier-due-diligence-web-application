using DueDiligence.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace DueDiligence.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Supplier> Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuration for Supplier
            modelBuilder.Entity<Supplier>()
                .Property(p => p.TaxId)
                .HasMaxLength(11)
                .IsRequired();
            
            modelBuilder.Entity<Supplier>()
                .Property(p => p.BusinessName)
                .HasMaxLength(100)
                .IsRequired();
                
            modelBuilder.Entity<Supplier>()
                .Property(p => p.Email)
                .HasMaxLength(100);
                
            modelBuilder.Entity<Supplier>()
                .Property(p => p.AnnualRevenue)
                .HasColumnType("decimal(18,2)");
        }
    }
}