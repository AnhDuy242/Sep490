// import logo from './logo.svg';
import './App.css';

import Home from './pages/Home';
import Header from '../src/layouts/ForgotPassword'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForgotPassword from '../src/layouts/ForgotPassword';
import PopupNotification from '../src/layouts/PopupNotification'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>

    </Router>
  );
}

export default App;
