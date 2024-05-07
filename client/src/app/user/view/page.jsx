"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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
  Breadcrumbs,
} from "@mui/material";
import Link from "next/link";
import { FaShareNodes } from "react-icons/fa6";
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
  }, []);

  return (
    <>
      <Navbar type={"user"} />
      <BannerSlider imageData={selectedData?.images} />
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          width: { md: "50%", xs: "90%" },
          margin: "auto",
        }}
      >
        <Link
          style={{ fontSize: "18px", color: "#FF6DD6", textDecoration: "none" }}
          href="/"
        >
          Properties
        </Link>
        <Typography sx={{ fontSize: "18x" }} color="white">
          {property}
        </Typography>
        <Typography sx={{ fontSize: "18x" }} color="white">
          {propertyType}
        </Typography>
      </Breadcrumbs>
      <Box
        sx={{
          height: { md: "630px", xs: "650px" },
          backgroundColor: "#333",
          color: "#fff",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
          borderRadius: "8px",
          width: { md: "50%", xs: "90%" },

          margin: "auto",
        }}
        my={4}
        display="flex"
        flexDirection="column"
        gap={2}
        p={2}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <Box>
            <Typography
              sx={{
                textAlign: { md: "start", xs: "center" },
                fontWeight: "500",
              }}
              variant="h5"
            >
              {selectedData.title}
            </Typography>
            <Typography
              sx={{
                textAlign: { md: "start", xs: "center" },
                color: "#FF6DD6",
                fontWeight: "600",
                marginTop: "8px",
              }}
            >
              {selectedData.city}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: { md: "end", xs: " center" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                <Typography sx={{ fontSize: "13px" }}>Share</Typography>
              </Button>
            </Box>
            <Typography
              sx={{
                color: "#787878",
                fontSize: "14px",
                textAlign: { mdL: "end", xs: "center" },
                fontWeight: "600",
                marginTop: "8px",
              }}
            >
              {selectedData.propertyId}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ width: "85%", margin: " 0px   auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", padding: "10px", gap: "20px" }}>
              <MdBed size={22} />
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "14px",
                  color: "#bdbdbd",
                }}
              >
                {selectedData.bedrooms} bed rooms .{" "}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Image
                  style={{ marginTop: "-12px" }}
                  src={bathroom}
                  alt="icon"
                  size={12}
                />
                <Typography
                  sx={{ gap: "10px", fontSize: "14px", color: "#bdbdbd" }}
                >
                  {selectedData.bathrooms} beth rooms
                </Typography>
              </Box>
            </Box>
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
                {" "}
                {selectedData.size} sq. ft{" "}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              padding: "20px 0px 20px",
              color: "#FF6DD6",
              fontWeight: "600",
              fontSize: "30px",
            }}
          >
            <Typography>RS {selectedData.price}</Typography>
          </Box>
          <Typography
            sx={{
              color: "#bdbdbd",
              fontSize: "20px",
              textAlign: "center",
              fontWeight: "700",
              overflowY: " auto",
              maxHeight: { md: "300px", xs: "230px" },
            }}
          >
            {selectedData.description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "50px 0px",
            }}
          >
            <Typography>Contact : 0711234567</Typography>
            <Box>
              <Button
                sx={{
                  backgroundColor: "#8C1C40",
                  padding: "5px 10px",
                  color: "#fff",
                  gap: "10px",
                }}
              >
                <SlCallEnd size={20} />

                <Typography sx={{ fontSize: "13px" }}>Call</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default View;
