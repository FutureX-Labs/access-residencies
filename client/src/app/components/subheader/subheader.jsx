import React, { useState, useRef, useEffect } from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { ArrowForwardIos } from "@mui/icons-material";

const Subheader = ({ propertyType, user }) => {
  const [openForSale, setOpenForSale] = useState(false);
  const [openForRent, setOpenForRent] = useState(false);

  const buttonRefForSale = useRef(null);
  const buttonRefForRent = useRef(null);

  const handleMenuForSale = () => {
    setOpenForRent(false);
    setOpenForSale(!openForSale);
  };
  const handleMenuForRent = () => {
    setOpenForSale(false);
    setOpenForRent(!openForRent);
  };

  const handleAutoHideMenu = (setStateFn) => {
    const handleScroll = () => {
      const isScrolledDown = window.scrollY > 0;
      setStateFn(isScrolledDown ? false : undefined);
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  };

  handleAutoHideMenu(setOpenForSale);
  handleAutoHideMenu(setOpenForRent);

  return (
    <Box
      sx={{ backgroundColor: "#8c1c40", width: "100vw", position: "relative" }}
    >
      <Box
        sx={{ display: "flex", gap: "0px", width: { md: "25%", xs: "100%" } }}
      >
        <div onClick={handleMenuForSale} style={{ width: "50%" }}>
          <Button
            ref={buttonRefForSale}
            sx={{
              height: "60px",
              width: "100%",
              color: "white",
              backgroundColor:
                propertyType === "ForSale" ? "#00000044" : "inherit",
              fontFamily: "Roboto Condensed",
              fontWeight: "800",
              "&:hover": {
                backgroundColor: "#00000088",
              },
              alignSelf: "center",
            }}
          >
            For Sale
           
          </Button>
        </div>
        <div onClick={handleMenuForRent} style={{ width: "50%" }}>
          <Button
            ref={buttonRefForRent}
            sx={{
              width: "100%",
              height: "60px",
              color: "white",
              fontFamily: "Roboto Condensed",
              backgroundColor:
                propertyType === "ForRent" ? "#00000044" : "inherit",
              fontWeight: "800",
              "&:hover": {
                backgroundColor: "#00000088",
              },
            }}
          >
            For Rent
            
          </Button>
        </div>
      </Box>
      {openForSale && (
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 20,
            borderRadius: "5px",
            width: buttonRefForSale.current
              ? buttonRefForSale.current.offsetWidth
              : "100%",
            left: 0,
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForSale}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/House/ForSale"
                    : "/user/filter/House/ForSale"
                }
              >
                House
              </Link>
            </li>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForSale}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/Land/ForSale"
                    : "/user/filter/Land/ForSale"
                }
              >
                Land
              </Link>
            </li>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForSale}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/Apartment/ForSale"
                    : "/user/filter/Apartment/ForSale"
                }
              >
                Apartment
              </Link>
            </li>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForSale}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/Commercial/ForSale"
                    : "/user/filter/Commercial/ForSale"
                }
              >
                Commercial
              </Link>
            </li>
          </ul>
        </Box>
      )}
      {openForRent && (
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            zIndex: 20,
            borderRadius: "5px",
            width: buttonRefForRent.current
              ? buttonRefForRent.current.offsetWidth
              : "100%",
            left: buttonRefForRent.current
              ? buttonRefForRent.current.offsetLeft
              : 0,
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForRent}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/House/ForRent"
                    : "/user/filter/House/ForRent"
                }
              >
                House
              </Link>
            </li>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForRent}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/Land/ForRent"
                    : "/user/filter/Land/ForRent"
                }
              >
                Land
              </Link>
            </li>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForRent}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/Apartment/ForRent"
                    : "/user/filter/Apartment/ForRent"
                }
              >
                Apartment
              </Link>
            </li>
            <li
              style={{ padding: "8px 16px" }}
              // onClick={handleCloseMenuForRent}
            >
              <Link
                style={{
                  textDecoration: "none",
                  color: "black",
                  width: "100%",
                  display: "block",
                }}
                href={
                  user === "admin"
                    ? "/admin/view/Commercial/ForRent"
                    : "/user/filter/Commercial/ForRent"
                }
              >
                Commercial
              </Link>
            </li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Subheader;
