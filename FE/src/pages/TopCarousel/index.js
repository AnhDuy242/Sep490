import image1 from "../../assets/image/carousel_image_1.jpg";
import image2 from "../../assets/image/carousel_image_2.png";
import image3 from "../../assets/image/carousel_image_3.png";
import React, { Component } from 'react';
import { Carousel } from "@material-tailwind/react";

export function CarouselTop() {
  return (
    <div className="carousel-wrapper">
      <Carousel transition={{ duration: 2 }} className="rounded-xl">
        <img
          src={image1}
          alt="image 1"
          className="h-full w-full object-cover"
        />
        <img
          src={image2}
          alt="image 2"
          className="h-full w-full object-cover"
        />
        <img
          src={image3}
          alt="image 3"
          className="h-full w-full object-cover"
        />
      </Carousel>
      <div>
        <button className="btn">Button 1</button>
        <button className="btn">Button 2</button>
      </div>
    </div>

  );
}