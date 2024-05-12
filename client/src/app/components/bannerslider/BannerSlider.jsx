import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlider({ imageData }) {
  console.log("imageData", imageData);
  let settings = {
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
    maxHeight: "550px",
    objectFit: "cover",
    overflow: "none",
    zIndex: "1",
    position: "relative",
  };

  return (
    <Slider
      {...settings}
      autoplay
      autoplaySpeed={1500}
      className="slick-slider-custom"
      style={{ zIndex: "10", position: "relative" }}
    >
      {imageData?.map((img) => (
        <div key={img.id}>
          <img src={`data:image/jpeg;base64,${img}`} alt="" style={imgStyle} />
        </div>
      ))}
    </Slider>
  );
}
