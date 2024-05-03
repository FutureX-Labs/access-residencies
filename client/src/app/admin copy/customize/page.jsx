"use client";
import { useState, useRef, useEffect } from "react";
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

const bannerURL = "http://localhost:4000/api/customize/banners/add";
const featureURL = "http://localhost:4000/api/customize/features/add";
const propertyIdUrl = "http://localhost:4000/api/customize/propertyid/add";

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

  console.log("allPropertyId", allPropertyId);
  const handleSubmitPropertyId = async () => {
    try {
      const propertyIds = { propertyIds: allPropertyId };
      const response = await axios.post(propertyIdUrl, propertyIds);
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
      const response = await axios.post(bannerURL, bannerFormData, {
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
      const response = await axios.post(featureURL, featureFormData, {
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
    if (bannerFormData.length > 0) {
      setShowSaveBanner(true);
    } else {
      setShowSaveBanner(false);
    }
  };

  const handleFeatureFileUpload = async (e) => {
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
    if (bannerFormData.length > 0) {
      setShowSaveFeature(true);
    } else {
      setShowSaveFeature(false);
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

  console.log("bannerImages", bannerImages);
  return (
    <Box className="customize">
      <Navbar type={"admin"} />

      <Box style={{ width: "100vw", minheight: "550px", overflow: "hidden" }}>
        <Image
          src="/images/AdminAdd.png"
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
                  style={{ margin: "20px 10px", borderRadius: "5px" }}
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
                    style={{ margin: "20px 10px", borderRadius: "5px" }}
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
                onClick={() =>
                  setAllPropertyId((prev) => [...prev, propertyId])
                }
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
