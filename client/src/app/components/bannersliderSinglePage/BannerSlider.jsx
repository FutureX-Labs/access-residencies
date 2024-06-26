import React, { useRef, useEffect } from "react";
import Slider from "react-slick";
import { CldImage } from "next-cloudinary";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlider({ imageData }) {
  let sliderRef = useRef(null);
  console.log("imageData", imageData);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    adaptiveHeight: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,
    autoplaySpeed: 5000,
    pauseOnHover: false,
  };

  const imgStyle = {
    width: "100vw",
    minHeight: "550px",
    zIndex: "1",
    position: "relative",
  };

  useEffect(() => {
    if (sliderRef) {
      sliderRef.slickPlay();
    }
  }, []);

  return (
    <Slider
      ref={slider => (sliderRef = slider)}
      {...settings}
      className="slick-slider-custom"
      style={{ zIndex: "10", position: "relative" }}
    >
      {imageData?.map((img) => (
        <div key={img.id}>
          <div style={imgStyle}>
            <CldImage
              fill
              src={img}
              quality="auto"
              alt="Image"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      ))}
    </Slider>
  );
}
