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
import { Rents } from "@/app/list/priceRent";
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

  const [propertyId, setPropertyId] = useState(null);
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
  const [tempCollectionData, setTempCollectionData] = useState([]);

  const [selectStates, setSelectStates] = useState(Array(8).fill(false));

  const handleOpen = (index) => {
    setSelectStates(prevSelectStates => {
      const newArray = [...prevSelectStates];
      newArray[index] = true;
      return newArray;
    });
  };

  const handleClose = (index) => {
    setSelectStates(prevSelectStates => {
      const newArray = [...prevSelectStates];
      newArray[index] = false;
      return newArray;
    });
  };

  const handleWindowScroll = () => {
    setSelectStates(Array(8).fill(false));
  };

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll);

    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

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
          propertyTypes: comPropertyS,
        };
      } else if (property === "Land") {
        additionalData = {
          ...additionalData,
          perches: parseInt(perches),
          acres: parseInt(acres),
        };
      }

      let response = null;

      if (sessionStorage.getItem("contact_user")) {
        response = await axiosInstance.post(
          `${FilterUrl(propertyType, property)}/admin`,
          additionalData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          FilterUrl(propertyType, property),
          additionalData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      setCollectionData(response.data);
      setTempCollectionData(response.data);

      if (response.data && additionalData) {
        const filteredBy = Object.entries(additionalData).map(
          ([key, value]) => {
            if (!value || value === "All") return null;

            if (typeof value === "object") {
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
              case "propertyTypes":
                return value;
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

        setFilteredBy(filteredArray);

      }
    } catch (error) {
      console.debug(error);
    }
  };

  const toggleHideProperties = (e) => {
    e.preventDefault();
    if (showHidden) {
      const hiddenProperties = tempCollectionData.filter((data) => data.isVisibale === false);
      setCollectionData(hiddenProperties);
      setShowHidden(false);
    } else {
      setCollectionData(tempCollectionData);
      setShowHidden(true);
    }
  }

  const handleSubmitByID = async (e) => {
    e.preventDefault();
    try {
      let additionalData = {
        propertyId,
      };

      if (additionalData) {
        let url = FilterUrl(propertyType, property);
        url += "Id";
        const response = await axiosInstance.post(url, additionalData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
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

  const comAllComProperties = [{ value: "All", label: "All" }, ...comProperty];

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
                    open={selectStates[0]}
                    onClose={() => handleClose(0)}
                    onOpen={() => handleOpen(0)}
                    value={city || allOption}
                    onChange={(event, value) => {
                      setCity(value || '');
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
                  open={selectStates[1]}
                  onClose={() => handleClose(1)}
                  onOpen={() => handleOpen(1)}
                  MenuProps={{
                    disableScrollLock: true,
                  }}
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
                    '.MuiSvgIcon-root ': {
                      fill: "white !important",
                    }
                  }}
                >
                  {propertyType === "ForSale" ? (
                    Prices.map((priceOption, index) => (
                      <MenuItem key={index} value={priceOption.value}>
                        {priceOption.label}
                      </MenuItem>
                    ))
                  ) : (
                    Rents.map((priceOption, index) => (
                      <MenuItem key={index} value={priceOption.value}>
                        {priceOption.label}
                      </MenuItem>
                    ))
                  )}
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
                    open={selectStates[2]}
                    onClose={() => handleClose(2)}
                    onOpen={() => handleOpen(2)}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                    value={comPropertyS || "All"}
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
                      '.MuiSvgIcon-root ': {
                        fill: "white !important",
                      }
                    }}
                  >
                    {comAllComProperties.map((type, index) => (
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
                      open={selectStates[3]}
                      onClose={() => handleClose(3)}
                      onOpen={() => handleOpen(3)}
                      MenuProps={{
                        disableScrollLock: true,
                      }}
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
                        '.MuiSvgIcon-root ': {
                          fill: "white !important",
                        }
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
                    open={selectStates[4]}
                    onClose={() => handleClose(4)}
                    onOpen={() => handleOpen(4)}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
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
                      '.MuiSvgIcon-root ': {
                        fill: "white !important",
                      }
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
                    open={selectStates[5]}
                    onClose={() => handleClose(5)}
                    onOpen={() => handleOpen(5)}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
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
                      '.MuiSvgIcon-root ': {
                        fill: "white !important",
                      }
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
                      open={selectStates[6]}
                      onClose={() => handleClose(6)}
                      onOpen={() => handleOpen(6)}
                      MenuProps={{
                        disableScrollLock: true,
                      }}
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
                        '.MuiSvgIcon-root ': {
                          fill: "white !important",
                        }
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
                      open={selectStates[7]}
                      onClose={() => handleClose(7)}
                      onOpen={() => handleOpen(7)}
                      MenuProps={{
                        disableScrollLock: true,
                      }}
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
                        '.MuiSvgIcon-root ': {
                          fill: "white !important",
                        }
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
                backgroundColor: (showHidden ? 'transparent' : '#8C1C40'),
                color: "white",
                height: "42px",
                width: "40%",
              }}
              onClick={(e) => { toggleHideProperties(e); }}
            >
              Show Only Hidden Properties
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
                <Typography color={"#8C1C40"}>{propertyType === "ForSale" ? "For Sale": "For Rent"}</Typography>
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
              {property} {propertyType === "ForSale" ? "For Sale": "For Rent"} in Sri Lanka ({collectionData?.length}{" "}
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
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Filter;
