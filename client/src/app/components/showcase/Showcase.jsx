import React from "react";
import {
  Box,
  Grid,
  Pagination,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import { FaShareNodes } from "react-icons/fa6";
import { MdBed } from "react-icons/md";
import bathroom from "../../../../public/bathroom.png";
import Image from "next/image";
import { IoBedOutline } from "react-icons/io5";
import { MdBathtub } from "react-icons/md";
import { MdSocialDistance } from "react-icons/md";
import squareFeet from "../../../../public/images/squareFeet.png";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BorderRight } from "@mui/icons-material";
import binImage from "../../../../public/BinImage.png";
import ediImage from "../../../../public/editImage.png";
import closeImage from "../../../../public/closeImage.png";
import { IoIosEye } from "react-icons/io";
import axios from "axios";
import { EditUrl } from "@/app/utility/editUrl";
import Swal from "sweetalert2";
import { CldImage } from "next-cloudinary";
import axiosInstance from "@/app/utility/axiosInstance";

const Showcase = ({ data, user, property, propertyType, showHidden }) => {
  console.log("Data:", data);
  // Sample data array
  //   const data = Array.from({ length: 100 }, (_, i) => ({
  //     id: i + 1,
  //     name: `Item ${i + 1}`,
  //   }));
  const router = useRouter();
  // Pagination state
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 20;

  // Material-UI theme
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("md", "lg"));

  // Function to handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    console.log("Clicked ID:", id);
    console.log(property, propertyType);
    try {
      let url = EditUrl(property, propertyType, id);
      url = url.replace("edit", "delete");
      console.log("API URL:", url);

      const response = await axiosInstance.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response);
      Swal.fire({
        title: "Data Deleted Successfully",
        icon: "success",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        title: "Unable to deleted",
        icon: "error",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleIsVisibleEdit = async (e, id, isVisibale) => {
    e.stopPropagation();
    console.log("Clicked ID:", id);
    console.log(property, propertyType);
    try {
      const updatedIsVisible = !isVisibale;
      let url = EditUrl(property, propertyType, id);
      url = url.replace("edit", "edit/isVisible");
      console.log("API URL:", url);

      const response = await axiosInstance.post(
        url,
        {
          isVisibale: updatedIsVisible,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response);
      Swal.fire({
        title: "Edited Successfully",
        icon: "success",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        title: "Unable to Edit",
        icon: "error",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  function formatPrice(price) {
    const lakhs = price / 100000;
    let lakhsString;

    if (lakhs >= 1) {
      lakhsString = lakhs.toFixed(1).replace(/\.0$/, "");
    } else {
      lakhsString = lakhs.toString();
    }

    return `${price} (${lakhsString} lakhs)`;
  }

  // console.log("showHidden", showHidden);

  const childrenContent = (item) => (
    <>
      <CldImage
        fill
        src={item.thumbnailImage}
        version="2"
        style={{ objectFit: "cover" }}
        blur={200}
        sizes="20vw"
        opacity="60"
        alt="Banner Image"
      />
      <Box sx={{ ml: "20px", mt: "16px", textAlign: "start", zIndex: 1, position: "absolute" }}>
        <Typography
          sx={{
            fontWeight: "500",
            fontSize: "16px",
            lineHeight: "18px",
            margin: "5px 0px",
            color: "white",
          }}
        >
          {item.city}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "10px",
            margin: "13px 0px",
          }}
        >
          {item.size && (
            <>
              <Image src={squareFeet} alt="icon" size={26} />
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "17px",
                  lineHeight: "21px",
                }}
              >
                {item.size} sq. ft.{" "}
              </Typography>
            </>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: "10px" }}>
          {item.bedrooms && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <IoBedOutline size={26} />
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "17px",
                  lineHeight: "21px",
                }}
              >
                {item.bedrooms}
              </Typography>
            </Box>
          )}

          {item.bathrooms && (
            <>
              <Typography sx={{ color: "#bdbdbd", fontWeight: "900" }}>
                .
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <MdBathtub size={26} />
                <Typography
                  sx={{
                    fontWeight: "600",
                    fontSize: "17px",
                    lineHeight: "21px",
                  }}
                >
                  {item.bathrooms}
                </Typography>
              </Box>
            </>
          )}

          {item.landExtent && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Image src={squareFeet} alt="icon" size={12} />
              <Typography
                sx={{
                  fontWeight: "500",
                  fontSize: "17px",
                  lineHeight: "21px",
                }}
              >
                {item.landExtent.acres} acres {item.landExtent.perches} perches
              </Typography>
            </Box>
          )}
        </Box>
        <Typography
          sx={{
            fontWeight: "800",
            fontSize: "20px",
            lineHeight: "21px",
            margin: "20px 0px 5px 0px",
          }}
        >
          {item.title}
        </Typography>
      </Box>
      <Box sx={{ zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
            position: "absolute",
            [user === "admin" ? "top" : "bottom"]: "10px",
            right: "10px",
          }}
        >
          {item.price && (
            <Typography
              sx={{
                backdropFilter: "#9B7490",
                border: "4px solid #9B7490",
                borderRadius: "4px",
                textAlign: "center",
                padding: "3px 6px",
                height: "37px",
              }}
            >
              RS.{user === "admin" ? item.price : formatPrice(item.price)}
            </Typography>
          )}
          {item.rent && (
            <Typography
              sx={{
                backdropFilter: "#9B7490",
                border: "4px solid #9B7490",
                borderRadius: "4px",
                textAlign: "center",
                padding: "3px 6px",
                height: "37px",
              }}
            >
              RS.{user === "admin" ? item.rent : formatPrice(item.rent)}
            </Typography>
          )}
        </Box>
      </Box>
      {user === "admin" ? (
        <Box
          sx={{
            position: "absolute",
            bottom: "0px",
            display: "flex",
            justifyContent: "space-around",
            gap: "10px",
            width: "100%",
            margin: "0px",
            backgroundColor: "#00000075",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <Link
            href={`/admin/edit?propertyValue=${item?.property}&propertyType=${item?.propertyType}&id=${item?._id}`}
          >
            <Button
              sx={{
                padding: "13px 13px",
                borderRight: " 1px solid #6c736b",
                margin: "0px",
                borderRadius: "0px",
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={ediImage} alt="" />
            </Button>
          </Link>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (property && propertyType) {
                handleIsVisibleEdit(e, item?._id, item?.isVisibale);
              } else {
                Swal.fire({
                  title: "Kindly select property and propertyType",
                  icon: "error",
                  timer: 1500,
                });
              }
            }}
          >
            {item.isVisibale ? (
              <IoIosEye size={"40px"} color="#6c736b" />
            ) : (
              <Image src={closeImage} alt="" />
            )}
          </Button>
          <Button
            sx={{
              borderLeft: " 1px solid #6c736b",
              padding: "10px 20px",
              margin: "0px",
              borderRadius: "0px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (property && propertyType) {
                handleDelete(e, item._id);
              } else {
                Swal.fire({
                  title: "Kindly select property and propertyType",
                  icon: "error",
                  timer: 1500,
                });
              }
            }}
          >
            <Image src={binImage} alt="" />
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <>
      <Box>
        {data.length <= 0 && (
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "22px",
              margin: "20px 20px",
              color: "#ffffff70",
            }}
          >
            No Record Found
          </Typography>
        )}

        <Grid container spacing={2}>
          {data
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((item) => (
              <Grid
                item
                key={item._id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    height: "250px",
                    width: "270px",
                    borderRadius: "10px",
                    display: "flex",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {user === "admin" ? (
                    <Box
                      sx={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        color: "white",
                      }}>
                      {childrenContent(item)}
                    </Box>
                  ) : (
                    <Link
                      href={`/user/view?propertyValue=${item.property}&propertyType=${item.propertyType}&id=${item._id}`}
                      target="_blank"
                      passHref
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        color: "white",
                      }}
                    >
                      {childrenContent(item)}
                    </Link>
                  )}
                </Box>
              </Grid>
            ))}
        </Grid>

        {/* Pagination */}
        <Typography sx={{ color: "white", fontSize: "small", mt: "30px" }}>
          {" "}
          Showing {data.length} results
        </Typography>
        <Box
          sx={{
            margin: "5px 0px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={Math.ceil(data.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            variant="outlined"
            // size="small"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              backgroundColor: " #8C1C4017",
              padding: "3px 20px",
              "& .MuiPaginationItem-root": {
                color: "#fff"
              }
            }}
          />
        </Box>
      </Box >
    </>
  );
};

export default Showcase;
