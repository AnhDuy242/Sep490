import React from "react";
import ReactDOM from "react-dom";
import Carousel from "react-elastic-carousel";
import Item from "./Item";
import "../CarouselSlider/Carousel.css";
import img1 from "../../assets/images/carousel_image_1.jpg"
import img2 from "../../assets/images/carousel_image_2.jpg"
import img3 from "../../assets/images/carousel_image_3.jpg"


import { Link } from 'react-router-dom'

const breakPoints = [
    { width: 80, height: 500, itemsToShow: 1 }
];

function Carousel2() {
    return (
        <>
            <div className="slider">
                <Carousel breakPoints={breakPoints}>
                    <Item maxWidth="100%">   <img src={img1} alt="Carousel Image 1" />
                        <div className="button-text">
                            <Link to="/****" style={{ textDecoration: 'none' }}>  <button className="button-slider"><span>Đặt lịch ngay</span></button>  </Link>
                            <Link to="/**** " style={{ textDecoration: 'none' }}>   <button className="button-slider"><span>Chat trực tiếp</span></button> </Link>
                        </div>
                    </Item>
                    <Item maxWidth="100%">  <img src={img2} alt="Carousel Image 2" /><div className="button-text-2">
                        <Link to="/****" style={{ textDecoration: 'none' }}>  <button className="button-slider"><span>Đặt lịch ngay</span></button>  </Link>
                        <Link to="/****" style={{ textDecoration: 'none' }}>   <button className="button-slider"><span>Chat trực tiếp</span></button> </Link>
                    </div></Item>
                    <Item maxWidth="100%"><img src={img3} alt="Carousel Image 3" /><div className="button-text-3">
                        <Link to="/****" style={{ textDecoration: 'none' }}>  <button className="button-slider"><span>Đặt lịch ngay</span></button>  </Link>
                        <Link to="/****" style={{ textDecoration: 'none' }}>   <button className="button-slider"><span>Chat trực tiếp</span></button> </Link>
                    </div></Item>

                </Carousel>
            </div>
        </>
    );
}
export default Carousel2;