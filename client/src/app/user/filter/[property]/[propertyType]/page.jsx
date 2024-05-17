"use client";
import { useEffect, useState, useRef } from "react";
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
import { useRouter } from "next/navigation";


import BASE_URL from "../../../../config";
const url = `${BASE_URL}/api/apartmentForRent/add`;

function UserFilter() {
  const scollToRef = useRef();
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [Banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const router = useRouter();
  console.log("property", property);
  console.log("propertyType", propertyType);

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split("/");
    const propertyValue = urlParts[5];
    const propertyTypeValue = urlParts[6];

    setProperty(propertyValue);
    setPropertyType(propertyTypeValue);

  }, []);

  return (
    <>
      <Navbar type={"user"} />
      <Subheader
        propertyType={propertyType}
        user="user"
      />
      {property && propertyType ? (
        <Filter
          scollToRef={scollToRef}
          property={property}
          propertyType={propertyType}
          setCollectionData={setCollectionData}
          collectionData={collectionData}
        />
      ) : (
        <></>
      )}

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
            ref={scollToRef}
            sx={{
              fontWeight: "700",
              lineHeight: "30px",
              fontSize: { xs: "20px", md: "30px" },
              color: "white",
              textAlign: "center",
              mb: "30px",
            }}
          >
            Filtered Properties
          </Typography>
          <Showcase
            data={collectionData}
            property={property}
            propertyType={propertyType}
            user={"user"}
          />
        </Container>
      </Box>
    </>
  );
}

export default UserFilter;
