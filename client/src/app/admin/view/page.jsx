"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import {
  Box,
  Item,
  Grid,
  Typography,
  Select,
  Button,
  MenuItem,
} from "@mui/material";
import Container from "@mui/material/Container";
import BannerSlider from "@/app/components/bannerslider/BannerSlider";
import FeatureSlider from "../../components/featureslider/FeatureSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Showcase from "../../components/showcase/Showcase";
import Subheader from "../../components/subheader/subheader";
import { GetAll } from "../../utility/getAll";
import Filter from "@/app/components/filter/Filter";

const url = "http://localhost:4000/api/appartmentForRent/add";

function View() {
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [Banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null);

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
        city: "dfgfdgd",
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
  console.log("Banners", Banners);
  console.log("features", features);

  const FetchBanners = async () => {
    try {
      const response = await axios.get(
        // Use axios.get instead of just axios
        "http://localhost:4000/api/customize/banners",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setBanners(response?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    FetchBanners();
  }, []);
  const FetchFeatures = async () => {
    try {
      const response = await axios.get(
        // Use axios.get instead of just axios
        "http://localhost:4000/api/customize/features",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFeatures(response?.data[0].features);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchFeatures();
  }, []);
  console.log("collectionData", collectionData);
  const Fetch = async (property, propertyType) => {
    try {
      const response = await axios.get(
        // Use axios.get instead of just axios
        GetAll(property, propertyType),
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response);
      setCollectionData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    Fetch(property, propertyType);
  }, [property, propertyType]);

  return (
    <>
      <Navbar type={"user"} />
      <Subheader setProperty={setProperty} setPropertyType={setPropertyType} />
      <Filter
        property={property}
        propertyType={propertyType}
        setCollectionData={setCollectionData}
      />

      <Box sx={{ margin: "10px 0px", textAlign: "center" }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <hr
              style={{
                margin: "auto",
                width: "90%",
                border: "1px solid #1e1e1e",
                margin: "50px 0px",
              }}
            />
          </Box>
          <Typography
            sx={{
              fontWeight: "700",
              lineHeight: "30px",
              fontSize: "35px",
              color: "white",
              textAlign: "center",
              mb: "30px",
            }}
          >
            Showcase Properties
          </Typography>
          <Showcase data={collectionData} user={"admin"} />
        </Container>
      </Box>
    </>
  );
}

export default View;
