"use client";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import Swal from "sweetalert2";
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
} from "@mui/material";
import Container from "@mui/material/Container";
import { Label } from "@mui/icons-material";
import { AddUrl } from "@/app/utility/addUrl";
import { GetAdditionalData } from "@/app/utility/getAdditionalData";
import { Sizes } from "@/app/list/sizes";
import { Prices } from "@/app/list/price";
import { Bedrooms } from "@/app/list/bedrooms";
import { Perches } from "@/app/list/perches";
import { Acres } from "@/app/list/acres";
import { Cities } from "@/app/list/city";
import { comProperty } from "@/app/list/comProperty";
import AddImage from "../../../../public/images/add.png";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import axiosInstance from "@/app/utility/axiosInstance";
import Autocomplete from "@mui/material/Autocomplete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import BASE_URL from "../../config";
import { CitySelectionDialog } from "@/app/components/citySelectionDialog/CitySelectionDialog";

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

const Input = ({ label, value, onChange }) => {
  return (
    <Grid item md={12}>
      <TextField
        id="outlined-password-input"
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        required
      />
    </Grid>
  );
};

function Add() {
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [propertyType, setPropertyType] = useState(null);
  const [property, setProperty] = useState(null);
  const [propertyId, setPropertyId] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [rent, setRent] = useState(null);
  const [size, setSize] = useState(null);
  const [city, setCity] = useState({ title: "Maharagama", group: "Colombo" });
  const [bedrooms, setBedrooms] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [perches, setPerches] = useState(null);
  const [acres, setAcres] = useState(null);
  const [comPropertyType, setComPropertyType] = useState(null);
  const [openCityDropDown, setOpenCityDropDown] = useState(false);
  const submitThumbnailRef = useRef(null);
  const submitMulImageRef = useRef(null);
  const router = useRouter();
  const [selectStates, setSelectStates] = useState(Array(2).fill(false));
  const [showCitiesDialog, setShowCitiesDialog] = useState(false);

  const handleOpen = (index) => {
    setSelectStates((prevSelectStates) => {
      const newArray = [...prevSelectStates];
      newArray[index] = true;
      return newArray;
    });
  };

  const handleClose = (index) => {
    setSelectStates((prevSelectStates) => {
      const newArray = [...prevSelectStates];
      newArray[index] = false;
      return newArray;
    });
  };

  const handleWindowScroll = () => {
    setSelectStates(Array(2).fill(false));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("contact_user");
    if (!isUserLoggedIn) router.push("/");
  }, []);
  const createPost = async () => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/customize/propertyid/check`,
        { propertyId: propertyId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.available) {
        Swal.fire({
          title: "Property Id Already Exists",
          icon: "error",
          timer: 1500,
        });
      } else {
        let additionalData = {
          propertyId: propertyId,
          title: title,
          description: description,
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
            propertyTypes: comPropertyType,
          };
        } else if (property === "Land") {
          additionalData = {
            ...additionalData,
            perches: parseInt(perches),
            acres: parseInt(acres),
          };
        }

        console.log("additionalData", additionalData);
        formData.append("additionalData", JSON.stringify(additionalData));
        const response = await axiosInstance.post(
          AddUrl(propertyType, property),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        Swal.fire({
          title: "Data Added Successfully",
          icon: "success",
          timer: 1500,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        title: "Unable to data",
        icon: "error",
        timer: 1500,
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (thumbnail && images) {
      createPost();
    } else {
      Swal.fire({
        title: "Images not selected",
        icon: "error",
        timer: 1500,
      });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    console.log("thumbnail", thumbnail);
  };

  const handleMultipleFileUpload = (e) => {
    const files = e.target.files;
    console.log("before Files", files);
    formData.delete("myFiles");

    if (files.length > 20) {
      Swal.fire({
        title: "You can only select up to 20 files.",
        icon: "error",
        confirmButtonText: "Cancel",
      });
      return;
    }
    setImages(files);

    const thumbnailsArray = thumbnail ? [thumbnail] : [];
    const allFiles = [...thumbnailsArray, ...files];

    for (let i = 0; i < allFiles.length; i++) {
      formData.append("myFiles", allFiles[i]);
    }
    console.log("files", allFiles);
  };

  const handleCitySelect = (value) => {
    setCity(value);
  };
  const handleCityDialogOpen = () => {
    setShowCitiesDialog(true);
  };

  const handleCityDialogClose = () => {
    setShowCitiesDialog(false);
  };

  return (
    <>
      <Navbar type={"admin"} />
      <div>
        <Box style={{ width: "100vw", minheight: "550px", overflow: "hidden" }}>
          <Image
            src={AddImage}
            alt="Admin Add"
            layout="responsive"
            width={100}
            height={55}
            quality={100}
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Container maxWidth="lg" sx={{ mt: "50px", py: 5, mb: 5 }}>
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "28px",
              lineHeight: "37.5px",
              color: "white",
            }}
          >
            Add New Properties
          </Typography>
          <Typography
            sx={{
              fontWeight: "400",
              fontSize: "22px",
              lineHeight: "33.5px",
              color: "white",
              mt: "30px",
            }}
          >
            Type
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              ml: "20px",
              my: "15px",
              gap: { md: "0px", xs: "20px" },
            }}
          >
            <Select
              open={selectStates[0]}
              onClose={() => handleClose(0)}
              onOpen={() => handleOpen(0)}
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              sx={{
                minWidth: 320,
                mr: "10px",
                border: "1px solid grey",
                color: "white",
              }}
              size="small"
              displayEmpty
              placeholder="Select Property"
            >
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Land">Land</MenuItem>
              <MenuItem value="Apartment">Apartment</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
            </Select>

            <Select
              open={selectStates[1]}
              onClose={() => handleClose(1)}
              onOpen={() => handleOpen(1)}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              sx={{
                minWidth: 320,
                border: "1px solid grey",
                color: "white",
              }}
              size="small"
              displayEmpty
              placeholder="Select Property Type"
            >
              <MenuItem value="ForSale">For Sale</MenuItem>
              <MenuItem value="ForRent">For Rent</MenuItem>
            </Select>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container gap={3}>
              {/* Property ID */}
              <Typography
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "22px",
                }}
              >
                Property ID
              </Typography>
              <TextField
                required
                variant="outlined"
                InputProps={{ style: { color: "white" } }}
                type="text"
                size="small"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "5px",
                }}
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                fullWidth
              />

              {/* Title */}
              <Typography
                variant="h6"
                style={{
                  color: "white",
                  fontWeight: 500,

                  fontSize: "22px",
                  marginLeft: "10px",
                }}
              >
                Title
              </Typography>
              <TextField
                required
                InputProps={{ style: { color: "white" } }}
                size="small"
                type="text"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "5px",
                }}
                value={title}
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
              />
              {/* Title */}
              <Typography
                variant="h6"
                style={{
                  color: "white",
                  fontWeight: 500,

                  fontSize: "22px",
                  marginLeft: "10px",
                }}
              >
                Image
              </Typography>
              <Grid item md={12} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { md: "row", xs: "column" },
                    marginLeft: "20px",
                  }}
                >
                  <input
                    type="file"
                    label="Image"
                    name="myFile"
                    id="file-upload"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleFileUpload(e)}
                    ref={submitThumbnailRef}
                    hidden
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {thumbnail && (
                      <Image
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail"
                        width={150}
                        height={150}
                        style={{
                          margin: "20px 10px",
                          borderRadius: "5px",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <Button
                      sx={{
                        color: "white",
                        backgroundColor: "#8C1C40",
                        borderRadius: "5px",
                        margin: "10px 0px",
                        width: "150px",
                      }}
                      onClick={() =>
                        submitThumbnailRef.current &&
                        submitThumbnailRef.current.click()
                      }
                    >
                      Choose Thumbnail
                    </Button>
                  </Box>

                  <hr
                    style={{
                      widht: "10px",
                      margin: "0px 40px",
                      padding: "0px",
                    }}
                  />

                  <input
                    type="file"
                    label="Image"
                    name="myFiles"
                    id="file-uploads"
                    accept=".jpeg, .png, .jpg"
                    onChange={(e) => handleMultipleFileUpload(e)}
                    multiple
                    ref={submitMulImageRef}
                    hidden
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                        width: "100%",
                      }}
                    >
                      {images &&
                        Array.from(images).map((img, index) => {
                          return (
                            <Image
                              key={index}
                              src={URL.createObjectURL(img)}
                              alt="img"
                              width={150}
                              height={150}
                              style={{
                                margin: "10px",
                                borderRadius: "5px",
                                objectFit: "cover",
                                flex: "1 1 calc(20% - 20px)",
                                maxWidth: "150px",
                              }}
                            />
                          );
                        })}
                    </Box>
                    <Button
                      sx={{
                        color: "white",
                        backgroundColor: "#8C1C40",
                        borderRadius: "5px",
                        margin: "10px 0px",
                      }}
                      onClick={() =>
                        submitMulImageRef.current &&
                        submitMulImageRef.current.click()
                      }
                    >
                      Choose Images
                    </Button>
                  </Box>
                </Box>
              </Grid>
              <br />
              {/* Description */}
              <Typography
                variant="h6"
                style={{
                  color: "white",
                  fontWeight: 500,

                  fontSize: "22px",
                }}
              >
                Description
              </Typography>
              <TextField
                required
                value={description || ""}
                InputProps={{ style: { color: "white" } }}
                size="small"
                multiline
                rows={4}
                type="text"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "5px",
                }}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              <Typography
                variant="h6"
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "22px",
                  marginLeft: "10px",
                }}
              >
                {propertyType === "ForSale" ? "Price" : "Rent"}
              </Typography>

              <TextField
                required
                value={propertyType === "ForSale" ? price || "" : rent || ""}
                InputProps={{ style: { color: "white" } }}
                size="small"
                type="number"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "5px",
                }}
                onChange={(e) =>
                  propertyType === "ForSale"
                    ? setPrice(e.target.value)
                    : setRent(e.target.value)
                }
                fullWidth
              />

              {/* <Typography
                variant="h6"
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: "22px",
                  marginLeft: "10px",
                }}
              >
                {propertyType === "ForSale" ? "Price" : "Rent"}
              </Typography>
              <Select
                required
                value={propertyType === "ForSale" ? price || "" : rent || ""}
                onChange={(e) =>
                  propertyType === "ForSale"
                    ? setPrice(e.target.value)
                    : setRent(e.target.value)
                }
                inputProps={{ style: { color: "white" } }}
                size="small"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "5px",
                }}
                fullWidth
              >
                {Prices.map((priceOption, index) =>
                  priceOption.value === "All" ? null : (
                    <MenuItem key={index} value={priceOption.value}>
                      {priceOption.label}
                    </MenuItem>
                  )
                )}
              </Select> */}
              {property === "Commercial" && (
                <>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    Property Type
                  </Typography>
                  <Select
                    required
                    value={comPropertyType || ""}
                    onChange={(e) => setComPropertyType(e.target.value)}
                    inputProps={{ style: { color: "white" } }}
                    size="small"
                    sx={{
                      border: "1px solid grey",
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    fullWidth
                  >
                    {comProperty.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {(property === "House" ||
                property === "Commercial" ||
                property === "Apartment") && (
                  <>
                    <Typography
                      variant="h6"
                      style={{
                        color: "white",
                        fontWeight: 500,
                        fontSize: "22px",
                        marginLeft: "10px",
                      }}
                    >
                      Size
                    </Typography>
                    {/* <TextField
                    required
                    value={size}
                    InputProps={{ style: { color: "white" } }}
                    size="small"
                    type="number"
                    sx={{
                      border: "1px solid grey",
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => setSize(e.target.value)}
                    fullWidth
                  /> */}

                    <TextField
                      required
                      value={size || ""}
                      InputProps={{ style: { color: "white" } }}
                      size="small"
                      type="number"
                      sx={{
                        border: "1px solid grey",
                        color: "white",
                        marginLeft: "20px",
                        borderRadius: "5px",
                      }}
                      onChange={(e) => setSize(e.target.value)}
                      fullWidth
                    />
                  </>
                )}

              {(property === "House" || property === "Apartment") && (
                <>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    Bedrooms
                  </Typography>
                  <TextField
                    required
                    value={bedrooms || ""}
                    InputProps={{ style: { color: "white" } }}
                    size="small"
                    type="number"
                    sx={{
                      border: "1px solid grey",
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => setBedrooms(e.target.value)}
                    fullWidth
                  />
                </>
              )}

              {(property === "House" || property === "Apartment") && (
                <>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    Bathrooms
                  </Typography>
                  <TextField
                    required
                    value={bathrooms || ""}
                    InputProps={{ style: { color: "white" } }}
                    size="small"
                    type="number"
                    sx={{
                      border: "1px solid grey",
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => setBathrooms(e.target.value)}
                    fullWidth
                  />
                </>
              )}

              {property === "Land" && (
                <>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    Perches
                  </Typography>
                  <TextField
                    required
                    value={perches || ""}
                    InputProps={{ style: { color: "white" } }}
                    size="small"
                    type="number"
                    sx={{
                      border: "1px solid grey",
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => setPerches(e.target.value)}
                    fullWidth
                  />
                </>
              )}
              {property === "Land" && (
                <>
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: 500,
                      fontSize: "22px",
                      marginLeft: "10px",
                    }}
                  >
                    Acres
                  </Typography>
                  <TextField
                    required
                    value={acres || ""}
                    InputProps={{ style: { color: "white" } }}
                    size="small"
                    type="number"
                    sx={{
                      border: "1px solid grey",
                      color: "white",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    onChange={(e) => setAcres(e.target.value)}
                    fullWidth
                  />
                </>
              )}
              <Box sx={{ width: "100%" }}>
                <Typography
                  variant="h6"
                  style={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: "22px",
                    marginLeft: "10px",
                  }}
                >
                  City
                </Typography>
                <Button
                  style={{ justifyContent: "flex-start", paddingLeft: "15px", textTransform: "none", fontSize: "16px" }}
                  sx={{
                    border: "1px solid grey",
                    width: "98%",
                    color: "white",
                    height: "43px",
                    marginLeft: "20px",
                    borderRadius: "5px",
                    ".MuiSvgIcon-root ": {
                      fill: "white !important",
                    },
                  }}
                  onClick={handleCityDialogOpen}
                >
                  {city.title}
                </Button>
                <CitySelectionDialog
                  open={showCitiesDialog}
                  onClose={handleCityDialogClose}
                  onSelect={handleCitySelect}
                />
              </Box>
            </Grid>

            <Grid item md={12}>
              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button
                  sx={{
                    border: "1px solid grey",
                    padding: "40px, 250px, 40px, 25",
                    color: "white",
                    mt: "40px",
                  }}
                  type="submit"
                >
                  Add Property
                </Button>
              </Box>
            </Grid>
          </form>
        </Container>
      </div>
    </>
  );
}

export default Add;
