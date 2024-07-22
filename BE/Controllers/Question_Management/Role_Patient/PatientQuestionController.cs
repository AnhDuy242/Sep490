﻿using AutoMapper;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Question_Management.Role_Patient
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class PatientQuestionController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public PatientQuestionController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost] 
        public async Task<IActionResult> CreateQuestion(int pid, string question, int depId)
        {
           var q = new Question()
           {
               PatientId = pid,
               QuesDate = DateTime.Now,
               DepId = depId,
               Question1 = question
           };
        }
    }
}
