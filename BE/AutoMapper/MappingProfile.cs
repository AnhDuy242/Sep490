using AutoMapper;
using BE.DTOs;
using BE.Models;
using BE.Models.DTOs;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Định nghĩa các quy tắc ánh xạ ở đây
        CreateMap<AccountDoctor, Account>().ReverseMap();
        //CreateMap<AnotherSourceClass, AnotherDestinationClass>();
        //// Các ánh xạ khác...
    }
}
