"use client";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import Slider from "react-slick";
import Navbar from "./components/navbar/Navbar";
import Image from "next/image";
import Swal from "sweetalert2";
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Showcase from "./components/showcase/Showcase";
import Subheader from "./components/subheader/subheader";
import { GetAll } from "./utility/getAll";
import { PropertyTypes } from "@/app/list/propertyTypes";
import { Cities } from "@/app/list/city";
import { Prices } from "@/app/list/price";
import { FilterUrl } from "./utility/filterUrls";
import AuthContext from "./context/AuthContext";
import { useRouter } from "next/navigation";
import UseSessionStorage from "@/app/UseSessionStorage";

import BASE_URL from "./config";
const url = `${BASE_URL}/api/apartmentForRent/add`;

function Home() {
  const scollToRef = useRef();
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [Banners, setBanners] = useState([]);
  const [features, setFeatures] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [property, setProperty] = useState(null);
  const [propertyType, setPropertyType] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState();
  const [selectedPropertyType, setSelectedPropertyType] = useState("ForSale");
  const [price, setPrice] = useState("All");
  const [rent, setRent] = useState("All");
  const [city, setCity] = useState({ title: 'All', group: 'All' });
  const [title, setTitle] = useState(null);

  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          clearIndicator: {
            color: 'white',
          },
          popupIndicator: {
            color: 'white',
          },
        },
      },
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let additionalData = {
        title: title,
        city: city.title,
      };

      if (selectedPropertyType === "ForSale") {
        additionalData.price = parseInt(price);
      } else if (selectedPropertyType === "ForRent") {
        additionalData.rent = parseInt(rent);
      }
      console.log("additionalData", additionalData);

      console.log("selectedPropertyType", selectedPropertyType);
      console.log("selectedProperty", selectedProperty);

      const initialUrl = FilterUrl(selectedPropertyType, selectedProperty);
      console.log("initialUrl", initialUrl);

      const url = initialUrl.replace("filter", "filter/main");
      console.log("url", url);
      const response = await axios.post(url, additionalData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setCollectionData(response.data);

      if (scollToRef.current) {
        scollToRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      // Swal.fire({
      //   title: "Unable to Filter Data",
      //   icon: "error",
      //   timer: 1500,
      // });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
      console.log(error);
    }
  };

  console.log(postImage);

  console.log("Banners", Banners);
  console.log("features", features);

  const FetchBanners = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/customize/banners`,
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
        `${BASE_URL}/api/customize/features`,
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

  const FetchPropertyIDs = async () => {
    try {
      const propertyIDResponse = await axios.get(
        `${BASE_URL}/api/customize/propertyid`,
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
      console.log("Properties responses data", response.data.data);
      setCollectionData(response.data.data);
    } catch (error) {
      console.log("error in fetching properties", error);
    }
  };

  useEffect(() => {
    FetchPropertyIDs();
  }, []);

  const transformedCities = Cities.flatMap(city =>
    city.subheadings ? city.subheadings.map(subheading => ({ title: subheading.label, group: city.label })) : []
  );
  const allOption = { title: 'All', group: 'All' };
  const transformedCitiesWithAll = [allOption, ...transformedCities];


  return (
    <>
      <Navbar type={UseSessionStorage("contact_user") ? "admin" : "user"} />
      <Subheader
        setProperty={setProperty}
        setPropertyType={setPropertyType}
        user={UseSessionStorage("contact_user") ? "admin" : "user"}
      />
      <Box sx={{ position: "relative" }}>
        <Box>
          <BannerSlider imageData={Banners?.banners} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            margin: "0px 30px",
            marginTop: "-380px",
            position: "relative",
            bottom: "-170px",
            zIndex: "10",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                backgroundColor: "rgba(10, 10, 10, 0.76)",
                width: { md: "1047px", xs: "300px" },
                height: { md: "350px", xs: "500px" },
                padding: "5px 20px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                marginTop: "10px",
                width: { md: "30%", xs: "100%" },
              }}>
                <Button
                  sx={{
                    color: "white",
                    height: "50px",
                    width: "100%",
                    backgroundColor:
                      selectedPropertyType === "ForRent"
                        ? "transparent"
                        : "#8C1C40",
                    borderRadius: "10px",
                    border: `3px solid ${selectedPropertyType === "ForRent" && "#8C1C40"}`,
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
                    height: "50px",
                    width: "100%",
                    backgroundColor:
                      selectedPropertyType === "ForSale"
                        ? "transparent"
                        : "#8C1C40",
                    borderRadius: "10px",
                    border: `3px solid ${selectedPropertyType === "ForSale" && "#8C1C40"
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
                  margin: { xs: "20px 0px", md: "50px 0px" },
                }}
              >
                <TextField
                  variant="outlined"
                  placeholder="Type Anything to Search"
                  InputProps={{ style: { color: "white" } }}
                  type="text"
                  size="small"
                  sx={{
                    border: "1px solid #8C1C40",
                    color: "white",
                    borderRadius: "10px 0px 0px 10px",
                  }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateAreas: {
                    md: `"New1 New2 New3"`,
                    xs: `"New1" "New2" "New3"`,
                  },
                  gap: "10px",
                }}
              >
                <Box sx={{ gridArea: "New1" }} >
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
                    value={selectedProperty || ''}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      border: "1px solid #8C1C40",
                      width: "100%",
                      color: "white",
                      borderRadius: "5px",
                      '.MuiSvgIcon-root ': {
                        fill: "white !important",
                      }
                    }}
                    required
                  >
                    {PropertyTypes.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box sx={{ gridArea: "New2" }} >
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
                  <ThemeProvider theme={theme}>
                    <Autocomplete
                      value={city || allOption}
                      onChange={(event, value) => {
                        setCity(value || '');
                      }}
                      options={transformedCitiesWithAll}
                      groupBy={(option) => option.group}
                      getOptionLabel={(option) => option.title}
                      isOptionEqualToValue={(option, value) => option.title === value.title}
                      size="small"
                      sx={{
                        height: "42px",
                        backgroundColor: "transparent",
                        width: "100%",
                        border: "1px solid #8C1C40",
                        borderRadius: "5px",
                        "& .MuiAutocomplete-inputRoot": {
                          color: "white",
                          border: 0,
                          height: "42px",
                        },
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </ThemeProvider>
                </Box>
                <Box sx={{ gridArea: "New3" }} >
                  <Typography
                    variant="h6"
                    style={{
                      color: "#8C1C40",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    {selectedPropertyType === "ForSale" ? "Max Price" : "Max Rent"}
                  </Typography>
                  <Select
                    value={selectedPropertyType === "ForSale" ? (price || "All") : (rent || "All")}
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
                      width: "100%",
                      borderRadius: "5px",
                      '.MuiSvgIcon-root ': {
                        fill: "white !important",
                      }
                    }}
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
        <Container>
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
            ref={scollToRef}
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
          // property={property}
          // propertyType={propertyType}
          />
        </Container>
      </Box>
    </>
  );
}

export default Home;
