﻿using AutoMapper;
using BE.DTOs;
using BE.DTOs.AppointmentDto;
using BE.DTOs.DepartmentDto;
using BE.DTOs.DoctorDto;
using BE.DTOs.ServiceDto;
using BE.DTOs.SlotDto;
using BE.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Định nghĩa các quy tắc ánh xạ ở đây
        CreateMap<AccountDoctor, Account>().ReverseMap();
        //CreateMap<AnotherSourceClass, AnotherDestinationClass>();
        //// Các ánh xạ khác...
        CreateMap<Appointment, AppointmentDto>().ForMember(dest => dest.Date, otp => otp.MapFrom(src => src.Date.Date)).ReverseMap();

      
        CreateMap<Appointment, AppointmentPatient>()
            .ForMember(dest => dest.PatientName, otp => otp.MapFrom(src => src.Patient.Name))
            .ForMember(dest => dest.DoctorName, otp => otp.MapFrom(src => src.Doctor.Name))
            .ForMember(dest => dest.ServiceName, otp => otp.MapFrom(src => src.Service.ServiceId))
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
        CreateMap<Doctor, DoctorAppointment>().ReverseMap();
        CreateMap<Service, ServiceAppointment>().ReverseMap();
        CreateMap<Department, DepartmentAppointment>().ReverseMap();
    }
}
