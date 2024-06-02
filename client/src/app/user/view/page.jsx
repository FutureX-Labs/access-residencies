"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Subheader from "../../components/subheader/subheader";
import Image from "next/image";
import {
  Box,
  Item,
  Grid,
  Typography,
  Select,
  MenuItem,
  Button,
  Breadcrumbs,
} from "@mui/material";
import Link from "next/link";
import { FaShareNodes } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { MdBed } from "react-icons/md";
import bathroom from "../../../../public/bathroom.png";
import squareFeet from "../../../../public/images/squareFeet.png";
import { SlCallEnd } from "react-icons/sl";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import { GetOneUrl } from "@/app/utility/getOneUrl";
import BannerSlider from "@/app/components/bannerslider/BannerSlider";

function View() {
  const [selectedData, setSelectedData] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [property, setProperty] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);


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
        setSelectedData(response.data);
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
    if (navigator.share) {
      setCanShare(true);
    }
    console.log("canShare", canShare);
  }, []);

  const handleShare = async () => {
    console.log("handleShare");
    try {
      if (canShare) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        console.log('Web Share API not supported.');
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };


  return (
    <>
      <Box
        display={isLoading ? "none" : "block"}
      >
        <Navbar type={"user"} />
        <Subheader
          propertyType={propertyType}
          user="user"
        />
        {selectedData ? (<BannerSlider imageData={[selectedData.thumbnailImage, ...selectedData.images]} />) : null}

        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{
            width: { md: "60%", xs: "90%" },
            margin: "10px auto",
          }}
        >
          {property && propertyType && (
            <Link
              href={`/user/filter/${property}/${propertyType}`}
              style={{ textDecoration: "none"}}
              passHref
            >
              <Box component="a" sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Typography color={"#8C1C40"}>{property}</Typography>
                <IoIosArrowForward color={"#8C1C40"} />
                <Typography color={"#8C1C40"}>{propertyType === "ForSale" ? "For Sale": "For Rent"}</Typography>
              </Box>
            </Link>
          )}
        </Breadcrumbs>

        <Box
          sx={{
            height: { md: "60%", xs: "90%" },
            backgroundColor: "#131313",
            color: "#fff",
            width: { md: "60%", xs: "90%" },
            marginX: "auto",
            marginBottom: "40px",
          }}
          display="flex"
          flexDirection="column"
          gap={2}
          p={2}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <Box sx={{
              width: "100%",
              display: "flex",
              justifyContent: { xs: "center", md: "space-between" },
              alignItems: "center",
            }}>
              <Typography
                sx={{
                  fontWeight: "500",
                }}
                variant="h5"
              >
                {selectedData.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  display: { xs: "none", md: "block" },
                }}
              >
                <Button
                  sx={{
                    backgroundColor: "#8C1C40",
                    padding: "5px 10px",
                    color: "#fff",
                    gap: "10px",
                    width: "100px",
                  }}
                >
                  <FaShareNodes size={20} />
                  <Typography onClick={handleShare} sx={{ fontSize: "13px" }}>Share</Typography>
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Typography
                sx={{
                  color: "#FF6DD6",
                  fontWeight: "600",
                }}
              >
                {selectedData.city}
              </Typography>
              <Typography
                sx={{
                  color: "#787878",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {selectedData.propertyId}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ width: "85%", margin: "0 auto" }}>
            <Box sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: "20px",
              justifyContent: "space-between"
            }}>
              <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: "20px",
              }}>
                {selectedData.bedrooms && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <MdBed size={30} />
                    <Typography
                      sx={{ fontSize: "14px", color: "#bdbdbd" }}
                    >
                      {selectedData.bedrooms} bed rooms
                    </Typography>
                  </Box>
                )}
                {selectedData.bathrooms && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                    <Image
                      style={{ marginTop: "-12px" }}
                      src={bathroom}
                      alt="icon"
                      size={8}
                    />
                    <Typography sx={{ fontSize: "14px", color: "#bdbdbd" }} >
                      {selectedData.bathrooms} bath rooms
                    </Typography>
                  </Box>
                )}
                {selectedData.landExtent && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Image src={squareFeet} alt="icon" size={12} />
                    <Typography sx={{ fontSize: "14px", color: "#bdbdbd" }}>
                      {selectedData.landExtent.acres} acres {selectedData.landExtent.perches} perches
                    </Typography>
                  </Box>
                )}
                {selectedData.propertyTypes && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ color: "#bdbdbd", fontWeight: "700", fontSize: "16px" }}>
                      Property Type : {selectedData.propertyTypes}
                    </Typography>
                  </Box>
                )}
              </Box>
              {selectedData.size && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Image src={squareFeet} alt="icon" size={12} />
                  <Typography sx={{ fontSize: "14px", color: "#bdbdbd" }}>
                    {selectedData.size} sq. ft
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                paddingTop: "20px",
              }}
            >
              <Typography
                sx={{
                  color: "#FF6DD6",
                  fontWeight: "700",
                  fontSize: "18px",
                }}
              >
                RS. {(propertyType === "ForSale") ? selectedData.price : selectedData.rent}
              </Typography>
            </Box>
            <Typography
              sx={{
                paddingTop: "20px",
                color: "#bdbdbd",
                fontSize: { md: "18px", xs: "14px" },
                textAlign: "center",
                fontWeight: "500",
                overflowY: " auto",
                maxHeight: { md: "300px", xs: "230px" },
              }}
            >
              {selectedData.description}
            </Typography>
            <Box
              sx={{
                paddingTop: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{
                display: { xs: "none", md: "block" },
              }}>
                Contact : 071123456
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  display: { xs: "block", md: "none" },
                }}
              >
                <Button
                  sx={{
                    backgroundColor: "#8C1C40",
                    padding: "6px 0",
                    color: "#fff",
                    gap: "10px",
                    width: "100px",
                  }}
                >
                  <FaShareNodes size={20} />
                  <Typography onClick={handleShare} sx={{ fontSize: "13px" }}>Share</Typography>
                </Button>
              </Box>
              <Box>
                <Button
                  sx={{
                    backgroundColor: "#8C1C40",
                    padding: "6px 0",
                    color: "#fff",
                    gap: "10px",
                    width: "100px",
                  }}
                >
                  <SlCallEnd size={15} />
                  <Typography
                    sx={{ fontSize: "14px", cursor: "pointer" }}
                    onClick={() => {
                      window.location.href = "tel:0711234567";
                    }}>
                    Call
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default View;
