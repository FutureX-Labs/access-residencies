import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

// const timeNow = Date.now();
const timeNow = "new";

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
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true, // Stop autoplay when mouse is over the slider
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
      className="slick-slider-custom"
      style={{ zIndex: "10", position: "relative" }}
    >
      {imageData?.map((img) => (
        <div key={img.id}>
          <div style={imgStyle}>
            <Image
              fill
              src={`https://res.cloudinary.com/${cloudName}/image/upload/q_100/${img}?t=${timeNow}`}
              alt="Image"
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
}
