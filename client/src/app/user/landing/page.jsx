"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import { Box, Item, Grid, Typography, Select, MenuItem } from "@mui/material";
import Container from "@mui/material/Container";

const url = "http://localhost:4000/api/appartmentForRent/add";

function Add() {
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

  return (
    <>
      <Navbar type={"admin"} />
      <div>
        <Box style={{ width: "100vw", minheight: "550px", overflow: "hidden" }}>
          <Image
            src="/images/AdminAdd.png"
            alt="Admin Add"
            layout="responsive"
            width={100}
            height={55}
            quality={100}
            style={{ objectFit: "cover" }}
          />
        </Box>
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

export default Add;
