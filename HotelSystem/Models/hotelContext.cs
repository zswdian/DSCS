using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HotelSystem.Models
{
    public partial class hotelContext : DbContext
    {
        public hotelContext()
        {
        }

        public hotelContext(DbContextOptions<hotelContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Checkout> Checkout { get; set; }
        public virtual DbSet<Customer> Customer { get; set; }
        public virtual DbSet<Customertype> Customertype { get; set; }
        public virtual DbSet<Livein> Livein { get; set; }
        public virtual DbSet<Member> Member { get; set; }
        public virtual DbSet<Operator> Operator { get; set; }
        public virtual DbSet<Roominfo> Roominfo { get; set; }
        public virtual DbSet<Roomtype> Roomtype { get; set; }

        // Unable to generate entity type for table 'dbo.hotelinfo'. Please see the warning messages.

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=.;Database=hotel;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Checkout>(entity =>
            {
                entity.HasKey(e => e.ChkNo);

                entity.ToTable("checkout");

                entity.Property(e => e.ChkNo)
                    .HasColumnName("chk_no")
                    .ValueGeneratedNever();

                entity.Property(e => e.ChkTime)
                    .HasColumnName("chk_time")
                    .HasColumnType("datetime");

                entity.Property(e => e.Days).HasColumnName("days");

                entity.Property(e => e.InNo).HasColumnName("in_no");

                entity.Property(e => e.Money).HasColumnName("money");

                entity.Property(e => e.OperatorId).HasColumnName("operator_id");

                entity.HasOne(d => d.InNoNavigation)
                    .WithMany(p => p.Checkout)
                    .HasForeignKey(d => d.InNo)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__checkout__in_no__4CA06362");

                entity.HasOne(d => d.Operator)
                    .WithMany(p => p.Checkout)
                    .HasForeignKey(d => d.OperatorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__checkout__operat__4D94879B");
            });

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("customer");

                entity.Property(e => e.CustomerId)
                    .HasColumnName("customer_id")
                    .ValueGeneratedNever();

                entity.Property(e => e.CredentialNo)
                    .IsRequired()
                    .HasColumnName("credential_no")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.CredentialType)
                    .IsRequired()
                    .HasColumnName("credential_type")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.CustomerName)
                    .IsRequired()
                    .HasColumnName("customer_name")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Sex)
                    .IsRequired()
                    .HasColumnName("sex")
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.TypeId).HasColumnName("type_id");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Customer)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__customer__type_i__4316F928");
            });

            modelBuilder.Entity<Customertype>(entity =>
            {
                entity.HasKey(e => e.TypeId);

                entity.ToTable("customertype");

                entity.Property(e => e.TypeId)
                    .HasColumnName("type_id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Discount).HasColumnName("discount");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Livein>(entity =>
            {
                entity.HasKey(e => e.InNo);

                entity.ToTable("livein");

                entity.Property(e => e.InNo)
                    .HasColumnName("in_no")
                    .ValueGeneratedNever();

                entity.Property(e => e.CustomerId)
                    .IsRequired()
                    .HasColumnName("customer_id")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Days).HasColumnName("days");

                entity.Property(e => e.InTime)
                    .HasColumnName("in_time")
                    .HasColumnType("datetime");

                entity.Property(e => e.Money).HasColumnName("money");

                entity.Property(e => e.OperatorId).HasColumnName("operator_id");

                entity.Property(e => e.PersonNum).HasColumnName("person_num");

                entity.Property(e => e.RoomId).HasColumnName("room_id");

                entity.HasOne(d => d.Operator)
                    .WithMany(p => p.Livein)
                    .HasForeignKey(d => d.OperatorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__livein__operator__49C3F6B7");

                entity.HasOne(d => d.Room)
                    .WithMany(p => p.Livein)
                    .HasForeignKey(d => d.RoomId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__livein__room_id__48CFD27E");
            });

            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.MId);

                entity.ToTable("member");

                entity.Property(e => e.MId)
                    .HasColumnName("m_id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Address)
                    .HasColumnName("address")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CreadentialNo)
                    .IsRequired()
                    .HasColumnName("creadential_no")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.CredentialType)
                    .IsRequired()
                    .HasColumnName("credential_type")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.MName)
                    .IsRequired()
                    .HasColumnName("m_name")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.MTel)
                    .IsRequired()
                    .HasColumnName("m_tel")
                    .HasMaxLength(11)
                    .IsUnicode(false);

                entity.Property(e => e.Sex)
                    .IsRequired()
                    .HasColumnName("sex")
                    .HasMaxLength(1)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Operator>(entity =>
            {
                entity.ToTable("operator");

                entity.Property(e => e.OperatorId)
                    .HasColumnName("operator_id")
                    .ValueGeneratedNever();

                entity.Property(e => e.OperatorName)
                    .IsRequired()
                    .HasColumnName("operator_name")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Pwd)
                    .IsRequired()
                    .HasColumnName("pwd")
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Roominfo>(entity =>
            {
                entity.HasKey(e => e.RoomId);

                entity.ToTable("roominfo");

                entity.Property(e => e.RoomId)
                    .HasColumnName("room_id")
                    .ValueGeneratedNever();

                entity.Property(e => e.Remark)
                    .HasColumnName("remark")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.State)
                    .IsRequired()
                    .HasColumnName("state")
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.Statetime)
                    .HasColumnName("statetime")
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.TypeId).HasColumnName("type_id");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Roominfo)
                    .HasForeignKey(d => d.TypeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__roominfo__type_i__3F466844");
            });

            modelBuilder.Entity<Roomtype>(entity =>
            {
                entity.HasKey(e => e.TypeId);

                entity.ToTable("roomtype");

                entity.Property(e => e.TypeId)
                    .HasColumnName("type_id")
                    .ValueGeneratedNever();

                entity.Property(e => e.BedNum).HasColumnName("bed_num");

                entity.Property(e => e.ClPrice).HasColumnName("cl_price");

                entity.Property(e => e.ClRoom)
                    .IsRequired()
                    .HasColumnName("cl_room")
                    .HasMaxLength(1)
                    .IsUnicode(false);

                entity.Property(e => e.Foregift).HasColumnName("foregift");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });
        }
    }
}
