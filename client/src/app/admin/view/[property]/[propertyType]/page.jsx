"use client";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Slider from "react-slick";
import Navbar from "../../../../components/navbar/Navbar";
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
import FeatureSlider from "../../../../components/featureslider/FeatureSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Showcase from "../../../../components/showcase/Showcase";
import Subheader from "../../../../components/subheader/subheader";
import { GetAll } from "../../../../utility/getAll";
import Filter from "@/app/components/filter/Filter";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { IoIosArrowForward } from "react-icons/io";
import { Padding } from "@mui/icons-material";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";


import BASE_URL from "./config";
const url = `${BASE_URL}/api/appartmentForRent/add`;

function View() {
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [Banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [showHidden, setShowHidden] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  console.log("user", user);

  useEffect(() => {
    console.log("user inside the useEffect:", user);
    const isUserLoggedIn = sessionStorage.getItem("contact_user");
    if (!isUserLoggedIn) router.push("/");
  }, []);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split("/");
    const propertyValue = urlParts[5];
    const propertyTypeValue = urlParts[6];

    setProperty(propertyValue);
    setPropertyType(propertyTypeValue);
  }, []);

  // useEffect(() => {
  //   console.log("isAuthenticated inside useEffect", isAuthenticated);
  //   if (isAuthenticated) {
  //     if (typeof isAuthenticated === "string") {
  //       const trimmedIsAuthenticated = isAuthenticated.trim(); // Trim the string
  //       if (trimmedIsAuthenticated === "true") {
  //         console.log("User is authenticated, no redirect needed");
  //       } else {
  //         console.log("User is not authenticated, redirecting...");
  //       }
  //     } else {
  //       console.log("isAuthenticated is not a string or is undefined");
  //       router.push("/");
  //       // Handle this case as per your requirements
  //     }
  //   } else {
  //     router.push("/");
  //   }
  // }, [isAuthenticated, router]);

  console.log("propertyType", property);
  console.log("showHidden", showHidden);

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

  const FetchPropertyIDs = async () => {
    try {
      const propertyIDResponse = await axios.get(
        `${BASE_URL}/api/customize/propertyid/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Properties response", propertyIDResponse.data[0].propertyId);
      const propertyIds = propertyIDResponse.data[0].propertyId;

      const response = await axios.post(
        `${BASE_URL}/api/properties`,
        {
          propertyIds: propertyIds,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Properties response", response.data.data);
      setCollectionData(response.data.data);
    } catch (error) {
      console.log("error in fetching properties", error);
    }
  };

  useEffect(() => {
    FetchPropertyIDs();
  }, []);

  return (
    <>
      <Navbar type={"admin"} />
      <Subheader
        setProperty={setProperty}
        setPropertyType={setPropertyType}
        user={"admin"}
      />
      <Filter
        property={property}
        propertyType={propertyType}
        setCollectionData={setCollectionData}
        collectionData={collectionData}
        setShowHidden={setShowHidden}
        showHidden={showHidden}
        hideProperties={true}
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
          <Showcase
            data={collectionData}
            property={property}
            propertyType={propertyType}
            user={"admin"}
            showHidden={showHidden}
          />
        </Container>
      </Box>
    </>
  );
}

export default View;
