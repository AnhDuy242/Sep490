// import logo from './logo.svg';
import './App.css';

import Home from './pages/Home';
import Header from '../src/layouts/Header'

import './layouts/Header/index'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Header" element={<Header />} />

      </Routes>

    </Router>
  );
}

export default App;
