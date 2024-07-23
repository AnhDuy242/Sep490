using AutoMapper;
using BE.Models;
using BE.Service.IService;

namespace BE.Service.ImplService
{
    public class DoctorService : IDoctorService
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public DoctorService(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public int GetDepIdByDocId(int docId)
        {
            var doctor = _context.Doctors
                .Where(d => d.DocId == docId)
                .SelectMany(d => d.Services)
                .Select(s => s.DepId)
                .FirstOrDefault();
            return doctor;
        }
     

      
    }
}
