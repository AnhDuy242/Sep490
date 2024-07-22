// src/components/ListDoctorView.js
import React, { useState, useEffect } from 'react';
import Header from '../../layouts/Header';
import NavBar from '../../layouts/Navbar';
import Footer from '../../layouts/Footer';
import { fetchDoctors } from '../../services/doctorListHomePage';
import '../../assets/css/doctorListHomePage.css';

const ListDoctorView = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const getDoctors = async () => {
            const data = await fetchDoctors();
            setDoctors(data);
        };
        getDoctors();
    }, []);

    return (
        <>
            <Header />
            <NavBar />
            <div className="doctor-list-container">
                {doctors.map((doctor) => (
                    <div key={doctor.$id} className="doctor-card">
                        <h3 className="doctor-name">{doctor.name}</h3>
                        <p className="doctor-info"><span></span> {doctor.serviceName}</p>
                        <p className="doctor-info"><span></span> {doctor.departmentName}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </>
    );
}

export default ListDoctorView;