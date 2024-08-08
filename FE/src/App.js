import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDash from './pages/AdminDashBoard/index';
import DoctorAccount from './pages/AdminDashBoard/doctor_account';
import ReceptionistAccount from './pages/AdminDashBoard/receptionist_account';
import ProtectedRoute from './pages/AdminDashBoard/component/protected_route';
import ListBlog from './pages/ArticleManagement/list_blog';
import ArticleDash from './pages/ArticleManagement';
import Receptionist from '../src/pages/Receptionist'
// import ViewInforAppoint from './pages/Appointment-patient/ViewInforAppoint';
import ScheduleAdmin from './pages/AdminDashBoard/schedule_doctor_admin'
import Add_blog from './pages/ArticleManagement/add_blog';
import CreateAppointment from './pages/Appointment-patient/CreateAppointment';
import GetAppointment from '../src/pages/Appointment-patient/ViewInforAppoint';
import ReceptionistDash from '../src/pages/ReceptionistManagement';
import CreatePatientAccount from '../src/pages/ReceptionistManagement/create_patient_account';
import ApproveAppointment from '../src/pages/ReceptionistManagement/approve_appointment';
import ListDoctorView from './pages/DoctorList'
import MedicalNotebook_ForPatient from '../src/pages/MedicalNotebook-patient';
import ViewAllNotebooks from './pages/ReceptionistManagement/view_notebooks'
import DoctorDash from '../src/pages/DoctorManagement';
import CreateNoteBook from '../src/pages/DoctorManagement/doctormanagement'
import PatientViewQuestion from './pages/PatientAskQuestion/index'
import Create_CustomerFeedback from './pages/Feedback/Create_CustomerFeedback'
import DoctorAnswerQuestion from './pages/DoctorManagement/AnswerQuestion/doctor_answer_question'
import ViewOnlinePatient_forDoctor from './pages/DoctorManagement/ViewOnlinePatient_Doctor/ViewOnlinePatient_Doctor';
import ViewWeeklySchedule_Doctor from './pages/DoctorManagement/ViewWeeklySchedule_Doctor/ViewWeeklySchedule_Doctor'
import About1 from '../src/pages/Article/baiviet1'
import About2 from './pages/Article/baiviet2'
import About3 from './pages/Article/baiviet3'
import About from './pages/Article/index'
import AdminViewAppointment from './pages/AdminDashBoard/view_appointment';
import ExaminatedPatients from './pages/DoctorManagement/ExaminatedPatient_Doctor/ExaminatedPatient_Doctor';
import DoctorAndMedicalNotebooks from './pages/DoctorInteraction-patient/DoctorInteraction';
import ListPatientQuestion from './pages/PatientAskQuestion/patient_question_list'
import MedicalNotebookList from './pages/DoctorManagement/Medicalnotebook_save_Doctor/Medicalnotebook_save';
import DoctorProfile from './pages/DoctorManagement/Profile/DoctorProfile';
import Profile from './pages/Appointment-patient/PatientProfile';
import ReceptionistProfile from './pages/ReceptionistManagement/component/ReceptionistProfile';
import AdminProfile from './pages/AdminDashBoard/component/admin_profile';
import BlogList from './pages/Blog';
import BlogDetail from './pages/Blog/BlogDetails';
import DoctorDetail from './pages/DoctorList/DoctorDetail';
import FeedbackPage from './pages/ReceptionistManagement/feedback_receptionist';
import EmployeeList from './pages/AdminDashBoard/EmployeeManagement/EmployeeManagement';
import ServiceDetail from './pages/Home/component/PolyServ/ServiceDetail';
import ForgotPasswordForm from './layouts/ForgotPassword';
import PasswordSent from './layouts/ForgotPassword/PasswordSent';
import AppointmentsDoctor from './pages/DoctorManagement/getAppointment_Doctor/Appointment_Doctor';
import DepartmentList from './pages/Home/component/PolyServ/DepartmentList';
import ServiceListPage from './pages/Home/component/PolyServ/ServiceList';
import SearchServiceResult from './pages/Home/component/PolyServ/searchServiceResult';
function App() {
  return (
    <Routes>
      {/**Route hướng home */}
      <Route path="/" element={<Home />} >
      </Route>
      {/**các bài viết giới thiệu */}
      <Route path="/about-clinic" element={<About1 />} />
      <Route path="/about" element={<About />} />
      <Route path="/trang-thiet-bi-tai-phong-kham" element={<About3 />} />
      <Route path="/viewAllBlogs" element={<BlogList />} />
      <Route path="/viewDetailBlog/:id" element={<BlogDetail />} />
      <Route path="/viewDoctorDetail/:id" element={<DoctorDetail />} />
      <Route path="/servicesList/:depId" element={<ServiceListPage />} />
      <Route path="/departmentsList" element={<DepartmentList/>} />
      <Route path="/searchServicesList" element={<SearchServiceResult/>} />

      <Route path="/servicesDetail/:serviceId" element={<ServiceDetail />} />

      {/**Route admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="Admin"><AdminDash /></ProtectedRoute>}>
        <Route path="doctor-account" element={<DoctorAccount />} />
        <Route path="admin-profile" element={<AdminProfile />} />
        <Route path="receptionist-account" element={<ReceptionistAccount />} />
        <Route path="/admin/dashboard/EmployeeManagement" element={<EmployeeList />} />

        <Route path="/admin/dashboard/schedule" element={<ScheduleAdmin />} />
        <Route path="/admin/dashboard/ViewAppointment" element={<AdminViewAppointment />} />
      </Route>
      <Route path="/receptionist-account" element={<ProtectedRoute requiredRole="Receptionist">< Receptionist /></ProtectedRoute>} />

      <Route path="/article/dashboard" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="list_blog" element={<ListBlog />} />
      </Route>
      {/*Article*/}
      <Route path="/article/dashboard/" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="/article/dashboard/list_blog" element={<ListBlog />} />
        <Route path="/article/dashboard/add_blog" element={<Add_blog />} />
      </Route>
      {/*Receptionist*/}
      <Route path="/receptionist/dashboard/" element={<ProtectedRoute requiredRole="Receptionist"><ReceptionistDash /></ProtectedRoute>}>
        <Route path="create_patient_account" element={<CreatePatientAccount />} />
        <Route path="Approve_appointment" element={<ApproveAppointment />} />
        <Route path="ViewAllPatientMedicalNotebooks" element={<ViewAllNotebooks/>} />
        <Route path="receptionist-profile" element={<ReceptionistProfile />} />
        <Route path="/receptionist/dashboard/feedback-receptionist" element={<FeedbackPage/>} />

      </Route>
      {/**Route article */}
      <Route path="/article/dashboard/" element={<ProtectedRoute requiredRole="ArticleManager"><ArticleDash /></ProtectedRoute>}>
        <Route path="/article/dashboard/list_blog" element={<ListBlog />} />
        <Route path="/article/dashboard/add_blog" element={<Add_blog />} />
      </Route>

      {/**Route patient view update delete appointment*/}
      <Route path="/getAppointment" element={<ProtectedRoute requiredRole="Patient"><GetAppointment /></ProtectedRoute>}>
      </Route>
      <Route path="/CreateAppointment" element={<ProtectedRoute requiredRole="Patient"><CreateAppointment /></ProtectedRoute>}>
      </Route>
      <Route path="/Create_CustomerFeedback" element={<ProtectedRoute requiredRole="Patient"><Create_CustomerFeedback /></ProtectedRoute>}>
      </Route>
      <Route path="/getDoctorInteraction" element={<ProtectedRoute requiredRole="Patient"><DoctorAndMedicalNotebooks/></ProtectedRoute>}>
      </Route>
      <Route path="/patient-profile" element={<ProtectedRoute requiredRole="Patient"><Profile/></ProtectedRoute>}>
      </Route>
      {/**Điều hướng navbar */}
      <Route path="/listDoctorView" element={<ListDoctorView />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/forgotPassword" element={<ForgotPasswordForm />} />
      <Route path="/password-sent" element={<PasswordSent />} />

      {/*Doctor*/}
      <Route path="/doctor/dasboard/" element={<ProtectedRoute requiredRole="Doctor"><DoctorDash /></ProtectedRoute>}>
        <Route path="create-mdeical-notebook" element={<CreateNoteBook />} />
        <Route path="doctor-answer-question" element={<DoctorAnswerQuestion />} />
        <Route path="view-online-patient" element={<ViewOnlinePatient_forDoctor />} />
        <Route path="viewweeklyschedule" element={<ViewWeeklySchedule_Doctor />} />
        <Route path="examinatedpatients" element={<ExaminatedPatients/>} />
        <Route path="medical-notebook-save" element={<MedicalNotebookList />} />
        <Route path="doctor-profile" element={<DoctorProfile />} />
        <Route path="getAppointment-doctor" element={<AppointmentsDoctor/>} />



      </Route>
      {/**Hỏi đáp và các service khác */}
      <Route path="/GetListQuestion" element={<ProtectedRoute requiredRole="Patient"><PatientViewQuestion /></ProtectedRoute>}>
      </Route>
      <Route path="/getMedicalNotebook" element={<ProtectedRoute requiredRole="Patient"><MedicalNotebook_ForPatient /></ProtectedRoute>}>
      </Route>
      <Route path="/GetListQuestionOfPatient" element={<ProtectedRoute requiredRole="Patient"><ListPatientQuestion /></ProtectedRoute>}>
      </Route>
    </Routes>
  );
}

export default App;
