"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import {
  Box,
  Item,
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { FaShareNodes } from "react-icons/fa6";
import { MdBed } from "react-icons/md";
import bathroom from "../../../../public/bathroom.png";
import squareFeet from "../../../../public/images/squareFeet.png";
import { SlCallEnd } from "react-icons/sl";

import { Roboto } from "next/font/google";

const url = "http://localhost:4000/api/appartmentForRent/add";

function View() {
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

  const data = {
    title: "Modern House from sale",
    city: "Columbo",
    propertyId: "#HS_S_001",
    description:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit.Aut debitis, soluta consequatur quis dolores maiores Aut debitis, soluta consequatur quis dolores maiores Aut debitis, soluta consequatur quis dolores maiores Aut debitis, soluta consequatur quis dolores maiores possimus aliquam non sapiente minima ipsam veniam dignissimos at laudantium minus quo quod quae? Eos?   dolores maiores possimus aliquam non sapiente minima ipsam veniam dignissimos at laudantium minus quo quod quae? Eos?",
    bedroom: "35 bed rooms",
    bathroom: "27 bath rooms",
    size: "125,000 sq.ft",
    price: "RS. 50,000,00 ",
  };

  return (
    <>
      <Navbar type={"admin"} />

      <Box
        sx={{
          height: {md:"630px", xs:"650px"},
          backgroundColor: "#333",
          color: "#fff",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          borderRadius: "8px",
          width: {md:"50%",xs:"90%"},
          
          margin:"auto"
        }}
        my={4}
        display="flex"
        flexDirection="column"
        gap={2}
        p={2}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Box>
            <Typography
              sx={{
                textAlign: { md: "start", xs: "center" },
                fontWeight: "500",
              }}
              variant="h5"
            >
              {data.title}
            </Typography>
            <Typography
              sx={{
                textAlign: { md: "start", xs: "center" },
                color: "#FF6DD6",
                fontWeight: "600",
                marginTop: "8px",
              }}
            >
              {data.city}
            </Typography>
          </Box>
          <Box sx={{display:"flex", flexDirection: "column" , justifyContent:{md:"end", xs:' center'}}}  >
            <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            <Button
              sx={{
                backgroundColor: "#8C1C40",
                padding: "5px 10px",
                color: "#fff",
                gap: "10px",
                width:"100px",
           
              }}
            >
              <FaShareNodes size={20} />
              <Typography sx={{ fontSize: "13px",}}>Share</Typography>
            </Button>
            </Box>
            <Typography
              sx={{
                color: "#787878",
                fontSize: "14px",
                textAlign: {mdL:"end", xs:"center"},
                fontWeight: "600",
                marginTop: "8px",
              }}
            >
              {data.propertyId}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "85%", margin: " 0px   auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", padding: "10px", gap: "20px" }}>
              <MdBed size={22} />
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "14px",
                  color: "#bdbdbd",
                }}
              >
                {data.bedroom}{" "}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Image
                  style={{ marginTop: "-12px" }}
                  src={bathroom}
                  alt="icon"
                  size={12}
                />
                <Typography
                  sx={{ gap: "10px", fontSize: "14px", color: "#bdbdbd" }}
                >
                  {data.bathroom}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Image src={squareFeet} alt="icon" size={12} />
              <Typography sx={{ fontSize: "14px", color: "#bdbdbd" }}>
                {" "}
                {data.size}{" "}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              padding: "20px 0px 20px",
              color: "#FF6DD6",
              fontWeight: "600",
              fontSize: "30px",
            }}
          >
            <Typography>{data.price}</Typography>
          </Box>
          <Typography
            sx={{
              color: "#bdbdbd",
              fontSize: "18px",
              textAlign: "center",
              overflowY: " auto",
              maxHeight: {md: "300px", xs: "230px"},
            }}
          >
            {data.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "50px 0px",
            }}
          >
            <Typography>Contact : 0711234567</Typography>
            <Box>
              <Button
                sx={{
                  backgroundColor: "#8C1C40",
                  padding: "5px 10px",
                  color: "#fff",
                  gap: "10px",
                }}
              >
                <SlCallEnd size={20} />

                <Typography sx={{ fontSize: "13px" }}>Call</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default View;
