"use client";
import { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
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
import { GetOneUrl } from "@/app/utility/getOneUrl";
import { EditUrl } from "@/app/utility/editUrl";
import { Sizes } from "@/app/list/sizes";
import { Prices } from "@/app/list/price";
import { Bedrooms } from "@/app/list/bedrooms";
import { Perches } from "@/app/list/perches";
import { Acres } from "@/app/list/acres";
import { Cities } from "@/app/list/city";
import { comProperty } from "@/app/list/comProperty";
import EditImage from "../../../../public/images/edit.png";
import AuthContext from "@/app/context/AuthContext";
import UseSessionStorage from "@/app/UseSessionStorage";
import axiosInstance from "@/app/utility/axiosInstance";
import { CldImage } from "next-cloudinary";
import Autocomplete from "@mui/material/Autocomplete";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CitySelectionDialog } from "@/app/components/citySelectionDialog/CitySelectionDialog";
import BASE_URL from "../../config";

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

const url = `${BASE_URL}/api/apartmentForRent/add`;
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

function Edit() {
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState(null);
  const [propertyType, setPropertyType] = useState("ForSale");
  const [property, setProperty] = useState("House");
  const [propertyId, setPropertyId] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [rent, setRent] = useState(null);
  const [size, setSize] = useState(null);
  const [city, setCity] = useState(null);
  const [bedrooms, setBedrooms] = useState(null);
  const [bathrooms, setBathrooms] = useState(null);
  const [perches, setPerches] = useState(null);
  const [acres, setAcres] = useState(null);
  const [comPropertyType, setComPropertyType] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [formUrl, setFormUrl] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [thumbnailUploaded, setThumbnailUploaded] = useState(false);
  const [showCitiesDialog, setShowCitiesDialog] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("contact_user");
    if (!isUserLoggedIn) router.push("/");
  }, []);
  console.log("city", city);
  const submitThumbnailRef = useRef(null);
  const submitMulImageRef = useRef(null);

  const additionalFormData = new FormData();
  const thumbnailFormData = new FormData();
  const imageFormData = new FormData();

  const fetchData = async () => {
    const currentUrl = window.location.href;

    const urlParts = currentUrl.split("?");
    const queryString = urlParts[1];

    const urlParams = new URLSearchParams(queryString);

    const propertyValue = urlParams.get("propertyValue");
    const propertyTypeValue = urlParams.get("propertyType");
    const id = urlParams.get("id");

    if ((propertyValue, propertyTypeValue, id)) {
      try {
        const url = await GetOneUrl(propertyValue, propertyTypeValue, id);
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setEditFormData(response.data);
        setPropertyType(response?.data?.propertyType);
        setProperty(response?.data?.property);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (editFormData) {
      setPropertyType(editFormData?.propertyType);
      setProperty(editFormData?.property);
      setPropertyId(editFormData?.propertyId);
      setTitle(editFormData?.title);
      setDescription(editFormData?.description);
      setPrice(editFormData?.price);
      setRent(editFormData?.rent);
      setSize(editFormData?.size);
      setCity({ title: editFormData?.city, group: editFormData?.city });
      setBedrooms(editFormData?.bedrooms);
      setBathrooms(editFormData?.bathrooms);
      setPerches(editFormData?.landExtent?.perches);
      setAcres(editFormData?.landExtent?.acres);
      setComPropertyType(editFormData?.propertyTypes);
      setThumbnail(editFormData?.thumbnailImage);
      setImages(editFormData?.images);

      const url = EditUrl(property, propertyType, editFormData?._id);
      setFormUrl(url);
    }
  }, [editFormData]);

  const addAdditionalData = async (e) => {
    e.preventDefault();
    try {
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

      console.log(additionalData);
      additionalFormData.append(
        "additionalData",
        JSON.stringify(additionalData)
      );

      await axiosInstance
        .put(`${formUrl}/additionalData`, additionalFormData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          Swal.fire({
            title: "Data Added Successfully",
            icon: "success",
            timer: 1500,
          });
          setTimeout(() => {
            window.location.href = `/admin/view/${property}/${propertyType}`;
          }, 1000);
        });
    } catch (error) {
      Swal.fire({
        title: "Unable to Add Data",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    }
  };

  const uploadThumbnail = async (e) => {
    const file = e.target.files[0];
    setThumbnailUploaded(true);
    setThumbnail(file);
    thumbnailFormData.delete("thumbnail");
    thumbnailFormData.append("thumbnail", file);

    thumbnailFormData.append("propertyId", propertyId);

    await axiosInstance
      .put(`${formUrl}/uploadThumbnail`, thumbnailFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const uploadImages = async (e) => {
    const files = e.target.files;
    imageFormData.delete("image");

    if (files.length > 20) {
      Swal.fire({
        title: "You can only select up to 20 files.",
        icon: "error",
        confirmButtonText: "Cancel",
      });
      return;
    }

    setImages(files);

    for (let i = 0; i < files.length; i++) {
      imageFormData.append("image", files[i]);
    }

    imageFormData.append("propertyId", propertyId);

    await axiosInstance
      .put(`${formUrl}/uploadImages`, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    setImageUploaded(true);
  };

  const transformedCities = Cities.flatMap((city) =>
    city.subheadings
      ? city.subheadings.map((subheading) => ({
        title: subheading.label,
        group: city.label,
      }))
      : []
  );

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
            src={EditImage}
            alt="Admin Edit"
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
            Edit Property Details
          </Typography>

          <form onSubmit={addAdditionalData}>
            <Grid container gap={3}>
              {/* Property ID */}
              {/* <Typography
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
                onChange={(e) => setPropertyId(propertyId)}
                fullWidth
              /> */}

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
                    onChange={(e) => uploadThumbnail(e)}
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
                    {thumbnail &&
                      (thumbnailUploaded ? (
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
                      ) : (
                        <CldImage
                          src={thumbnail}
                          version="2"
                          sizes="20vw"
                          width={150}
                          height={150}
                          alt="Thumbnail"
                          style={{
                            margin: "20px 10px",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      ))}

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
                    onChange={(e) => uploadImages(e)}
                    multiple
                    ref={submitMulImageRef}
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
                          return imageUploaded ? (
                            <Image
                              key={index}
                              src={URL.createObjectURL(img)}
                              alt="Image"
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
                          ) : (
                            <CldImage
                              key={index}
                              src={img}
                              version="2"
                              sizes="20vw"
                              width={150}
                              height={150}
                              alt="Image"
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
                {propertyType === "ForSale" ? "Max Price" : "Max Rent"}
              </Typography>

              <TextField
                required
                value={
                  propertyType === "ForSale" ? price || "All" : rent || "All"
                }
                onChange={(e) =>
                  propertyType === "ForSale"
                    ? setPrice(e.target.value)
                    : setRent(e.target.value)
                }
                InputProps={{ style: { color: "white" } }}
                size="small"
                type="number"
                sx={{
                  border: "1px solid grey",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "5px",
                }}
                fullWidth
              />

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
                  {city?.title}
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
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </form>
        </Container>
      </div>
    </>
  );
}

export default Edit;
