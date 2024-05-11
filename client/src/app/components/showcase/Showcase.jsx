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

const Showcase = ({ data, user, property, propertyType, showHidden }) => {
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
  const handleRedirect = (propertyValue, propertyType, id) => {
    router.push(
      `/user/view?propertyValue=${propertyValue}&propertyType=${propertyType}&id=${id}`
    );
  };
  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Stop the event from bubbling up
    console.log("Clicked ID:", id); // Confirm the ID is passed correctly
    console.log(property, propertyType);
    try {
      let url = EditUrl(property, propertyType, id); // Ensure these variables are defined and passed correctly
      url = url.replace("edit", "delete"); // Modify the URL to change 'edit' to 'delete'
      console.log("API URL:", url); // Check the final URL

      const response = await axios.delete(url, {
        // Removed unnecessary headers if not needed
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response); // Log the response from the server
      Swal.fire({
        title: "Data Deleted Successfully",
        icon: "success",
        timer: 1500,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      // Uncomment and modify as needed
      // setCollectionData(response.data);
    } catch (error) {
      console.error("API Error:", error); // More detailed error logging
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

      const response = await axios.post(
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

  console.log("showHidden", showHidden);

  return (
    <>
      <Box>
        {/* Box with background image */}
        {/* <Box
        sx={{
          height: 200,
          backgroundImage: "url(/background.jpg)", // Your background image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: 4,
        }}
      ></Box> */}
        {!data && <Typography>No Record Found</Typography>}

        {/* Grid to display records */}
        {user === "user" ? (
          <Grid container spacing={2}>
            {data?.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(
              (item) =>
                item.isVisibale && (
                  <>
                    <Grid
                      item
                      key={item.id}
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
                        onClick={() =>
                          handleRedirect(
                            item.property,
                            item.propertyType,
                            item._id
                          )
                        }
                        sx={{
                          height: "250px",
                          width: "270px",
                          backgroundImage: `url(data:image/jpeg;base64,${item.thumbnailImage})`, // Set background image URL here
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "10px",
                          color: "#c2c6cf",
                          display: "flex",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{ ml: "20px", mt: "16px", textAlign: "start" }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "800",
                              fontSize: "20px",
                              lineHeight: "21px",
                              margin: "10px 0px",
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "500",
                              fontSize: "16px",
                              lineHeight: "18px",
                              margin: "5px 0px",
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
                                    fontSize: "18px",
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
                                    fontSize: "18px",
                                    lineHeight: "21px",
                                  }}
                                >
                                  {item.bedrooms}
                                </Typography>
                              </Box>
                            )}

                            {item.bathrooms && (
                              <>
                                <Typography
                                  sx={{ color: "#bdbdbd", fontWeight: "900" }}
                                >
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
                                      fontSize: "18px",
                                      lineHeight: "21px",
                                    }}
                                  >
                                    {item.bathrooms}
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "end",
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                          }}
                        >
                          {item.price && ( // Check if item.price exists
                            <Typography
                              sx={{
                                backdropFilter: "#9B7490",
                                border: "4px solid #9B7490",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "3px 20px",
                                height: "37px",
                              }}
                            >
                              RS.{item.price}
                            </Typography>
                          )}
                          {item.rent && ( // Check if item.price exists
                            <Typography
                              sx={{
                                backdropFilter: "#9B7490",
                                border: "4px solid #9B7490",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "3px 20px",
                                height: "37px",
                              }}
                            >
                              RS.{item.rent}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )
            )}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {data
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) =>
                showHidden && item.isVisibale === false ? (
                  <Grid
                    item
                    key={item.id}
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
                      onClick={() =>
                        handleRedirect(
                          item.property,
                          item.propertyType,
                          item._id
                        )
                      }
                      sx={{
                        height: "250px",
                        width: "270px",
                        backgroundImage: `url(data:image/jpeg;base64,${item.thumbnailImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "10px",
                        color: "#c2c6cf",
                        display: "flex",
                        position: "relative",
                      }}
                    >
                      <Box sx={{ ml: "20px", mt: "16px", textAlign: "start" }}>
                        <Typography
                          sx={{
                            fontWeight: "500",
                            fontSize: "16px",
                            lineHeight: "18px",
                            margin: "5px 0px",
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
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  lineHeight: "21px",
                                }}
                              >
                                {item.bedrooms}
                              </Typography>
                            </Box>
                          )}

                          {item.bathrooms && (
                            <>
                              <Typography
                                sx={{ color: "#bdbdbd", fontWeight: "900" }}
                              >
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
                                    fontSize: "18px",
                                    lineHeight: "21px",
                                  }}
                                >
                                  {item.bathrooms}
                                </Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: "800",
                            fontSize: "20px",
                            lineHeight: "21px",
                            margin: "10px 0px",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "end",
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                        >
                          {item.price && ( // Check if item.price exists
                            <Typography
                              sx={{
                                backdropFilter: "#9B7490",
                                border: "4px solid #9B7490",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "3px 8px",
                                height: "37px",
                              }}
                            >
                              RS.{item.price}
                            </Typography>
                          )}
                          {item.rent && ( // Check if item.price exists
                            <Typography
                              sx={{
                                backdropFilter: "#9B7490",
                                border: "4px solid #9B7490",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "3px 20px",
                                height: "37px",
                              }}
                            >
                              RS.{item.rent}
                            </Typography>
                          )}
                        </Box>
                      </Box>
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
                              handleIsVisibleEdit(
                                e,
                                item?._id,
                                item?.isVisibale
                              );
                            } else {
                              Swal.fire({
                                title:
                                  "Kindly select property and propertyType",
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
                                title:
                                  "Kindly select property and propertyType",
                                icon: "error",
                                timer: 1500,
                              });
                            }
                          }}
                        >
                          <Image src={binImage} alt="" />
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ) : (
                  <Grid
                    item
                    key={item.id}
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
                      onClick={() =>
                        handleRedirect(
                          item.property,
                          item.propertyType,
                          item._id
                        )
                      }
                      sx={{
                        height: "250px",
                        width: "270px",
                        backgroundImage: `url(data:image/jpeg;base64,${item.thumbnailImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "10px",
                        color: "#c2c6cf",
                        display: "flex",
                        position: "relative",
                      }}
                    >
                      <Box sx={{ ml: "20px", mt: "16px", textAlign: "start" }}>
                        <Typography
                          sx={{
                            fontWeight: "500",
                            fontSize: "16px",
                            lineHeight: "18px",
                            margin: "5px 0px",
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
                                  fontSize: "18px",
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
                                  fontSize: "18px",
                                  lineHeight: "21px",
                                }}
                              >
                                {item.bedrooms}
                              </Typography>
                            </Box>
                          )}

                          {item.bathrooms && (
                            <>
                              <Typography
                                sx={{ color: "#bdbdbd", fontWeight: "900" }}
                              >
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
                                    fontSize: "18px",
                                    lineHeight: "21px",
                                  }}
                                >
                                  {item.bathrooms}
                                </Typography>
                              </Box>
                            </>
                          )}
                        </Box>
                        <Typography
                          sx={{
                            fontWeight: "800",
                            fontSize: "20px",
                            lineHeight: "21px",
                            margin: "10px 0px",
                          }}
                        >
                          {item.title}
                        </Typography>
                      </Box>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "end",
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                          }}
                        >
                          {item.price && ( // Check if item.price exists
                            <Typography
                              sx={{
                                backdropFilter: "#9B7490",
                                border: "4px solid #9B7490",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "3px 8px",
                                height: "37px",
                              }}
                            >
                              RS.{item.price}
                            </Typography>
                          )}
                          {item.rent && ( // Check if item.price exists
                            <Typography
                              sx={{
                                backdropFilter: "#9B7490",
                                border: "4px solid #9B7490",
                                borderRadius: "4px",
                                textAlign: "center",
                                padding: "3px 20px",
                                height: "37px",
                              }}
                            >
                              RS.{item.rent}
                            </Typography>
                          )}
                        </Box>
                      </Box>
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
                              handleIsVisibleEdit(
                                e,
                                item?._id,
                                item?.isVisibale
                              );
                            } else {
                              Swal.fire({
                                title:
                                  "Kindly select property and propertyType",
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
                                title:
                                  "Kindly select property and propertyType",
                                icon: "error",
                                timer: 1500,
                              });
                            }
                          }}
                        >
                          <Image src={binImage} alt="" />
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                )
              )}
          </Grid>
        )}

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
            size="small"
            sx={{
              backgroundColor: " #8C1C40",
              padding: "5px 30px",
              borderRadius: "5px",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Showcase;
