"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "./components/navbar/Navbar";
import Image from "next/image";
import { Box, Item, Grid, Typography, Select, MenuItem } from "@mui/material";
import Container from "@mui/material/Container";

const url = "http://localhost:4000/test";

function Home() {
  const [postImages, setPostImages] = useState([]);
  const [property, setProperty] = useState("");

  const createPost = async (newImages) => {
    try {
      const chunkSize = 500000;
      const chunks = [];
      for (let i = 0; i < newImages.length; i += chunkSize) {
        chunks.push(newImages.slice(i, i + chunkSize));
      }
      for (const chunk of chunks) {
        await axios.post(url, chunk);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(postImages);
    console.log("Uploaded");
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await convertToBase64(file);
      newImages.push(base64);
    }
    setPostImages([...postImages, ...newImages]);
  };
  console.log("postImages", postImages);
  return (
    <div className="App">
      <Navbar type={"user"} />
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

            {/* <Select
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
            </Select> */}
          </Box>
          <form onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {/* {postImage && <img src={URL.createObjectURL(postImage)} alt="" />} */}
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

      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="custom-file-upload">
          {/* {postImages.map((image, index) => (
            <img key={index} src={image?.myFile} alt="" />
          ))} */}
        </label>

        <input
          type="file"
          lable="Image"
          name="myFile"
          id="file-upload"
          accept=".jpeg, .png, .jpg"
          onChange={(e) => handleFileUpload(e)}
          multiple
        />

        <h3>Doris Wilder</h3>
        <span>Designer</span>

        <button type="submit">Submit</button>
      </form>
      {/* {postImages.map((img) => {
        return <img src={img} alt="img" width="400px" height="499px" />;
      })} */}
    </div>
  );
}

export default Home;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
