"use client";
import { useEffect, useState } from "react";
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

    handleSubmit();
  }, []);


  const handleSubmit = async (e) => {
    e && e.preventDefault();
    try {
      let additionalData = {
        city: city,
      };

      if (propertyType === "ForSale") {
        additionalData.price = parseInt(price);
      } else if (propertyType === "ForRent") {
        additionalData.rent = parseInt(rent);
      }

      if (property === "House" || property === "Apartment") {
        additionalData = {
          ...additionalData,
          size: size,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
        };
      } else if (property === "Commercial") {
        additionalData = {
          ...additionalData,
          size: parseInt(size),
          propertyTypes: propertyTypes,
        };
      } else if (property === "Land") {
        additionalData = {
          ...additionalData,
          perches: parseInt(perches),
          acres: parseInt(acres),
        };
      }

      console.log("additionalData", additionalData);
      console.log("propertyType", propertyType);
      console.log("property", property);

      const response = await axios.post(
        FilterUrl(propertyType, property),
        additionalData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCollectionData(response.data);

      if (response.data && additionalData) {
        const filteredBy = Object.entries(additionalData).map(
          ([key, value]) => {
            if (!value) return null;
            console.log("filterd by values", key, ":", value);

            if (typeof value === "object") {
              console.log("Object found:", key, value);
              return `${key}: ${JSON.stringify(value)}`;
            }

            switch (key) {
              case "city":
                return value;
              case "bedrooms":
                return `${value} bedrooms`;
              case "bathrooms":
                return `${value} bathrooms`;
              case "size":
                return `${value} sq`;
              case "perches":
                return `${value} perches`;
              case "acres":
                return `${value} acres`;
            }
          }
        );

        const filteredWithoutNull = filteredBy.filter((value) => value !== null);
        const filteredArray = filteredWithoutNull.filter(Boolean);

        console.log("filteredByCleaned", filteredArray);

        setFilteredBy(filteredArray);

        const transformedCities = Cities.map((city) => ({
          label: city.label,
          subheadings: city.subheadings.map((subheading) => subheading.value),
        }));

        console.log("transformedCities", transformedCities);
        let topCities = [];

        transformedCities?.forEach((transformedCity) => {

          if (additionalData?.city == transformedCity.label) {
            topCities = transformedCity.subheadings;
            // No need to break out of the loop here since we want to check all items
          }
        });

        // After the loop, check if topCities is still an empty array
        if (topCities.length === 0) {
          // If no match was found, assign [city] to topCities
          topCities = [city];
        }

        setTopCities(topCities);
      }
    } catch (error) {
      console.debug(error);
    }
  };


  return (
    <>
      <Navbar type={"user"} />
      <Subheader
        propertyType={propertyType}
        user="user"
      />
      {property && propertyType ? (
        <Filter
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
            sx={{
              fontWeight: "700",
              lineHeight: "30px",
              fontSize: "35px",
              color: "white",
              textAlign: "center",
              mb: "30px",
            }}
          >
            Fitered Properties
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
