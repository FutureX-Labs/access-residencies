import React, { useState, useRef, useEffect } from "react";
import { Box, Menu, MenuItem, Button } from "@mui/material";
import Link from "next/link";

const Subheader = ({ propertyType, user }) => {
  const buttonRefForSale = useRef(null);
  const buttonRefForRent = useRef(null);
  
  const [anchorElForSale, setAnchorElForSale] = useState(null);
  const [anchorElForRent, setAnchorElForRent] = useState(null);

  const handleOpenMenuForSale = (event) => {
    setAnchorElForSale(event.currentTarget);
  };

  const handleCloseMenuForSale = () => {
    setAnchorElForSale(null);
  };

  const handleOpenMenuForRent = (event) => {
    setAnchorElForRent(event.currentTarget);
  };

  const handleCloseMenuForRent = () => {
    setAnchorElForRent(null);
  };

  const handleAutoHideMenu = (setStateFn) => {
    const handleScroll = () => {
      const isScrolledDown = window.scrollY > 0;
      setStateFn(isScrolledDown ? null : undefined);
    };

    useEffect(() => {
      window.addEventListener("scroll", handleScroll);

      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  };

  handleAutoHideMenu(setAnchorElForSale);
  handleAutoHideMenu(setAnchorElForRent);

  return (
    <Box sx={{ backgroundColor: "#8c1c40", width: "100vw" }}>
      <Box
        sx={{
          display: "flex",
          gap: "0px",
          width: { md: "25%", xs: "100%" },
        }}
      >
        <div onClick={handleOpenMenuForSale} style={{ width: "50%" }}>
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
            }}
          >
            For Sale
          </Button>
        </div>
        <div onClick={handleOpenMenuForRent} style={{ width: "50%" }}>
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
      <Menu
        anchorEl={anchorElForSale}
        open={Boolean(anchorElForSale)}
        onClose={handleCloseMenuForSale}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            width: buttonRefForSale.current
              ? `${buttonRefForSale.current.offsetWidth}px`
              : undefined,
            maxWidth: "100vw", // Ensure the maximum width of the dropdown menu does not exceed the viewport width
          },
        }}
      >
        <MenuItem onClick={handleCloseMenuForSale}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/House/ForSale"
                : "/user/filter/House/ForSale"
            }
          >
            House
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseMenuForSale}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/Land/ForSale"
                : "/user/filter/Land/ForSale"
            }
          >
            Land
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseMenuForSale}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/Apartment/ForSale"
                : "/user/filter/Apartment/ForSale"
            }
          >
            Apartment
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseMenuForSale}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/Commercial/ForSale"
                : "/user/filter/Commercial/ForSale"
            }
          >
            Commercial
          </Link>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorElForRent}
        open={Boolean(anchorElForRent)}
        onClose={handleCloseMenuForRent}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            width: buttonRefForRent.current
              ? `${buttonRefForRent.current.offsetWidth}px`
              : undefined,
            maxWidth: "100vw", // Ensure the maximum width of the dropdown menu does not exceed the viewport width
          },
        }}
      >
        <MenuItem onClick={handleCloseMenuForRent}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/House/ForRent"
                : "/user/filter/House/ForRent"
            }
          >
            House
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseMenuForRent}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/Land/ForRent"
                : "/user/filter/Land/ForRent"
            }
          >
            Land
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseMenuForRent}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={
              user === "admin"
                ? "/admin/view/Apartment/ForRent"
                : "/user/filter/Apartment/ForRent"
            }
          >
            Apartment
          </Link>
        </MenuItem>
        <MenuItem onClick={handleCloseMenuForRent}>
          <Link
            style={{ textDecoration: "none", color: "black", width: '100%' }}
            href={user === "admin"
            ? "/admin/view/Commercial/ForRent"
            : "/user/filter/Commercial/ForRent"
        }
      >
        Commercial
      </Link>
    </MenuItem>
  </Menu>
</Box>
);
};

export default Subheader;

             
