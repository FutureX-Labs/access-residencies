import React, { useState } from "react";
import { Box, Menu, MenuItem, Button } from "@mui/material";
import Link from "next/link";

const Subheader = ({ setProperty, setPropertyType, user }) => {
  const [anchorElForSale, setAnchorElForSale] = useState(null);
  const [anchorElForRent, setAnchorElForRent] = useState(null);
  const [selectedSaleOption, setSelectedSaleOption] = useState("");
  const [selectedRentOption, setSelectedRentOption] = useState("");

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

  const handleSaleOptionChange = (property, type) => {
    setSelectedSaleOption(property);
    setPropertyType(type);
    setProperty(property);
    handleCloseMenuForSale();
  };

  const handleRentOptionChange = (property, type) => {
    setSelectedRentOption(property);
    setPropertyType(type);
    setProperty(property);
    handleCloseMenuForRent();
  };

  return (
    <Box sx={{ backgroundColor: "#8c1c40", width: "100vw" }}>
      <Box sx={{ padding: "20px 80px", display: "flex", gap: "20px" }}>
        <Button
          onClick={handleOpenMenuForSale}
          sx={{ color: "white", textTransform: "none" }}
        >
          For Sale
        </Button>
        <Menu
          anchorEl={anchorElForSale}
          open={Boolean(anchorElForSale)}
          onClose={handleCloseMenuForSale}
        >
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/House/ForSale"
                  : "/user/filter/House/ForSale"
              }
            >
              House
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/Land/ForSale"
                  : "/user/filter/Land/ForSale"
              }
            >
              Land
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/Appartment/ForSale"
                  : "/user/filter/Appartment/ForSale"
              }
            >
              Appartment
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
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
        <Button
          onClick={handleOpenMenuForRent}
          sx={{ color: "white", textTransform: "none" }}
        >
          For Rent
        </Button>
        <Menu
          anchorEl={anchorElForRent}
          open={Boolean(anchorElForRent)}
          onClose={handleCloseMenuForRent}
        >
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/House/ForRent"
                  : "/user/filter/House/ForRent"
              }
            >
              House
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/Land/ForRent"
                  : "/user/filter/Land/ForRent"
              }
            >
              Land
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/Appartment/ForRent"
                  : "/user/filter/Appartment/ForRent"
              }
            >
              Appartment
            </Link>
          </MenuItem>
          <MenuItem>
            <Link
              style={{ textDecoration: "none", color: "black" }}
              href={
                user === "admin"
                  ? "/admin/view/Commercial/ForRent"
                  : "/user/filter/Commercial/ForRent"
              }
            >
              Commercial
            </Link>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Subheader;
