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
    public virtual DbSet<Message> Messages { get; set; }
    public virtual DbSet<Conversation> Conversations { get; set; }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<AggregatedCounter> AggregatedCounters { get; set; }

    public virtual DbSet<Appointment> Appointments { get; set; }

    public virtual DbSet<ArticleManager> ArticleManagers { get; set; }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<Counter> Counters { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Doctor> Doctors { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<FeedbackRe> FeedbackRes { get; set; }

    public virtual DbSet<Hash> Hashes { get; set; }

    public virtual DbSet<Img> Imgs { get; set; }

    public virtual DbSet<Job> Jobs { get; set; }

    public virtual DbSet<JobParameter> JobParameters { get; set; }

    public virtual DbSet<JobQueue> JobQueues { get; set; }

    public virtual DbSet<List> Lists { get; set; }

    public virtual DbSet<MedicalNotebook> MedicalNotebooks { get; set; }

    public virtual DbSet<Patient> Patients { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Receptionist> Receptionists { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Schedule> Schedules { get; set; }

    public virtual DbSet<Schema> Schemas { get; set; }

    public virtual DbSet<Server> Servers { get; set; }

    public virtual DbSet<Service> Services { get; set; }
    public virtual DbSet<ServiceDetail> ServiceDetail { get; set; }

    public virtual DbSet<Set> Sets { get; set; }

    public virtual DbSet<Slot> Slots { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<TestResult> TestResults { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var ConnectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetConnectionString("DefaultConnection");
            optionsBuilder.UseSqlServer(ConnectionString);
        }

    }
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

        modelBuilder.Entity<AggregatedCounter>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK_HangFire_CounterAggregated");

            entity.ToTable("AggregatedCounter", "HangFire");

            entity.HasIndex(e => e.ExpireAt, "IX_HangFire_AggregatedCounter_ExpireAt").HasFilter("([ExpireAt] IS NOT NULL)");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
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
            entity.Property(e => e.ScheduleId).HasColumnName("schedule_id");
            entity.Property(e => e.ServiceId).HasColumnName("service_id");
            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.Status).HasColumnName("status");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.DoctorId)
                .HasConstraintName("FK_Appointment_Doctor");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Appointment_Patient");

            entity.HasOne(d => d.Schedule).WithMany(p => p.AppointmentsNavigation)
                .HasForeignKey(d => d.ScheduleId)
                .HasConstraintName("FK_Appointment_Schedule");

            entity.HasOne(d => d.Service).WithMany(p => p.Appointments)
                .HasForeignKey(d => d.ServiceId)
                .HasConstraintName("FK_Appointment_Service");

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
        modelBuilder.Entity<Message>()
             .HasOne(m => m.Conversation)
             .WithMany(c => c.Messages)
             .HasForeignKey(m => m.ConversationId);

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

        modelBuilder.Entity<Counter>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Id }).HasName("PK_HangFire_Counter");

            entity.ToTable("Counter", "HangFire");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
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
            entity.Property(e => e.Description)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .HasColumnName("gender");
            entity.Property(e => e.Img)
                .IsUnicode(false)
                .HasColumnName("img");
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

            entity.HasMany(d => d.Services).WithMany(p => p.Docs)
                .UsingEntity<Dictionary<string, object>>(
                    "DoctorService",
                    r => r.HasOne<Service>().WithMany()
                        .HasForeignKey("ServiceId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_DoctorService_Service"),
                    l => l.HasOne<Doctor>().WithMany()
                        .HasForeignKey("DocId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_DoctorService_Doctor"),
                    j =>
                    {
                        j.HasKey("DocId", "ServiceId");
                        j.ToTable("DoctorService");
                        j.IndexerProperty<int>("DocId").HasColumnName("doc_id");
                        j.IndexerProperty<int>("ServiceId").HasColumnName("service_id");
                    });
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
                .ValueGeneratedOnAdd()
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

        modelBuilder.Entity<Hash>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Field }).HasName("PK_HangFire_Hash");

            entity.ToTable("Hash", "HangFire");

            entity.HasIndex(e => e.ExpireAt, "IX_HangFire_Hash_ExpireAt").HasFilter("([ExpireAt] IS NOT NULL)");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Field).HasMaxLength(100);
        });

        modelBuilder.Entity<Img>(entity =>
        {
            entity.ToTable("Img");

            entity.Property(e => e.ImgId).HasColumnName("img_id");
            entity.Property(e => e.BlogId).HasColumnName("blog_id");
            entity.Property(e => e.ImgUrl)
                .IsUnicode(false)
                .HasColumnName("img_url");

            entity.HasOne(d => d.Blog).WithMany(p => p.Imgs)
                .HasForeignKey(d => d.BlogId)
                .HasConstraintName("FK_Img_Blog");
        });

        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_HangFire_Job");

            entity.ToTable("Job", "HangFire");

            entity.HasIndex(e => e.ExpireAt, "IX_HangFire_Job_ExpireAt").HasFilter("([ExpireAt] IS NOT NULL)");

            entity.HasIndex(e => e.StateName, "IX_HangFire_Job_StateName").HasFilter("([StateName] IS NOT NULL)");

            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
            entity.Property(e => e.StateName).HasMaxLength(20);
        });

        modelBuilder.Entity<JobParameter>(entity =>
        {
            entity.HasKey(e => new { e.JobId, e.Name }).HasName("PK_HangFire_JobParameter");

            entity.ToTable("JobParameter", "HangFire");

            entity.Property(e => e.Name).HasMaxLength(40);

            entity.HasOne(d => d.Job).WithMany(p => p.JobParameters)
                .HasForeignKey(d => d.JobId)
                .HasConstraintName("FK_HangFire_JobParameter_Job");
        });

        modelBuilder.Entity<JobQueue>(entity =>
        {
            entity.HasKey(e => new { e.Queue, e.Id }).HasName("PK_HangFire_JobQueue");

            entity.ToTable("JobQueue", "HangFire");

            entity.Property(e => e.Queue).HasMaxLength(50);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.FetchedAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<List>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Id }).HasName("PK_HangFire_List");

            entity.ToTable("List", "HangFire");

            entity.HasIndex(e => e.ExpireAt, "IX_HangFire_List_ExpireAt").HasFilter("([ExpireAt] IS NOT NULL)");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<MedicalNotebook>(entity =>
        {
            entity.ToTable("Medical_notebook");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DateCreate)
                .HasColumnType("date")
                .HasColumnName("date_create");
            entity.Property(e => e.Diagnostic).HasColumnName("diagnostic");
            entity.Property(e => e.DoctorId).HasColumnName("doctor_id");
            entity.Property(e => e.PatientId).HasColumnName("patient_id");
            entity.Property(e => e.Prescription).HasColumnName("prescription");

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
            entity.Property(e => e.Check).HasColumnName("check");
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
        // Configure Conversation entity
        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Conversation_Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.CreatedAt)
                .IsRequired();

            entity.HasMany(e => e.Messages)
                .WithOne(e => e.Conversation)
                .HasForeignKey(e => e.ConversationId);
        });

        // Configure Message entity
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.MessageText)
                .HasMaxLength(1000);

            entity.Property(e => e.ImageUrl)
                .HasMaxLength(2000);

            entity.Property(e => e.SentAt)
                .IsRequired();

            entity.Property(e => e.IsRead)
                .IsRequired();

            entity.HasOne(e => e.Conversation)
                .WithMany(e => e.Messages)
                .HasForeignKey(e => e.ConversationId);
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

            entity.HasOne(d => d.Dep).WithMany(p => p.Questions)
                .HasForeignKey(d => d.DepId)
                .HasConstraintName("FK_Question_Department");

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
            entity.Property(e => e.Weekdays)
                .HasMaxLength(50)
                .HasColumnName("weekdays");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Schedules)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Schedule_Doctor");
        });

        modelBuilder.Entity<Schema>(entity =>
        {
            entity.HasKey(e => e.Version).HasName("PK_HangFire_Schema");

            entity.ToTable("Schema", "HangFire");

            entity.Property(e => e.Version).ValueGeneratedNever();
        });

        modelBuilder.Entity<Server>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_HangFire_Server");

            entity.ToTable("Server", "HangFire");

            entity.HasIndex(e => e.LastHeartbeat, "IX_HangFire_Server_LastHeartbeat");

            entity.Property(e => e.Id).HasMaxLength(200);
            entity.Property(e => e.LastHeartbeat).HasColumnType("datetime");
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
        modelBuilder.Entity<ServiceDetail>()
              .HasOne(sd => sd.Service)
              .WithMany(s => s.ServiceDetails) // Assuming Service has a collection of ServiceDetails
              .HasForeignKey(sd => sd.ServiceId);
        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => new { e.Key, e.Value }).HasName("PK_HangFire_Set");

            entity.ToTable("Set", "HangFire");

            entity.HasIndex(e => e.ExpireAt, "IX_HangFire_Set_ExpireAt").HasFilter("([ExpireAt] IS NOT NULL)");

            entity.HasIndex(e => new { e.Key, e.Score }, "IX_HangFire_Set_Score");

            entity.Property(e => e.Key).HasMaxLength(100);
            entity.Property(e => e.Value).HasMaxLength(256);
            entity.Property(e => e.ExpireAt).HasColumnType("datetime");
        });

        modelBuilder.Entity<Slot>(entity =>
        {
            entity.ToTable("Slot");

            entity.Property(e => e.SlotId).HasColumnName("slot_id");
            entity.Property(e => e.Shift).HasColumnName("shift");
            entity.Property(e => e.Time)
                .IsUnicode(false)
                .HasColumnName("time");
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => new { e.JobId, e.Id }).HasName("PK_HangFire_State");

            entity.ToTable("State", "HangFire");

            entity.HasIndex(e => e.CreatedAt, "IX_HangFire_State_CreatedAt");

            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(20);
            entity.Property(e => e.Reason).HasMaxLength(100);

            entity.HasOne(d => d.Job).WithMany(p => p.States)
                .HasForeignKey(d => d.JobId)
                .HasConstraintName("FK_HangFire_State_Job");
        });
        modelBuilder.Entity<TestResult>(entity =>
        {
            entity.HasKey(e => e.ImgId);

            entity.ToTable("Test_result");

            entity.Property(e => e.ImgId).HasColumnName("img_id");
            entity.Property(e => e.ImgUrl)
                .IsUnicode(false)
                .HasColumnName("img_url");
            entity.Property(e => e.MId).HasColumnName("m_id");

            entity.HasOne(d => d.MIdNavigation).WithMany(p => p.TestResults)
                .HasForeignKey(d => d.MId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Test_result_Medical_notebook");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
