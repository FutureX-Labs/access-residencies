"use client";
import { useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import { Box, Item, Grid, Typography, Select, MenuItem } from "@mui/material";
import Container from "@mui/material/Container";
import BannerSlider from "@/app/components/bannerslider/BannerSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const url = "http://localhost:4000/api/appartmentForRent/add";

function Home() {
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [propertyType, setPropertyType] = useState("");
  const [property, setProperty] = useState("");

  console.log(propertyType, property);
  const createPost = async () => {
    try {
      const additionalData = {
        propertyId: "5wfdfwe",
        title: "house beautifyll",
        price: 4324,
        description: "dsfsdfdsfsdfsd",
        size: 2,
        bedrooms: 4,
        bathrooms: 5,
        town: "dfgfdgd",
      };
      formData.append("additionalData", JSON.stringify(additionalData));
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
    if (postImage) {
      //   formData.append("myFile", postImage);
    } else {
      console.log("No image selected");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
  };
  console.log(postImage);
  const handleMultipleFileUpload = (e) => {
    const files = e.target.files;
    console.log("before Files", files);

    // Convert postImage to an array if it's not already
    const postImagesArray = postImage ? [postImage] : [];
    console.log("postImagesArray", postImagesArray);
    // Concatenate postImage with files
    const allFiles = [...files, ...postImagesArray];

    for (let i = 0; i < allFiles.length; i++) {
      formData.append("myFiles", allFiles[i]);
    }
    console.log("files", allFiles);
  };

  const settings = {
    dots: false,
    infinite: true,
    autoplay: false, // Disable autoplay
    autoplaySpeed: 5000, // This line can be removed since autoplay is disabled
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const BannerData = [
    `data:image/jpeg;base64,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`,
    `data:image/jpeg;base64,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`,
  ];

  return (
    <>
      <Navbar type={"admin"} />
      <img
        src="data:image/jpeg;base64,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"
        width={100}
        height={200}
      />
      <Box sx={{ width: "100px" }}>
        {/* <BannerSlider /> */}
        <Box sx={{ display: "flex", zIndex: "999" }}>
          <Slider>
            {BannerData.map((image, index) => (
              <Box
                key={index}
                sx={{
                  backgroundImage: `url(${image})`,
                }}
              >
                dfdsfsdf
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
      <div>
        {/* <Box style={{ width: "100vw", minheight: "550px", overflow: "hidden" }}>
          <Image
            src="/images/AdminAdd.png"
            alt="Admin Add"
            layout="responsive"
            width={100}
            height={55}
            quality={100}
            style={{ objectFit: "cover" }}
          />
        </Box> */}
        <Container maxWidth="lg" sx={{ backgroundColor: "red", mt: "50px" }}>
          <Typography
            sx={{
              fontFamily: "Roboto",
              fontWeight: "900",
              fontSize: "32px",
              lineHeight: "37.5px",
              color: "white",
            }}
          >
            Add New Properties
          </Typography>
          <Typography
            sx={{
              fontFamily: "Roboto",
              fontWeight: "400",
              fontSize: "22px",
              lineHeight: "33.5px",
              color: "white",
              mt: "30px",
            }}
          >
            Type
          </Typography>
          <Box sx={{ display: "flex", ml: "20px", my: "10px" }}>
            <Select
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              sx={{
                minWidth: 320,
                mr: "10px",
                "&:focus": { backgroundColor: "transparent" },
              }}
              size="small"
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select Property</em>
              </MenuItem>
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Land">Land</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
            </Select>

            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              sx={{
                minWidth: 320,
                "&:focus": { backgroundColor: "transparent" },
              }}
              size="small"
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Select Property Type</em>
              </MenuItem>
              <MenuItem value="ForSale">For Sale</MenuItem>
              <MenuItem value="ForRent">For Rent</MenuItem>
            </Select>
          </Box>
          <form onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {postImage && <img src={URL.createObjectURL(postImage)} alt="" />}
            </label>

            <input
              type="file"
              label="Image"
              name="myFile"
              id="file-upload"
              accept=".jpeg, .png, .jpg"
              onChange={(e) => handleFileUpload(e)}
            />

            <hr />
            <hr />
            <hr />
            <hr />
            <hr />

            <input
              type="file"
              label="Image"
              name="myFiles"
              id="file-uploads"
              accept=".jpeg, .png, .jpg"
              onChange={(e) => handleMultipleFileUpload(e)}
              multiple
            />

            <button type="submit">Submit</button>
          </form>
        </Container>
      </div>
    </>
  );
}

export default Home;
