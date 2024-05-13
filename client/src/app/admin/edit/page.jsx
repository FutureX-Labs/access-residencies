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
import { PropertyTypes } from "@/app/list/propertyTypes";
import EditImage from "../../../../public/images/edit.png";
import AuthContext from "@/app/context/AuthContext";
import UseSessionStorage from "@/app/UseSessionStorage";

import BASE_URL from "../../config";

const url = `${BASE_URL}/api/appartmentForRent/add`;
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
  const [formData, setFormData] = useState(new FormData());
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
  const [propertyTypes, setPropertyTypes] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("contact_user");
    if (!isUserLoggedIn) router.push("/");
  }, []);

  const submitThumbnailRef = useRef(null);
  const submitMulImageRef = useRef(null);

  console.log("editFormData", editFormData);
  const fetchData = async () => {
    const currentUrl = window.location.href;

    const urlParts = currentUrl.split("?");
    const queryString = urlParts[1];

    const urlParams = new URLSearchParams(queryString);

    const propertyValue = urlParams.get("propertyValue");
    const propertyTypeValue = urlParams.get("propertyType");
    const id = urlParams.get("id");

    console.log("propertyValue", propertyValue);
    console.log("propertyTypeValue", propertyTypeValue);
    console.log("id", id);

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
        console.log("url:", url);
        console.log("response:", response);
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
      setCity(editFormData?.city);
      setBedrooms(editFormData?.bedrooms);
      setBathrooms(editFormData?.bathrooms);
      setPerches(editFormData?.landExtent?.perches);
      setAcres(editFormData?.landExtent?.acres);
      setPropertyTypes(editFormData?.propertyTypes);
      setThumbnail(editFormData?.thumbnailImage);
      setImages(editFormData?.images);
    }
  }, [editFormData]);

  // console.log("size", size);

  console.log("property", property);
  console.log("propertyType", propertyType);
  const createPost = async () => {
    try {
      let additionalData = {
        propertyId: propertyId,
        title: title,
        description: description,
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
      console.log("additionalData", propertyType);
      console.log("additionalData", property);

      const url = await EditUrl(property, propertyType, editFormData?._id);
      console.log("urlEdit", url);
      formData.append("additionalData", JSON.stringify(additionalData));
      const response = await axios.put(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Data Added Successfully",
        icon: "success",
        timer: 1500,
      });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
      console.log(response);
    } catch (error) {
      Swal.fire({
        title: "Unable to data",
        icon: "error",
        timer: 1500,
      });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (
    //   typeof thumbnail === "object" &&
    //   Array.isArray(images) &&
    //   images.every((img) => typeof img === "object")
    // ) {
    createPost();
    // } else {
    //   console.log("No image selected");
    //   Swal.fire({
    //     title: "Kindly select all the Images",
    //     icon: "error",
    //     timer: 1500,
    //   });
    // }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    console.log("thumbnail", typeof thumbnail);
  };
  console.log(thumbnail);
  const handleMultipleFileUpload = (e) => {
    const files = e.target.files;
    console.log("before Files", files);
    formData.delete("myFiles");
    setImages([]);

    if (files.length > 3) {
      Swal.fire({
        title: "You can only select up to 3 files.",
        icon: "error",
        confirmButtonText: "Cancel",
      });
      return;
    }

    // Convert thumbnail to an array if it's not already
    const thumbnailsArray = thumbnail ? [thumbnail] : [];
    console.log("thumbnailsArray", thumbnailsArray);
    // Concatenate thumbnail with files
    const allFiles = [...files, ...thumbnailsArray];

    for (let i = 0; i < allFiles.length; i++) {
      formData.append("myFiles", allFiles[i]);
    }
    if (thumbnail) {
      allFiles.pop();
    }
    setImages(allFiles);
    console.log("files", allFiles);
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
          {/* <Typography
            sx={{
              fontWeight: "400",
              fontSize: "22px",
              lineHeight: "33.5px",
              color: "white",
              mt: "30px",
            }}
          >
            Type
          </Typography> */}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
              ml: "20px",
              my: "15px",
              gap: { md: "0px", xs: "20px" },
            }}
          >
            <Select
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
              <MenuItem value="Appartment">Appartment</MenuItem>
              <MenuItem value="Commercial">Commercial</MenuItem>
            </Select>

            <Select
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
          </Box> */}

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
                    {thumbnail && typeof thumbnail === "object" ? (
                      <Image
                        src={URL.createObjectURL(thumbnail)}
                        alt="Thumbnail"
                        width={150}
                        height={150}
                        style={{ margin: "20px 10px", borderRadius: "5px" }}
                      />
                    ) : (
                      <Image
                        src={`data:image/jpeg;base64,${thumbnail}`}
                        alt="thumbnailImage"
                        width={150}
                        height={150}
                        style={{ margin: "20px 10px", borderRadius: "5px" }}
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
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ display: "flex" }}>
                      {images?.map((img, index) => (
                        <Box key={index}>
                          {img && typeof img === "string" ? (
                            <Image
                              src={`data:image/jpeg;base64,${img}`}
                              alt={`Image ${index + 1}`}
                              width={150}
                              height={150}
                              style={{
                                margin: "20px 10px",
                                borderRadius: "5px",
                              }}
                            />
                          ) : (
                            <Image
                              src={URL.createObjectURL(img)}
                              alt={`Image ${index + 1}`}
                              width={150}
                              height={150}
                              style={{
                                margin: "20px 10px",
                                borderRadius: "5px",
                              }}
                            />
                          )}
                        </Box>
                      ))}
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
                value={description}
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
              <Select
                required
                value={propertyType === "ForSale" ? price : rent}
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
                {Prices.map((priceOption, index) => (
                  <MenuItem key={index} value={priceOption.value}>
                    {priceOption.label}
                  </MenuItem>
                ))}
              </Select>
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
                    Property Types
                  </Typography>
                  <Select
                    required
                    value={propertyTypes}
                    onChange={(e) => setPropertyTypes(e.target.value)}
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
                    {PropertyTypes.map((type, index) => (
                      <MenuItem key={index} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {(property === "House" ||
                property === "Commercial" ||
                property === "Appartment") && (
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

                  <Select
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
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
                    {Sizes.map((sizeOption, index) => (
                      <MenuItem key={index} value={sizeOption.value}>
                        {sizeOption.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {(property === "House" || property === "Appartment") && (
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
                  <Select
                    required
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
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
                    {Bedrooms.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {(property === "House" || property === "Appartment") && (
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
                  <Select
                    required
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
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
                    {Bedrooms.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
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
                  <Select
                    required
                    value={perches}
                    onChange={(e) => setPerches(e.target.value)}
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
                    {Perches.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
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
                  <Select
                    required
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
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
                    {Acres.map((option, index) => (
                      <MenuItem key={index} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
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
                <select
                  required
                  style={{
                    padding: "15px 0px",
                    width: "98%",
                    border: "1px solid grey",
                    marginLeft: "20px",
                    borderRadius: "5px",
                    backgroundColor: "black",
                    color: "white",
                    marginRight: "400px",
                  }}
                  value={city}
                  onChange={(e) => {
                    const selectedCity = e.target.value;
                    setCity(selectedCity);
                    setOpenCityDropDown(false);
                  }}
                >
                  {Cities.map((cityItem) => (
                    <optgroup>
                      <option value={cityItem.value} key={cityItem.value}>
                        {cityItem.label}
                      </option>

                      {cityItem.subheadings.map((subheading) => (
                        <option value={subheading.value} key={subheading.value}>
                          -- {subheading.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
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
                  Edit Property
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
