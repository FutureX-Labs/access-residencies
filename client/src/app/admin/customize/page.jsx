"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
import { Box, Typography, Button, TextField, Container } from "@mui/material";
import Swal from "sweetalert2";
import Items from "@/app/components/items/Items";
import customizeImage from "../../../../public/images/customize.png";
import { useRouter } from "next/navigation";
import BASE_URL from "../../config";
import axiosInstance from "@/app/utility/axiosInstance";
import { CldImage } from "next-cloudinary";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const darkTheme = createTheme({ palette: { mode: "dark" } });

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
const propertyIdFind = `${BASE_URL}/api/properties/find`;

function Customize() {
  const [bannerImages, setBannerImages] = useState(null);
  const [featureImages, setFeatureImages] = useState(null);
  const [imageUrl, setImageUrl] = useState([]);
  const [propertyId, setPropertyId] = useState("");
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
      const propertyIDResponse = await axios.get(`${BASE_URL}/api/customize/propertyid`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const propertyIds = propertyIDResponse.data[0].propertyId;
      setAllPropertyId(propertyIds);
    } catch (error) {
      console.log("error in fetching properties", error);
    }
  };

  const getBannersFeatures = async () => {
    try {
      const [banners, features] = await axios.all([
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

      const response = await axiosInstance.post(
        `${featureURL}/addUrls`,
        { urls: trimmedImageUrl },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
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
      console.log(propertyId);
  
      const response = await axios.post(
        propertyIdFind,
        // Send data in the request body
        { propertyIds: [propertyId] },
        // Set content type header to JSON
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      // Check if the response status is OK (200) and at least one inner array contains data
      if (
        response.status === 200 &&
        response.data &&
        response.data.data &&
        response.data.data.some((innerArray) => innerArray.length > 0)
      ) {
        // Check if the propertyId is not already included in allPropertyId
        if (!allPropertyId.includes(propertyId)) {
          setAllPropertyId((prevPropertyIds) => [...prevPropertyIds, propertyId]);
          setPropertyId("");
        } else {
          // Display error message if propertyId is already included
          Swal.fire({
            title: "Property Id Already Exists",
            icon: "error",
            timer: 1500,
          });
        }
      } else {
        // Handle the case where no inner array contains data
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
      <Box style={{ width: "100vw", minHeight: "550px", overflow: "hidden" }}>
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
              <input
                type="file"
                label="Image"
                name="myFiles"
                id="file-uploads"
                accept=".jpeg, .png, .jpg"
                onChange={handleBannerFileUpload}
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
                  marginTop: "20px",
                  borderRadius: "5px",
                }}
                onClick={() => submitButtonRef.current.click()}
              >
                Change Banners
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
                name="featureFiles"
                id="feature-file-uploads"
                accept=".jpeg, .png, .jpg"
                onChange={handleFeatureFileUpload}
                multiple
                ref={submitFeatureButtonRef}
                hidden
              />
              <Box>
                {featureImages &&
                  Array.from(featureImages).map((img, index) => {
                    return featuresUploaded ? (
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
                  marginTop: "20px",
                  borderRadius: "5px",
                }}
                onClick={() => submitFeatureButtonRef.current.click()}
              >
                Change Features
              </Button>
            </Box>
            <Typography
              sx={{
                color: "white",
                fontWeight: "700",
                fontSize: "32px",
                lineHeight: "37px",
              }}
            >
              Or Add Feature URLs
            </Typography>
            <Box>
              {[0, 1, 2].map((index) => (
                <TextField
                  key={index}
                  InputProps={{
                    style: {
                      color: "white",
                      border: "1px solid white",
                      margin: "10px 0px",
                    },
                  }}
                  size="small"
                  placeholder={`Image ${index + 1}`}
                  value={imageUrl[index] || ""}
                  onChange={(e) =>
                    handleTextFieldChange(index, e.target.value)
                  }
                  required
                />
              ))}
              <Button
                sx={{
                  color: "white",
                  backgroundColor: "#8C1C40",
                  marginLeft: "20px",
                  marginTop: "20px",
                  borderRadius: "5px",
                }}
                onClick={handleFeatureURLSubmit}
              >
                Add Feature URL
              </Button>
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
                      marginTop: "10px",
                    }}
                    onClick={handleSubmitPropertyId}
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


