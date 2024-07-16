using AutoMapper;
using BE.DTOs;
using BE.DTOs.DepartmentDto;
using BE.DTOs.DoctorDto;
using BE.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Định nghĩa các quy tắc ánh xạ ở đây
        CreateMap<AccountDoctor, Account>().ReverseMap();
        //CreateMap<AnotherSourceClass, AnotherDestinationClass>();
        //// Các ánh xạ khác...
        CreateMap<Appointment, AppointmentDto>().ReverseMap();
        CreateMap<Doctor, DoctorAppointment>().ReverseMap();
        CreateMap<Department, DepartmentAppointment>().ReverseMap();
    }
}
