using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BE.Models;

public partial class MedPalContext : DbContext
{
    public MedPalContext()
    {
    }

    public MedPalContext(DbContextOptions<MedPalContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<ArticleManager> ArticleManagers { get; set; }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<FeedbackRe> FeedbackRes { get; set; }

    public virtual DbSet<Img> Imgs { get; set; }

    public virtual DbSet<MedicalNotebook> MedicalNotebooks { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Receptionist> Receptionists { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Service> Services { get; set; }

    public virtual DbSet<Slot> Slots { get; set; }

    public virtual DbSet<Week> Weeks { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("server=DUCANH\\SQLEXPRESS; database=MedPal;uid=sa;pwd=123456;Trusted_Connection=True;Encrypt=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccId);

            entity.ToTable("Account");

            entity.Property(e => e.AccId).HasColumnName("acc_id");
            entity.Property(e => e.Email)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Password)
                .IsUnicode(false)
                .HasColumnName("password");
            entity.Property(e => e.Phone)
                .HasMaxLength(11)
                .HasColumnName("phone");
            entity.Property(e => e.RoleId).HasColumnName("role_id");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Account_Role");
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.ToTable("Admin");

            entity.Property(e => e.AdminId)
                .ValueGeneratedNever()
                .HasColumnName("admin_id");
            entity.Property(e => e.Dob)
                .HasColumnType("date")
                .HasColumnName("dob");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasOne(d => d.AdminNavigation).WithOne(p => p.Admin)
                .HasForeignKey<Admin>(d => d.AdminId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Admin_Account");
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.ToTable("Appointment");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Date)
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.Note).HasColumnName("note");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointment_Doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointment_Patient");

            entity.HasOne(d => d.Slot).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.SlotId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointment_Slot");
        });

        modelBuilder.Entity<ArticleManager>(entity =>
        {
            entity.HasKey(e => e.AId).HasName("PK_Receptionist");

            entity.ToTable("Article_manager");

            entity.Property(e => e.AId)
                .ValueGeneratedNever()
                .HasColumnName("a_id");
            entity.Property(e => e.Dob)
                .HasColumnType("date")
                .HasColumnName("dob");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasOne(d => d.AIdNavigation).WithOne(p => p.ArticleManager)
                .HasForeignKey<ArticleManager>(d => d.AId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Article_manager_Account");
        });

        modelBuilder.Entity<Blog>(entity =>
        {
            entity.ToTable("Blog");

            entity.Property(e => e.BlogId).HasColumnName("blog_id");
            entity.Property(e => e.AId).HasColumnName("a_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Date)
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.DocId).HasColumnName("doc_id");
            entity.Property(e => e.Thumbnail).HasColumnName("thumbnail");
            entity.Property(e => e.Title).HasColumnName("title");

            entity.HasOne(d => d.AIdNavigation).WithMany(p => p.Blogs)
                .HasForeignKey(d => d.AId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Blog_Article_manager");

            entity.HasOne(d => d.Doc).WithMany(p => p.Blogs)
                .HasForeignKey(d => d.DocId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Blog_Doctor");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DepId);

            entity.ToTable("Department");

            entity.Property(e => e.DepId).HasColumnName("dep_id");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.DocId);

            entity.ToTable("Doctor");

            entity.Property(e => e.DocId)
                .ValueGeneratedNever()
                .HasColumnName("doc_id");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.DepId).HasColumnName("dep_id");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasOne(d => d.Dep).WithMany(p => p.Doctors)
                .HasForeignKey(d => d.DepId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Doctor_Department");

            entity.HasOne(d => d.Doc).WithOne(p => p.Doctor)
                .HasForeignKey<Doctor>(d => d.DocId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Doctor_Account");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedId);

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedId).HasColumnName("feed_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Date)
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Star).HasColumnName("star");

            entity.HasOne(d => d.Patient).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Feedback_Patient");
        });

        modelBuilder.Entity<FeedbackRe>(entity =>
        {
            entity.HasKey(e => e.ResId);

            entity.ToTable("Feedback_res");

            entity.Property(e => e.ResId)
                .ValueGeneratedNever()
                .HasColumnName("res_id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Date)
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.FeedId).HasColumnName("feed_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.RecepId).HasColumnName("recep_id");

            entity.HasOne(d => d.Feed).WithMany(p => p.FeedbackRes)
                .HasForeignKey(d => d.FeedId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Feedback_res_Feedback");

            entity.HasOne(d => d.Recep).WithMany(p => p.FeedbackRes)
                .HasForeignKey(d => d.RecepId)
                .HasConstraintName("FK_Feedback_res_Receprionist");
        });

        modelBuilder.Entity<Img>(entity =>
        {
            entity.ToTable("Img");

            entity.Property(e => e.ImgId)
                .ValueGeneratedNever()
                .HasColumnName("img_id");
            entity.Property(e => e.BlogId).HasColumnName("blog_id");
            entity.Property(e => e.ImgUrl)
                .IsUnicode(false)
                .HasColumnName("img_url");

            entity.HasOne(d => d.Blog).WithMany(p => p.Imgs)
                .HasForeignKey(d => d.BlogId)
                .HasConstraintName("FK_Img_Blog");
        });

        modelBuilder.Entity<MedicalNotebook>(entity =>
        {
            entity.ToTable("Medical_notebook");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Diagnostic).HasColumnName("diagnostic");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Prescription).HasColumnName("prescription");
            entity.Property(e => e.TestResult)
                .IsUnicode(false)
                .HasColumnName("test_result");

            entity.HasOne(d => d.Doctor).WithMany(p => p.MedicalNotebooks)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Medical_notebook_Doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.MedicalNotebooks)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Medical_notebook_Patient");
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.ToTable("Patient");

            entity.Property(e => e.PatientId)
                .ValueGeneratedNever()
                .HasColumnName("patient_id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.Dob)
                .HasColumnType("date")
                .HasColumnName("dob");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasOne(d => d.PatientNavigation).WithOne(p => p.Patient)
                .HasForeignKey<Patient>(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Patient_Account");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.QuesId);

            entity.ToTable("Question");

            entity.Property(e => e.QuesId).HasColumnName("ques_id");
            entity.Property(e => e.AnsDate)
                .HasColumnType("date")
                .HasColumnName("ans_date");
            entity.Property(e => e.Answer).HasColumnName("answer");
            entity.Property(e => e.DepId).HasColumnName("dep_id");
            entity.Property(e => e.DocId).HasColumnName("doc_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.QuesDate)
                .HasColumnType("date")
                .HasColumnName("ques_date");
            entity.Property(e => e.Question1).HasColumnName("question");

            entity.HasOne(d => d.Doc).WithMany(p => p.Questions)
                .HasForeignKey(d => d.DocId)
                .HasConstraintName("FK_Question_Doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.Questions)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Question_Patient");
        });

        modelBuilder.Entity<Receptionist>(entity =>
        {
            entity.HasKey(e => e.RecepId).HasName("PK_Receprionist");

            entity.ToTable("Receptionist");

            entity.Property(e => e.RecepId)
                .ValueGeneratedNever()
                .HasColumnName("recep_id");
            entity.Property(e => e.Dob)
                .HasColumnType("date")
                .HasColumnName("dob");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasOne(d => d.Recep).WithOne(p => p.Receptionist)
                .HasForeignKey<Receptionist>(d => d.RecepId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Receprionist_Account");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.Property(e => e.RoleId).HasColumnName("role_id");
            entity.Property(e => e.RoleName).HasColumnName("role_name");
        });

        modelBuilder.Entity<Schedule>(entity =>
        {
            entity.ToTable("Schedule");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Afternoon).HasColumnName("afternoon");
            entity.Property(e => e.Appointments).HasColumnName("appointments");
            entity.Property(e => e.Date)
                .HasColumnType("date")
                .HasColumnName("date");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.Morning).HasColumnName("morning");
            entity.Property(e => e.WeekId).HasColumnName("week_id");
            entity.Property(e => e.Weekdays)
                .HasMaxLength(50)
                .HasColumnName("weekdays");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Schedule_Doctor");

            entity.HasOne(d => d.Week).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.WeekId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Schedule_Week");
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.ToTable("Service");

            entity.Property(e => e.ServiceId).HasColumnName("service_id");
            entity.Property(e => e.DepId).HasColumnName("dep_id");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("money")
                .HasColumnName("price");

            entity.HasOne(d => d.Dep).WithMany(p => p.Services)
                .HasForeignKey(d => d.DepId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Service_Department");
        });

        modelBuilder.Entity<Slot>(entity =>
        {
            entity.ToTable("Slot");

            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.Time)
                .IsUnicode(false)
                .HasColumnName("time");
        });

        modelBuilder.Entity<Week>(entity =>
        {
            entity.ToTable("Week");

            entity.Property(e => e.WeekId).HasColumnName("week_id");
            entity.Property(e => e.EndDate)
                .HasColumnType("date")
                .HasColumnName("end_date");
            entity.Property(e => e.StartDate)
                .HasColumnType("date")
                .HasColumnName("start_date");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
