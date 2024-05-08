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
import { GetAdditionalData } from "@/app/utility/getAdditionalData";
import { Sizes } from "@/app/list/sizes";
import { Prices } from "@/app/list/price";
import { Bedrooms } from "@/app/list/bedrooms";
import { Perches } from "@/app/list/perches";
import { Acres } from "@/app/list/acres";
import { Cities } from "@/app/list/city";
import { PropertyTypes } from "@/app/list/propertyTypes";
import Showcase from "../showcase/Showcase";
import axios from "axios";

const Filter = ({ property, propertyType, setCollectionData }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState(null);
  const [formData, setFormData] = useState(new FormData());

  const [propertyId, setPropertyId] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [rent, setRent] = useState(null);
  const [size, setSize] = useState(null);
  const [city, setCity] = useState("All of Colombo");
  const [bedrooms, setBedrooms] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [perches, setPerches] = useState(null);
  const [acres, setAcres] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState(null);
  const [openCityDropDown, setOpenCityDropDown] = useState(false);
  console.log(" property, propertyType", property, propertyType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let additionalData = {
        city: city,
      };

      if (propertyType === "ForSale") {
        additionalData.price = parseInt(price);
      } else if (propertyType === "ForRent") {
        additionalData.rent = parseInt(rent);
      }

      if (property === "House" || property === "Appartment") {
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
      // formData.append("additionalData", additionalData);

      if (additionalData) {
        const response = await axios.post(
          FilterUrl(propertyType, property),
          additionalData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("filter response", response);
        setCollectionData(response.data);
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
      // formData.append("additionalData", additionalData);

      if (additionalData) {
        let url = FilterUrl(propertyType, property);
        url += "Id";
        const response = await axios.post(url, additionalData, {
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
                opacity: property && propertyType ? 1 : 0.3,
                pointerEvents: property && propertyType ? "auto" : "none",
              }}
            >
              <Box>
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
                <select
                  required
                  style={{
                    height: "50px",
                    width: "200px",
                    border: "1px solid grey",

                    backgroundColor: "black",
                    color: "white",
                    borderRadius: "10px 0px 0px 10px",
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
                      style={{ padding: "20px" }}
                    >
                      {cityItem.subheadings.map((subheading) => (
                        <option value={subheading.value} key={subheading.value}>
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
                    color: "white",
                    fontWeight: 500,
                    fontSize: "16px",
                    marginLeft: "10px",
                  }}
                >
                  {propertyType === "ForSale" ? "Price" : "Rent"}
                </Typography>
                <Select
                  required
                  placeholder={
                    propertyType === "ForSale" ? "Select price" : "Select rent"
                  }
                  value={propertyType === "ForSale" ? price : rent}
                  onChange={(e) =>
                    propertyType === "ForSale"
                      ? setPrice(e.target.value)
                      : setRent(e.target.value)
                  }
                  inputProps={{ style: { color: "white" } }}
                  size="small"
                  sx={{
                    height: "50px",
                    width: "200px",
                    border: "1px solid grey",

                    backgroundColor: "black",
                    color: "white",
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
              <Box>
                {property === "Commercial" && (
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
                      Property Types
                    </Typography>
                    <Select
                      required
                      value={propertyTypes}
                      onChange={(e) => setPropertyTypes(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "200px",
                        border: "1px solid grey",

                        backgroundColor: "black",
                        color: "white",
                      }}
                      fullWidth
                    >
                      {PropertyTypes.map((type, index) => (
                        <MenuItem key={index} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
              <Box>
                {(property === "House" ||
                  property === "Commercial" ||
                  property === "Appartment") && (
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
                      Size
                    </Typography>
                    <Select
                      required
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "200px",
                        border: "1px solid grey",

                        backgroundColor: "black",
                        color: "white",
                      }}
                      fullWidth
                    >
                      {Sizes.map((sizeOption, index) => (
                        <MenuItem key={index} value={sizeOption.value}>
                          {sizeOption.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
              <Box>
                {(property === "House" || property === "Appartment") && (
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
                      Bedrooms
                    </Typography>
                    <Select
                      required
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "200px",
                        border: "1px solid grey",

                        backgroundColor: "black",
                        color: "white",
                      }}
                      fullWidth
                    >
                      {Bedrooms.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
              <Box>
                {(property === "House" || property === "Appartment") && (
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
                      Bathrooms
                    </Typography>
                    <Select
                      required
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "200px",
                        border: "1px solid grey",

                        backgroundColor: "black",
                        color: "white",
                      }}
                      fullWidth
                    >
                      {Bedrooms.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
              <Box>
                {property === "Land" && (
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
                      required
                      value={perches}
                      onChange={(e) => setPerches(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "200px",
                        border: "1px solid grey",

                        backgroundColor: "black",
                        color: "white",
                      }}
                      fullWidth
                    >
                      {Perches.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
              <Box>
                {property === "Land" && (
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
                      required
                      value={acres}
                      onChange={(e) => setAcres(e.target.value)}
                      inputProps={{ style: { color: "white" } }}
                      size="small"
                      sx={{
                        height: "50px",
                        width: "200px",
                        border: "1px solid grey",

                        backgroundColor: "black",
                        color: "white",
                      }}
                      fullWidth
                    >
                      {Acres.map((option, index) => (
                        <MenuItem key={index} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </Box>
              <Button
                sx={{
                  height: "50px",
                  width: "200px",
                  border: "1px solid grey",
                  marginTop: "24px",
                  backgroundColor: "#8C1C40",
                  color: "white",
                  borderRadius: "0px 10px 10px 0px",
                }}
                type="submit"
              >
                Search
              </Button>
            </Grid>
          </form>
        </Box>
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
          >
            All Hidden Properties
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              required
              variant="outlined"
              placeholder="Property ID"
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
      </Container>
    </>
  );
};

export default Filter;
