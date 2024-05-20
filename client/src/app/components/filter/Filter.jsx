"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Item,
  Grid,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Container,
} from "@mui/material";
import { Label } from "@mui/icons-material";
import { FilterUrl } from "@/app/utility/filterUrls";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GetAdditionalData } from "@/app/utility/getAdditionalData";
import { Sizes } from "@/app/list/sizes";
import { Prices } from "@/app/list/price";
import { Bedrooms } from "@/app/list/bedrooms";
import { Perches } from "@/app/list/perches";
import { Acres } from "@/app/list/acres";
import { Cities } from "@/app/list/city";
import { comProperty } from "@/app/list/comProperty";
import Showcase from "../showcase/Showcase";
import axios from "axios";
import Items from "@/app/components/items/Items";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Autocomplete from "@mui/material/Autocomplete";
import { IoIosArrowForward } from "react-icons/io";
import { Padding } from "@mui/icons-material";
import Link from "next/link";
import UseSessionStorage from "@/app/UseSessionStorage";
import axiosInstance from "@/app/utility/axiosInstance";

const Filter = ({
  property,
  scollToRef,
  propertyType,
  setCollectionData,
  collectionData,
  setShowHidden,
  showHidden,
  hideProperties,
}) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState(null);
  const [formData, setFormData] = useState(new FormData());

  const [propertyId, setPropertyId] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState("All");
  const [rent, setRent] = useState("All");
  const [size, setSize] = useState("All");
  const [city, setCity] = useState({ title: "All", group: "All" });
  const [bedrooms, setBedrooms] = useState("All");
  const [bathrooms, setBathrooms] = useState("All");
  const [perches, setPerches] = useState("All");
  const [acres, setAcres] = useState("All");
  const [comPropertyS, setComPropertyS] = useState("All");
  const [filteredBy, setFilteredBy] = useState([]);
  const [topCities, setTopCities] = useState([]);

  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          clearIndicator: {
            color: "white",
          },
          popupIndicator: {
            color: "white",
          },
        },
      },
    },
  });

  useEffect(() => {
    handleSubmit();
  }, []);

  const role = UseSessionStorage("contact_user") ? "admin" : "user";
  console.log("role", role);

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      if (scollToRef) {
        scollToRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    try {
      let additionalData = {
        city: city.title,
        role: role,
      };
      console.log("additionalData", additionalData);

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
          propertyTypes: comPropertyS,
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
            if (!value || value === "All") return null;
            console.log("filterd by values", key, ":", value);

            if (typeof value === "object") {
              console.log("Object found:", key, value);
              return `${key}: ${JSON.stringify(value)}`;
            }

            switch (key) {
              case "city":
                return value;
              case "bedrooms":
                return `${value} Bedrooms`;
              case "bathrooms":
                return `${value} Bathrooms`;
              case "size":
                return `${value} sq`;
              case "perches":
                return `${value} Perches`;
              case "acres":
                return `${value} Acres`;
              case "price":
                return `Below Rs.${value}`;
              case "rent":
                return `Below Rs.${value}`;
            }
          }
        );

        const filteredWithoutNull = filteredBy.filter(
          (value) => value !== null
        );
        const filteredWithoutAll = filteredWithoutNull.filter(
          (value) => value !== "All"
        );
        const filteredArray = filteredWithoutAll.filter(Boolean);

        console.log("filteredByCleaned", filteredArray);

        setFilteredBy(filteredArray);

        // const transformedCities = Cities.map((city) => ({
        //   label: city.label,
        //   subheadings: city.subheadings.map((subheading) => subheading.value),
        // }));

        // console.log("transformedCities", transformedCities);
        // let topCities = [];

        // transformedCities?.forEach((transformedCity) => {

        //   if (additionalData?.city == transformedCity.label) {
        //     topCities = transformedCity.subheadings;
        //     // No need to break out of the loop here since we want to check all items
        //   }
        // });

        // // After the loop, check if topCities is still an empty array
        // if (topCities.length === 0) {
        //   // If no match was found, assign [city] to topCities
        //   topCities = [city];
        // }

        // setTopCities(topCities);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const handleSubmitByID = async (e) => {
    e.preventDefault();
    try {
      let additionalData = {
        propertyId,
      };

      console.log("additionalData peroperty id ", additionalData);

      if (additionalData) {
        let url = FilterUrl(propertyType, property);
        url += "Id";
        const response = await axiosInstance.post(url, additionalData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("filter response", response);
        setCollectionData(response.data);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const transformedCities = Cities.flatMap((city) =>
    city.subheadings
      ? city.subheadings.map((subheading) => ({
          title: subheading.label,
          group: city.label,
        }))
      : []
  );
  const allOption = { title: "All", group: "All" };
  const transformedCitiesWithAll = [allOption, ...transformedCities];

  return (
    <>
      <Container>
        <Box sx={{ margin: "40px 0px" }}>
          <form onSubmit={handleSubmit}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: { xs: "column", md: "row" },
                opacity: property && propertyType ? 1 : 0.3,
                pointerEvents: property && propertyType ? "auto" : "none",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="h6"
                  style={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "16px",
                    marginLeft: "10px",
                  }}
                >
                  City
                </Typography>
                <ThemeProvider theme={theme}>
                  <Autocomplete
                    value={city || allOption}
                    onChange={(event, value) => {
                      setCity(value || allOption);
                    }}
                    options={transformedCitiesWithAll}
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => option.title}
                    isOptionEqualToValue={(option, value) =>
                      option.title === value.title
                    }
                    size="small"
                    sx={{
                      height: "50px",
                      width: "100%",
                      backgroundColor: "black",
                      border: "1px solid grey",
                      borderRadius: { xs: "10px", md: "10px 0px 0px 10px" },
                      "& .MuiAutocomplete-inputRoot": {
                        color: "white",
                        fontSize: "16px",
                        border: 0,
                        height: "50px",
                      },
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </ThemeProvider>
              </Box>
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="h6"
                  style={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "16px",
                    marginLeft: "10px",
                  }}
                >
                  {propertyType === "ForSale" ? "Max Price" : "Max Rent"}
                </Typography>
                <Select
                  value={
                    propertyType === "ForSale" ? price || "All" : rent || "All"
                  }
                  onChange={(e) =>
                    propertyType === "ForSale"
                      ? setPrice(e.target.value)
                      : setRent(e.target.value)
                  }
                  inputProps={{ style: { color: "white" } }}
                  size="small"
                  sx={{
                    height: "50px",
                    width: "100%",
                    border: "1px solid grey",
                    borderRadius: { xs: "10px", md: "0px" },
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  {Prices.map((priceOption, index) => (
                    <MenuItem key={index} value={priceOption.value}>
                      {priceOption.label}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              {property === "Commercial" && (
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "16px",
                      marginLeft: "10px",
                    }}
                  >
                    Property Types
                  </Typography>
                  <Select
                    value={comPropertyS || ""}
                    onChange={(e) => setComPropertyS(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      height: "50px",
                      width: "100%",
                      border: "1px solid grey",
                      borderRadius: { xs: "10px", md: "0px" },
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {comProperty.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              {(property === "House" ||
                property === "Commercial" ||
                property === "Apartment") && (
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "16px",
                      marginLeft: "10px",
                    }}
                  >
                    Size
                  </Typography>
                  <Select
                    value={size || "All"}
                    onChange={(e) => setSize(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      height: "50px",
                      width: "100%",
                      border: "1px solid grey",
                      borderRadius: { xs: "10px", md: "0px" },
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {Sizes.map((sizeOption, index) => (
                      <MenuItem key={index} value={sizeOption.value}>
                        {sizeOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              {(property === "House" || property === "Apartment") && (
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "16px",
                      marginLeft: "10px",
                    }}
                  >
                    Bedrooms
                  </Typography>
                  <Select
                    value={bedrooms || "All"}
                    onChange={(e) => setBedrooms(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      height: "50px",
                      width: "100%",
                      border: "1px solid grey",
                      borderRadius: { xs: "10px", md: "0px" },
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {Bedrooms.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              {(property === "House" || property === "Apartment") && (
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "16px",
                      marginLeft: "10px",
                    }}
                  >
                    Bathrooms
                  </Typography>
                  <Select
                    value={bathrooms || "All"}
                    onChange={(e) => setBathrooms(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      height: "50px",
                      width: "100%",
                      border: "1px solid grey",
                      borderRadius: { xs: "10px", md: "0px" },
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {Bedrooms.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              )}
              {property === "Land" && (
                <Box sx={{ width: "100%" }}>
                  <>
                    <Typography
                      variant="h6"
                      style={{
                        color: "white",
                        fontWeight: 500,
                        fontSize: "16px",
                        marginLeft: "10px",
                      }}
                    >
                      Perches
                    </Typography>
                    <Select
                      value={perches || "All"}
                      onChange={(e) => setPerches(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "100%",
                        border: "1px solid grey",
                        borderRadius: { xs: "10px", md: "0px" },
                        backgroundColor: "black",
                        color: "white",
                      }}
                    >
                      {Perches.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                </Box>
              )}
              {property === "Land" && (
                <Box sx={{ width: "100%" }}>
                  <>
                    <Typography
                      variant="h6"
                      style={{
                        color: "white",
                        fontWeight: 500,
                        fontSize: "16px",
                        marginLeft: "10px",
                      }}
                    >
                      Acres
                    </Typography>
                    <Select
                      value={acres || "All"}
                      onChange={(e) => setAcres(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "100%",
                        border: "1px solid grey",
                        borderRadius: { xs: "10px", md: "0px" },
                        backgroundColor: "black",
                        color: "white",
                      }}
                    >
                      {Acres.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                </Box>
              )}
              <Button
                sx={{
                  height: "50px",
                  width: "80%",
                  border: "1px solid grey",
                  marginTop: "24px",
                  backgroundColor: "#8C1C40",
                  color: "white",
                  borderRadius: { xs: "20px", md: "0px 10px 10px 0px" },
                }}
                type="submit"
              >
                Search
              </Button>
            </Grid>
          </form>
        </Box>
        {hideProperties && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                borderRadius: "10px",
                border: "1px solid grey",
                backgroundColor: "#8C1C40",
                color: "white",
                height: "42px",
                width: "40%",
              }}
              onClick={(e) => {
                e.preventDefault();
                const hiddenProperties = collectionData.filter(
                  (data) => data.isVisibale === false
                );

                console.log("hiddenProperties", hiddenProperties);
                setCollectionData(hiddenProperties);
                setShowHidden(true);
              }}
            >
              Show all Hidden Properties
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Filter by Property ID"
                InputProps={{ style: { color: "white" } }}
                type="text"
                size="small"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "10px 0px 0px 10px",
                  width: "300px",
                }}
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                fullWidth
              />
              <Button
                sx={{
                  borderRadius: "0px 10px 10px 0px",
                  border: "1px solid grey",
                  backgroundColor: "#8C1C40",
                  color: "white",
                  height: "42px",
                  width: "100px",
                }}
                onClick={handleSubmitByID}
                disabled={!propertyId}
              >
                Search
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ margin: "10px 0px " }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "15px 0px" }}>
            {property && propertyType && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography color={"#8C1C40"}>{property}</Typography>
                <IoIosArrowForward color={"#8C1C40"} sx={{ padding: "0px" }} />
                <Typography color={"#8C1C40"}>{propertyType}</Typography>
              </Box>
            )}
          </Breadcrumbs>
          {property && propertyType && (
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: "500",
                lineHeight: "18px",
                color: "white",
              }}
            >
              {property} {propertyType} in Sri Lanka ({collectionData?.length}{" "}
              properties)
            </Typography>
          )}

          <Box sx={{ margin: "20px 0px" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {filteredBy.length > 0 && (
                <Box sx={{ display: "flex", gap: "10px" }}>
                  <Typography
                    sx={{ color: "white", fontSize: "20px", marginTop: "2px" }}
                  >
                    Filtered By:
                  </Typography>
                  <Box>
                    <Items data={filteredBy} disableDelete={true} />
                  </Box>
                </Box>
              )}
              {/* {topCities.length > 0 && (
                <Box sx={{ display: "flex", gap: "17px" }}>
                  <Typography
                    sx={{ color: "white", fontSize: "20px", marginTop: "2px" }}
                  >
                    Top Cities:
                  </Typography>
                  <Box>
                    {" "}
                    <Items data={topCities} disableDelete={true} />{" "}
                  </Box>
                </Box>
              )} */}
              {/* <Items data={city}  /> */}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Filter;
