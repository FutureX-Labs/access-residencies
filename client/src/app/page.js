"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import Navbar from "./components/navbar/Navbar";
import Image from "next/image";
import {
  Box,
  Item,
  Grid,
  Typography,
  Select,
  Button,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import BannerSlider from "@/app/components/bannerslider/BannerSlider";
import FeatureSlider from "./components/featureslider/FeatureSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Showcase from "./components/showcase/Showcase";
import Subheader from "./components/subheader/subheader";
import { GetAll } from "./utility/getAll";
import { PropertyTypes } from "@/app/list/propertyTypes";
import { Cities } from "@/app/list/city";
import { Prices } from "@/app/list/price";

const url = "http://localhost:4000/api/appartmentForRent/add";

function Home() {
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [Banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState();
  const [selectedPropertyType, setSelectedPropertyType] = useState("ForSale");
  const [price, setPrice] = useState(null);
  const [rent, setRent] = useState(null);
  const [city, setCity] = useState("All of Colombo");
  const [search, setSearch] = useState(null);

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

  const FetchPropertyIDs = async () => {
    try {
      const propertyIDResponse = await axios.get(
        `http://localhost:4000/api/customize/propertyid/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Properties response", propertyIDResponse.data[0].propertyId);
      const propertyIds = propertyIDResponse.data[0].propertyId;

      const response = await axios.post(
        `http://localhost:4000/api/properties`,
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
      <Navbar type={"user"} />
      <Subheader setProperty={setProperty} setPropertyType={setPropertyType} />
      <Box sx={{ position: "relative" }}>
        <Box>
          <BannerSlider imageData={Banners?.banners} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",

            margin: "0px 30px",
            marginTop: "-140px",
            position: "absolute",
            bottom: "-170px",
            left: "10%",
            zIndex: "10",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: "rgba(10, 10, 10, 0.76)",
                width: "1047px",
                height: "350px",
                padding: "5px 20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor:
                      selectedPropertyType === "ForRent"
                        ? "transparent"
                        : "#8C1C40",
                    borderRadius: "10px",
                    margin: "10px 0px",
                    width: "150px",
                    height: "60px",
                    border: `5px solid ${
                      selectedPropertyType === "ForRent" && "#8C1C40"
                    }`,
                    marginRight: "10px",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPropertyType("ForSale");
                  }}
                >
                  Sales
                </Button>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor:
                      selectedPropertyType === "ForSale"
                        ? "transparent"
                        : "#8C1C40",
                    borderRadius: "10px",
                    margin: "10px 0px",
                    width: "150px",
                    height: "60px",
                    border: `5px solid ${
                      selectedPropertyType === "ForSale" && "#8C1C40"
                    }`,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPropertyType("ForRent");
                  }}
                >
                  Rentals
                </Button>
              </Box>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  margin: "50px 0px",
                }}
              >
                <TextField
                  required
                  variant="outlined"
                  placeholder="Type Anything to Search"
                  InputProps={{ style: { color: "white" } }}
                  type="text"
                  size="small"
                  sx={{
                    border: "1px solid #8C1C40",
                    color: "white",
                    widht: "500px",
                    borderRadius: "10px 0px 0px 10px",
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  fullWidth
                />
                <Button
                  sx={{
                    borderRadius: "0px 10px 10px 0px",
                    border: "1px solid #8C1C40",
                    backgroundColor: "#8C1C40",
                    color: "white",
                    height: "42px",
                    width: "100px",
                  }}
                  type="submit"
                  // disabled={!propertyId}
                >
                  Search
                </Button>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                <Box>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#8C1C40",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    Property Types
                  </Typography>

                  <Select
                    required
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      border: "1px solid #8C1C40",
                      color: "white",
                      width: "300px",
                      borderRadius: "5px",
                    }}
                    fullWidth
                  >
                    {PropertyTypes.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#8C1C40",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    City
                  </Typography>
                  <select
                    required
                    style={{
                      width: "300px",
                      border: "1px solid #8C1C40",
                      height: "42px",
                      borderRadius: "5px",
                      backgroundColor: "transparent",
                      color: "white",
                    }}
                    value={city}
                    onChange={(e) => {
                      const selectedCity = e.target.value;
                      setCity(selectedCity);
                      setOpenCityDropDown(false);
                    }}
                  >
                    {Cities.map((cityItem) => (
                      <optgroup
                        label={cityItem.label}
                        key={cityItem.value}
                        style={{
                          backgroundColor: "black",
                          padding: "5px 20px",
                        }}
                      >
                        {cityItem.subheadings.map((subheading) => (
                          <option
                            value={subheading.value}
                            key={subheading.value}
                          >
                            └ {subheading.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    style={{
                      color: "#8C1C40",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    {selectedPropertyType === "ForSale" ? "Price" : "Rent"}
                  </Typography>
                  <Select
                    required
                    value={selectedPropertyType === "ForSale" ? price : rent}
                    onChange={(e) =>
                      selectedPropertyType === "ForSale"
                        ? setPrice(e.target.value)
                        : setRent(e.target.value)
                    }
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      border: "1px solid #8C1C40",
                      color: "white",
                      width: "300px",
                      borderRadius: "5px",
                    }}
                    fullWidth
                  >
                    {Prices.map((priceOption, index) => (
                      <MenuItem key={index} value={priceOption.value}>
                        {priceOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>

      <Box sx={{ margin: "260px 0px 30px 0px", textAlign: "center" }}>
        <Typography
          sx={{
            fontWeight: "700",
            lineHeight: "30px",
            fontSize: "35px",
            color: "white",
            textAlign: "center",
          }}
        >
          Featured Projects
        </Typography>
        <Container>
          <Box
            sx={{ margin: { md: "30px 17%", sm: "30px 15%", xs: "30px 12%" } }}
          >
            <FeatureSlider imageData={features} />
          </Box>
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
            user={"user"}
            property={property}
            propertyType={propertyType}
          />
        </Container>
      </Box>
    </>
  );
}

export default Home;
