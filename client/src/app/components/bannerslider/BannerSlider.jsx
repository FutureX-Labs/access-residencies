import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import Image from "next/image";
import { CldImage } from 'next-cloudinary';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlider({ imageData }) {
  console.log("imageData", imageData);

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
  };

  const imgStyle = {
    width: "100vw",
    minHeight: "550px",
    zIndex: "1",
    position: "relative",
  };

  return (
    <Slider
      {...settings}
      autoplay
      autoplaySpeed={5000}
      className="slick-slider-custom"
      style={{ zIndex: "10", position: "relative" }}
    >
      {imageData?.map((img) => (
        <div key={img.id}>
          <div style={imgStyle}>
            <CldImage
              fill
              src={img}
              style={{objectFit: "cover"}}
              sizes="100vw"
              alt="Banner Image"
            />
          </div>
        </div>
      ))}
    </Slider>
  );
}
