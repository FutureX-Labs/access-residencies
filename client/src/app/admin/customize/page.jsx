"use client";
import { useState, useRef, useEffect, useContext } from "react";
import axios, { all } from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import {
  Box,
  Item,
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import Swal from "sweetalert2";
import { ConvertToBase64 } from "../../utility/Conversion";
import Items from "@/app/components/items/Items";
import customizeImage from "../../../../public/images/customize.png";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";
import BASE_URL from "../../config";
import axiosInstance from "@/app/utility/axiosInstance";
import { CldImage } from 'next-cloudinary';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const DemoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  backgroundColor: "#ffffff05",
  margin: "20px 0px",
}));

const bannerURL = `${BASE_URL}/api/customize/banners/add`;
const featureURL = `${BASE_URL}/api/customize/features/`;
const propertyIdUrl = `${BASE_URL}/api/customize/propertyid/add`;

function Customize() {
  const [bannerImages, setBannerImages] = useState(null);
  const [featureImages, setFeatureImages] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [propertyId, setPropertyId] = useState();
  const [allPropertyId, setAllPropertyId] = useState([]);
  const submitButtonRef = useRef(null);
  const submitFeatureButtonRef = useRef(null);
  const router = useRouter();
  const [bannersUploaded, setBannersUploaded] = useState(false);
  const [featuresUploaded, setFeaturesUploaded] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("contact_user");
    if (!isUserLoggedIn) router.push("/");
  }, []);

  const fetchPropertyIDs = async () => {
    try {
      const propertyIDResponse = await axios.get(
        `${BASE_URL}/api/customize/propertyid`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const propertyIds = propertyIDResponse.data[0].propertyId;
      setAllPropertyId(propertyIds);
    } catch (error) {
      console.log("error in fetching properties", error);
    }
  };

  const getBannersFeatures = async () => {
    try {
      const [banners, features] = await all([
        axiosInstance.get(`${BASE_URL}/api/customize/banners`),
        axiosInstance.get(`${BASE_URL}/api/customize/features`),
      ]);
      setBannerImages(banners.data[0].banners);
      setFeatureImages(features.data[0].features);
      setImageUrl(features.data[0].features.map((feature) => feature.url));
      console.log(banners, features);
    } catch (error) {
      console.log("error in fetching banners and features", error);
    }
  };

  useEffect(() => {
    fetchPropertyIDs();
    getBannersFeatures();
  }, []);

  const handleSubmitPropertyId = async () => {
    try {
      const propertyIds = { propertyIds: allPropertyId };
      const response = await axiosInstance.post(propertyIdUrl, propertyIds);
      Swal.fire({
        title: "PropertyIds Added Successfully",
        icon: "success",
        timer: 1500,
      });
      console.log(response);
    } catch (error) {
      Swal.fire({
        title: "Unable to add propertyIds ",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    }
  };

  const handleFeatureURLSubmit = async () => {
    try {
      const trimmedImageUrl = imageUrl.map((url) => url.trim());

      const response = await axiosInstance.post(`${featureURL}/addUrls`, { urls: trimmedImageUrl }, {
        headers: {
          "Content-Type": "application/json"
        },
      });
      Swal.fire({
        title: "Feature URLs Added Successfully",
        icon: "success",
        timer: 1500,
      });
      console.log(response);

    } catch (error) {
      Swal.fire({
        title: "Unable to Add Feature URLs",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    }
  };

  const handleBannerFileUpload = async (e) => {
    try {
      const files = e.target.files;

      const bannerFormData = new FormData();

      if (files.length > 3) {
        Swal.fire({
          title: "You can only select up to 3 files.",
          icon: "error",
          confirmButtonText: "Cancel",
        });
        return;
      }

      for (let i = 0; i < files.length; i++) {
        bannerFormData.append("banners", files[i]);
      }

      setBannerImages(files);
      setBannersUploaded(true);

      const response = await axiosInstance.post(bannerURL, bannerFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Banners Added Successfully",
        icon: "success",
        timer: 1500,
      });
      console.log(response);

    } catch (error) {
      Swal.fire({
        title: "Unable to Add Banners",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    }
  };

  const handleFeatureFileUpload = async (e) => {
    try {
      const files = e.target.files;

      const featureFormData = new FormData();

      if (files.length > 3) {
        Swal.fire({
          title: "You can only select up to 3 files.",
          icon: "error",
          confirmButtonText: "Cancel",
        });
        return;
      }

      for (let i = 0; i < files.length; i++) {
        featureFormData.append("features", files[i]);
      }

      setFeatureImages(files);
      setFeaturesUploaded(true);
      setImageUrl([]);

      const response = await axiosInstance.post(`${featureURL}/addImages`, featureFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Features Added Successfully",
        icon: "success",
        timer: 1500,
      });
      console.log(response);

    } catch (error) {
      Swal.fire({
        title: "Unable to Add Features",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    }
  };

  const handleTextFieldChange = (index, value) => {
    const updatedImageUrl = [...imageUrl];
    updatedImageUrl[index] = value;
    setImageUrl(updatedImageUrl);
  };

  const handleRemovePropertyId = (indexToRemove) => {
    setAllPropertyId((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAddPropertyId = async () => {
    try {

      const response = await axiosInstance.post(`${BASE_URL}/api/customize/propertyid/check`, { propertyId: propertyId }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data.available) {
        if (!allPropertyId.includes(propertyId)) {
          setAllPropertyId((prevPropertyIds) => [...prevPropertyIds, propertyId]);
          setPropertyId("");
        } else {
          Swal.fire({
            title: "Property Id Already Exists",
            icon: "error",
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          title: "Invalid Property Id",
          icon: "error",
          timer: 1500,
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error Adding Property Id",
        icon: "error",
        timer: 1500,
      });
    }
  };


  return (
    <Box className="customize">
      <Navbar type={"admin"} />

      <Box style={{ width: "100vw", minheight: "550px", overflow: "hidden" }}>
        <Image
          src={customizeImage}
          alt="Admin Add"
          layout="responsive"
          width={100}
          height={55}
          quality={100}
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Container maxWidth="lg" sx={{ mt: "40px" }}>
        <ThemeProvider theme={darkTheme}>
          <DemoPaper elevation={0} variant="outlined">

            {/* Main Banners */}
            <Box>
              <Typography
                sx={{
                  color: "white",

                  fontWeight: "700",
                  fontSize: "32px",
                  lineHeight: "37px",
                }}
              >
                Change Main Banners
              </Typography>

              {/* <label htmlFor="file-upload" className="custom-file-upload"></label> */}

              <input
                type="file"
                label="Image"
                name="myFiles"
                id="file-uploads"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleBannerFileUpload(e)}
                multiple
                ref={submitButtonRef}
                hidden
              />

              <Box>
                {bannerImages &&
                  Array.from(bannerImages).map((img, index) => {
                    return bannersUploaded ? (
                      <Image
                        key={index}
                        src={URL.createObjectURL(img)}
                        alt="Image"
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
                        key={index}
                        src={img}
                        sizes="20vw"
                        width={150}
                        height={150}
                        alt="Image"
                        style={{
                          margin: "20px 10px",
                          borderRadius: "5px",
                          objectFit: "cover",
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
                  margin: "10px 10px",
                }}
                onClick={() =>
                  submitButtonRef.current && submitButtonRef.current.click()
                }
              >
                Choose Banners
              </Button>
            </Box>
          </DemoPaper>

          {/* Featured Projects */}
          <DemoPaper elevation={0} variant="outlined">
            <Box>
              <Typography
                sx={{
                  color: "white",

                  fontWeight: "700",
                  fontSize: "32px",
                  lineHeight: "37px",
                }}
              >
                Change Featured Projects
              </Typography>
              <input
                type="file"
                label="Image"
                name="myFiles"
                id="file-uploads"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => handleFeatureFileUpload(e)}
                multiple
                ref={submitFeatureButtonRef}
                hidden
              />

              <Box sx={{ display: "flex", flexDirection: "column" }}>

                {featureImages && Array.from(featureImages).map((img, index) => (
                  <Box sx={{ display: "flex", alignItems: "center" }} key={index}>
                    {featuresUploaded ? (
                      <Image
                        src={URL.createObjectURL(img)}
                        alt="Image"
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
                        src={img.file}
                        sizes="20vw"
                        width={150}
                        height={150}
                        alt="Image"
                        style={{
                          margin: "20px 10px",
                          borderRadius: "5px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <TextField
                      InputProps={{
                        style: {
                          color: "grey",
                          border: "1px solid white",
                        },
                      }}
                      size="small"
                      fullWidth
                      value={imageUrl[index] || ''}
                      onChange={(e) => handleTextFieldChange(index, e.target.value)}
                    />
                  </Box>
                ))}

              </Box>
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "#8C1C40",
                    borderRadius: "5px",
                    margin: "10px 10px",
                  }}
                  onClick={() =>
                    submitFeatureButtonRef.current &&
                    submitFeatureButtonRef.current.click()
                  }
                >
                  Choose Features
                </Button>
                <Button
                  sx={{
                    color: "white",
                    backgroundColor: "#8C1C40",
                    borderRadius: "5px",
                    marginX: "auto",
                  }}
                  onClick={handleFeatureURLSubmit}
                >
                  Save Feature Links
                </Button>
              </Box>
            </Box>
          </DemoPaper>

          {/* Showcase Properties */}
          <DemoPaper elevation={0} variant="outlined">
            <Box>
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "700",
                  fontSize: "32px",
                  lineHeight: "37px",
                }}
              >
                Showcase Properties
              </Typography>
              <Box sx={{ margin: "10px  0px 10px 10px" }}>
                <Typography
                  sx={{
                    color: "white",
                    margin: "14px 0px",
                    fontWeight: "500",
                    fontSize: "16px",
                    lineHeight: "20px",
                  }}
                >
                  Property IDs to Showcase:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    margin: "20px 0px",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    InputProps={{
                      style: {
                        color: "white",
                        border: "1px solid white",
                      },
                    }}
                    size="small"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    required
                  />
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "#8C1C40",
                      marginLeft: "20px",
                      borderRadius: "5px",
                    }}
                    onClick={handleAddPropertyId}
                  >
                    Add Property Ids
                  </Button>
                </Box>

                <Items data={allPropertyId} deleteData={handleRemovePropertyId} />

                {allPropertyId.length > 0 && (
                  <Button
                    sx={{
                      color: "white",
                      backgroundColor: "#8C1C40",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleSubmitPropertyId()}
                  >
                    Save Property Ids
                  </Button>
                )}
              </Box>
            </Box>
          </DemoPaper>
        </ThemeProvider>
      </Container>
    </Box>
  );
}

export default Customize;