import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { CldImage } from 'next-cloudinary';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const timeNow = Date.now();
// const timeNow = "new";

export default function FeatureSlider({ imageData }) {
  console.log("imageData", imageData);
  
  let settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
  };

  return (
    <Slider
      {...settings}
      autoplay
      autoplaySpeed={1500}
    >
      {imageData?.map((img) => (
        <Link key={img.id} href={img.url}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
            {/* <Image
              fill
              src={`https://res.cloudinary.com/${cloudName}/image/upload/q_100/${img?.file}?t=${timeNow}`}
              alt="Image"
              style={{
                objectFit: 'cover',
              }}
            /> */}
            <CldImage
              fill
              src={img?.fil}
              quality="auto"
              alt="Image"
              style={{
                objectFit: 'cover',
              }}
            />
          </div>
        </Link>
      ))}
    </Slider>
  );
}
