﻿using AutoMapper;
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
using BE.DTOs.EmployeeDto;
using CloudinaryDotNet.Core;
using BE.DTOs.AdminAccountDto;
using BE.DTOs.ServiceDto.BE.DTOs;

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
        CreateMap<UpdateDoctorAndAccountDto, Doctor>();
        CreateMap<BE.DTOs.EmployeeDto.DoctorDto, Doctor>();

        CreateMap<UpdateDoctorAndAccountDto, Account>();
        CreateMap<BE.DTOs.EmployeeDto.DoctorDto, Account>();

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
        CreateMap<UpdatePatientProfile, Patient>()
            .ForMember(dest => dest.PatientId, opt => opt.Ignore()) // Ignore PatientId since it's not in the DTO
            .ForMember(dest => dest.Gender, opt => opt.Ignore()) // Ignore Gender since it's not in the DTO
            .ForMember(dest => dest.Dob, opt => opt.Ignore()) // Ignore Dob since it's not in the DTO
            .ForMember(dest => dest.IsActive, opt => opt.Ignore()) // Ignore IsActive since it's not in the DTO
            .ForMember(dest => dest.Check, opt => opt.Ignore()) // Ignore Check since it's not in the DTO
            .ForMember(dest => dest.Appointments, opt => opt.Ignore()) // Ignore related entities
            .ForMember(dest => dest.Feedbacks, opt => opt.Ignore()) // Ignore related entities
            .ForMember(dest => dest.MedicalNotebooks, opt => opt.Ignore()) // Ignore related entities
            .ForMember(dest => dest.PatientNavigation, opt => opt.Ignore()) // Ignore related entity
            .ForMember(dest => dest.Questions, opt => opt.Ignore()); // Ignore related entities

        //feedback
        CreateMap<Feedback, FeedbackCreate>().ReverseMap();
        CreateMap<Feedback, FeedbackView>()
            .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
            .ReverseMap();
        CreateMap<Feedback, FeedbackDto>()
            .ForMember(dest => dest.FeedbackResponses, opt => opt.MapFrom(src => src.FeedbackRes));

        CreateMap<Feedback, FeedbackDto>()
          .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.Name))
          .ForMember(dest => dest.FeedbackResponses, opt => opt.MapFrom(src => src.FeedbackRes));

        CreateMap<FeedbackRe, FeedbackReDto>()
            .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Feed.Patient.Name));

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

        CreateMap<MedicalNotebook, MedicalNotebookPatient>()
          .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.Name))
          .ForMember(dest => dest.DoctorName, opt => opt.MapFrom(src => src.Doctor.Name));
        // employee account
        CreateMap<Doctor, BE.DTOs.DoctorDto.DoctorDto>();
        CreateMap<Doctor, BE.DTOs.EmployeeDto.DoctorDto>()
                  .ForMember(dest => dest.AccId, opt => opt.Ignore()) // Ignoring properties not present in Doctor
                  .ForMember(dest => dest.Email, opt => opt.Ignore())
                  .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Doc.Phone))
                  .ForMember(dest => dest.Password, opt => opt.Ignore())
                  .ForMember(dest => dest.RoleId, opt => opt.Ignore())
                  .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Dep.Name))
                  .ForMember(dest => dest.DepId, opt => opt.MapFrom(src => src.Dep.DepId));
        CreateMap<Receptionist, ReceptionistDto>();
        CreateMap<BE.DTOs.DoctorDto.DoctorDto, Doctor>();
        CreateMap<ReceptionistDto, Receptionist>();
        CreateMap<Receptionist, ReceptionistAccount>()
             .ForMember(dest => dest.AccId, opt => opt.MapFrom(src => src.RecepId))
             .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Recep.Email))
             .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Recep.Phone))
             .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Recep.Password))
             .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Recep.RoleId))
             .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.Recep.IsActive))
             .ReverseMap();
        CreateMap<Doctor, BE.DTOs.EmployeeDto.DoctorDto>()
          .ForMember(dest => dest.AccId, opt => opt.MapFrom(src => src.Doc.AccId))
          .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Doc.Email))
          .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Doc.Phone))
          .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Doc.Password))
          .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Doc.RoleId))
          .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
          .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
          .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.Age))
          .ForMember(dest => dest.Img, opt => opt.MapFrom(src => src.Img))
          .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
          .ForMember(dest => dest.DepartmentName, opt => opt.MapFrom(src => src.Dep.Name))
          .ForMember(dest => dest.DepId, opt => opt.MapFrom(src => src.DepId))
          .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.IsActive));

        // Ánh xạ Receptionist với ReceptionistDto
        CreateMap<Receptionist, ReceptionistDto>()
            .ForMember(dest => dest.AccId, opt => opt.MapFrom(src => src.Recep.AccId))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Recep.Email))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Recep.Phone))
            .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.Recep.Password))
            .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => src.Recep.RoleId))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.Dob, opt => opt.MapFrom(src => src.Dob))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.Recep.IsActive));

        //admin
        CreateMap<Admin, AdminAccountDTO>()
       .ForMember(dest => dest.Id, opt => opt.Ignore())
       .ForMember(dest => dest.Name, opt => opt.Ignore())
       .ForMember(dest => dest.Email, opt => opt.Ignore())
       .ForMember(dest => dest.Phone, opt => opt.Ignore())
       .ForMember(dest => dest.IsActive, opt => opt.Ignore())
       .ForMember(dest => dest.Password, opt => opt.Ignore());

        CreateMap<Account, AdminAccountDTO>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Name, opt => opt.Ignore())
            .ForMember(dest => dest.Email, opt => opt.Ignore())
            .ForMember(dest => dest.Phone, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.Ignore())
            .ForMember(dest => dest.Password, opt => opt.Ignore());
        //service and service detail
        CreateMap<ServiceDetail, ServiceDetailDto>()
         .ReverseMap();

        //service and department
        CreateMap<Department, DepartmentDTO>()
        .ReverseMap(); // Allows mapping from DepartmentDto back to Department

        // Mapping for Service
        CreateMap<Service, ServiceDTO>()
            .ReverseMap(); // Allows mapping from ServiceDto back to Service

        // Mapping for DepartmentWithServicesDto
        CreateMap<Department, DepartmentWithServicesDto>()
            .ForMember(dest => dest.Department, opt => opt.MapFrom(src => src))
            .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.Services))
            .ReverseMap();
        CreateMap<Account, Doctor>()
    .ForMember(dest => dest.DocId, opt => opt.MapFrom(src => src.AccId))
    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Doctor.Name)) // Ví dụ về ánh xạ thuộc tính
    .ReverseMap();

        CreateMap<ServiceDetail, ServiceDetailDto>()
            .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
            .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service.Name));

        CreateMap<Service, ServiceDTO>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name)); // Ensure this mapping exists
    }
}
