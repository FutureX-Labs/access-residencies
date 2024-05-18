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

const url = `${BASE_URL}/api/apartmentForRent/add`;

const bannerURL = `${BASE_URL}/api/customize/banners/add`;
const featureURL = `${BASE_URL}/api/customize/features/add`;
const propertyIdUrl = `${BASE_URL}/api/customize/propertyid/add`;

function Customize() {
  const [bannerImages, setBannerImages] = useState(null);
  const [featureImages, setFeatureImages] = useState(null);
  const [bannerFormData, setbannerFormData] = useState(new FormData());
  const [featureFormData, setFeatureFormData] = useState(new FormData());
  const [propertyType, setPropertyType] = useState("");
  const [property, setProperty] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [propertyId, setPropertyId] = useState();
  const [allPropertyId, setAllPropertyId] = useState([]);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [showSaveFeature, setShowSaveFeature] = useState(false);
  const submitButtonRef = useRef(null);
  const submitFeatureButtonRef = useRef(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("contact_user");
    if (!isUserLoggedIn) router.push("/");
  }, []);

  // useEffect(() => {
  //   console.log("user inside the effect", user);
  //   // if (!user) router.push("/");
  // }, [user]);

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
      const propertyIds = propertyIDResponse.data[0].propertyId;
      setAllPropertyId(propertyIds);
    } catch (error) {
      console.log("error in fetching properties", error);
    }
  };

  useEffect(() => {
    FetchPropertyIDs();
  }, []);

  console.log("allPropertyId", allPropertyId);
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

  const handleBannerSubmit = async () => {
    try {
      const response = await axiosInstance.post(bannerURL, bannerFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Banner Added Successfully",
        icon: "success",

        timer: 1500,
      });
      console.log(response);
    } catch (error) {
      Swal.fire({
        title: "Unable to Add Banner",
        icon: "error",

        timer: 1500,
      });
      console.log(error);
    }
  };

  const handleFeatureSubmit = async () => {
    try {
      imageUrl.forEach((url, index) => {
        const trimmedUrl = url ? url.trim() : "";
        const urlToAppend = trimmedUrl || "#home";
        featureFormData.append("urls", urlToAppend);
      });
      const response = await axiosInstance.post(featureURL, featureFormData, {
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

  console.log(bannerImages);
  const handleBannerFileUpload = async (e) => {
    bannerFormData.delete("myFiles");
    const files = e.target.files;
    setBannerImages([]);

    if (files.length > 3) {
      Swal.fire({
        title: "You can only select up to 3 files.",
        icon: "error",
        confirmButtonText: "Cancel",
      });
      return;
    }
    const allFiles = [...files];

    for (let i = 0; i < allFiles.length; i++) {
      bannerFormData.append("myFiles", allFiles[i]);
    }
    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await ConvertToBase64(file);
      base64Images.push(base64);
    }
    setBannerImages((prevImages) => [...base64Images]);

    setShowSaveBanner(true);
  };

  const handleFeatureFileUpload = async (e) => {
    featureFormData.delete("myFiles");
    const files = e.target.files;
    setFeatureImages([]);

    if (files.length > 3) {
      Swal.fire({
        title: "You can only select up to 3 files.",
        icon: "error",
        confirmButtonText: "Cancel",
      });
      return;
    }
    const allFiles = [...files];

    for (let i = 0; i < allFiles.length; i++) {
      featureFormData.append("myFiles", allFiles[i]);
    }
    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await ConvertToBase64(file);
      base64Images.push(base64);
    }
    setFeatureImages((prevImages) => [...base64Images]);

    setShowSaveFeature(true);
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

  console.log("bannerImages", bannerImages);
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
            {bannerImages?.map((img) => {
              return (
                <Image
                  src={img}
                  alt="img"
                  width={150}
                  height={150}
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
              margin: "10px 0px",
            }}
            onClick={() =>
              submitButtonRef.current && submitButtonRef.current.click()
            }
          >
            Choose Banners
          </Button>
          <br />
          {showSaveBanner && (
            <Button
              sx={{
                color: "white",
                backgroundColor: "#8C1C40",
                borderRadius: "5px",
              }}
              onClick={handleBannerSubmit}
            >
              Save Banners
            </Button>
          )}
        </Box>
        <Box sx={{ margin: "30px 0px" }}>
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
            {featureImages?.map((img, index) => {
              return (
                <Box sx={{ display: "flex", alignItems: "center" }} key={index}>
                  <Image
                    src={img}
                    alt="img"
                    width={150}
                    height={150}
                    style={{
                      margin: "20px 10px",
                      borderRadius: "5px",
                      objectFit: "cover",
                    }}
                  />
                  <TextField
                    InputProps={{
                      style: {
                        color: "grey",
                        border: "1px solid white",
                      },
                    }}
                    size="small"
                    fullWidth
                    value={imageUrl[index] || ""} // Display the URL from imageUrl state array
                    onChange={(e) =>
                      handleTextFieldChange(index, e.target.value)
                    } // Update the URL in imageUrl state array
                  />
                </Box>
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
              submitFeatureButtonRef.current &&
              submitFeatureButtonRef.current.click()
            }
          >
            Choose Features
          </Button>
          <br />
          {showSaveFeature && (
            <Button
              sx={{
                color: "white",
                backgroundColor: "#8C1C40",
                borderRadius: "5px",
              }}
              onClick={handleFeatureSubmit}
            >
              Save Features
            </Button>
          )}
        </Box>
        <Box sx={{ margin: "30px 0px" }}>
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
          <Box sx={{ margin: "10px  0px 10px 30px" }}>
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
                onClick={() => {
                  setAllPropertyId((prev) => [...prev, propertyId]);
                  setPropertyId("");
                }}
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
      </Container>
    </Box>
  );
}

export default Customize;
