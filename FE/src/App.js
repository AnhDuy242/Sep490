// import logo from './logo.svg';
import './App.css';

import Home from './pages/Home';
import Header from '../src/layouts/ForgotPassword'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForgotPassword from '../src/layouts/ForgotPassword';
import PopupNotification from '../src/layouts/PopupNotification';
import AdminDashBoard from './pages/AdminDashBoard';
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/otp" element={<otp/>}/>
        <Route path='/admin/dashboard' element={<AdminDashBoard/>}/>
      </Routes>

    </Router>
  );
}

export default App;
