import React from "react";
import Slider from "react-slick";
import { Box } from "@mui/material";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { CldImage } from 'next-cloudinary';

export default function FeatureSlider({ imageData }) {
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
    width: "900px",
    minHeight: "400px",
    overflow: "none",
  };

  return (
    <Slider
      {...settings}
      autoplay
      autoplaySpeed={1500}
      className="slick-slider-custom"
    >
      {imageData?.map((img) => (
        <div key={img.id}>
          <Link href={img.url}>
            <div style={imgStyle}>
              <CldImage
                fill
                src={img?.file}
                style={{ objectFit: "cover" }}
                sizes="100vw"
                alt="Banner Image"
              />
            </div>
          </Link>
        </div>
      ))}
    </Slider>
  );
}
