using AutoMapper;
using BE.DTOs;
using BE.DTOs.AppointmentDto;
using BE.DTOs.DepartmentDto;
using BE.DTOs.DoctorDto;
using BE.DTOs.ServiceDto;
using BE.DTOs.MedicalNoteBookDro;
using BE.DTOs.ScheduleDto;
using BE.DTOs.SlotDto;
using BE.Models;
using BE.DTOs.FeedbackDto;
using BE.DTOs.QuestionDto;
using BE.DTOs.TestResultDto;
using BE.DTOs.PatientDto;
using BE.DTOs.MessageDto; // Cập nhật namespace
using BE.DTOs.ConversationDto; // Cập nhật namespace
using BE.DTOs.ArticleManagerDto;
using BE.DTOs.BlogDto;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Định nghĩa các quy tắc ánh xạ ở đây
        CreateMap<AccountDoctor, Account>().ReverseMap();
        //CreateMap<AnotherSourceClass, AnotherDestinationClass>();
        //// Các ánh xạ khác...
        /// appointment
        CreateMap<Appointment, AppointmentDto>().ForMember(dest => dest.Date, otp => otp.MapFrom(src => src.Date.Date)).ReverseMap();
        CreateMap<Appointment, AppointmentPatient>()
            .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
            .ForMember(dest => dest.DoctorName, otp => otp.MapFrom(src => src.Doctor.Name))
            .ForMember(dest => dest.ServiceName, otp => otp.MapFrom(src => src.Service.Name))
            .ForMember(dest => dest.Time, otp => otp.MapFrom(src => src.Slot.Time))
            .ForMember(dest => dest.Date, otp => otp.MapFrom(src => src.Date.Date))
            .ReverseMap();
        CreateMap<Appointment, AppointmentReceptionist>()
           .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
           .ForMember(dest => dest.DoctorName, otp => otp.MapFrom(src => src.Doctor.Name))
           .ForMember(dest => dest.Time, otp => otp.MapFrom(src => src.Slot.Time))
           .ForMember(dest => dest.Date, otp => otp.MapFrom(src => src.Date.Date))
           .ReverseMap();
        CreateMap<Slot, SlotAppointment>().ReverseMap();
        CreateMap<Schedule, DateAppointment>().ReverseMap();

        //service
        CreateMap<Service, ServiceMarketing>()
                        .ForMember(dest => dest.DepartmentName, otp => otp.MapFrom(src => src.Dep.Name))

            .ReverseMap();
        //question
        CreateMap<Question, QuestionView>()
            .ForMember(dest => dest.DepartmentName, otp => otp.MapFrom(src => src.Dep.Name))
            .ForMember(dest => dest.DoctorName, otp => otp.MapFrom(src => src.Doc.Name))
            .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
            .ReverseMap();

        //doctor
        CreateMap<Doctor, DoctorAppointment>().ReverseMap();
        CreateMap<Doctor, DoctorMarketing>()
                    .ForMember(dest => dest.AllServiceName, opt => opt.MapFrom(src => string.Join(", ", src.Services.Select(s => s.Name))))
                    .ForMember(dest => dest.AllDepartmentName, opt => opt.MapFrom(src => string.Join(", ", src.Services.Select(s => s.Dep.Name))));

        //test rs
        CreateMap<TestResult, TestResultPatient>().ReverseMap();
        //patient
        CreateMap<Patient, PatientReceptionist>()
            .ForMember(dest => dest.Phone, otp => otp.MapFrom(src => src.PatientNavigation.Phone))
            .ForMember(dest => dest.Email, otp => otp.MapFrom(src => src.PatientNavigation.Email))
            .ForMember(dest => dest.Password, otp => otp.MapFrom(src => src.PatientNavigation.Password))
            .ForMember(dest => dest.RoleId, otp => otp.MapFrom(src => src.PatientNavigation.RoleId))

            .ReverseMap();

        //feedback
        CreateMap<Feedback, FeedbackCreate>().ReverseMap();
        CreateMap<Feedback, FeedbackView>()
            .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
            .ReverseMap();

        CreateMap<Service, ServiceAppointment>().ReverseMap();
        CreateMap<Department, DepartmentAppointment>().ReverseMap();
        //MedicalNotebook
        CreateMap<MedicalNotebook, MedicalNotebookPatient>()
            .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
            .ForMember(dest => dest.DoctorName, otp => otp.MapFrom(src => src.Doctor.Name))
            .ReverseMap();
        CreateMap<Schedule, ScheduleDoctor>()
            .ForMember(dest => dest.Name, otp => otp.MapFrom(src => src.Doctor.Name)).ReverseMap();

        //message and conversation
           CreateMap<Message, MessageDto>().ReverseMap();
        CreateMap<CreateMessageDto, Message>();
        CreateMap<UpdateMessageDto, Message>();

        CreateMap<Conversation, ConversationDto>().ReverseMap();
        CreateMap<CreateConversationDto, Conversation>();
        CreateMap<UpdateConversationDto, Conversation>();

        CreateMap<CreateConversationDto, Conversation>();
        CreateMap<Conversation, ConversationDto>();

        CreateMap<Blog,BlogDto>()
          .ForMember(dest => dest.ArticleManager, opt => opt.MapFrom(src => src.AIdNavigation));

        CreateMap<ArticleManager, ArticleManagerDTO>();
        CreateMap<BlogDto, Blog>();
        CreateMap<ArticleManagerDTO, ArticleManager>();
        CreateMap<BlogDto, Blog>()
    .ForMember(dest => dest.AId, opt => opt.MapFrom(src => src.AId));
        CreateMap<EditBlogDto, Blog>()
           .ForMember(dest => dest.AId, opt => opt.Ignore()); // Ignore if the field does not match
        CreateMap<BlogDto, Blog>()
            .ForMember(dest => dest.AId, opt => opt.Ignore()); // Ignore if the field does not match


    }
}
