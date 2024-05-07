import React, { useState } from "react";
import { Box, Typography, Menu, MenuItem, Button } from "@mui/material";

const Subheader = ({ setProperty, setPropertyType }) => {
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
          <MenuItem onClick={() => handleSaleOptionChange("House", "ForSale")}>
            House
          </MenuItem>
          <MenuItem onClick={() => handleSaleOptionChange("Land", "ForSale")}>
            Land
          </MenuItem>
          <MenuItem
            onClick={() => handleSaleOptionChange("Appartment", "ForSale")}
          >
            Appartment
          </MenuItem>
          <MenuItem
            onClick={() => handleSaleOptionChange("Commercial", "ForSale")}
          >
            Commercial
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
          <MenuItem onClick={() => handleRentOptionChange("House", "ForRent")}>
            House
          </MenuItem>
          <MenuItem onClick={() => handleRentOptionChange("Land", "ForRent")}>
            Land
          </MenuItem>
          <MenuItem
            onClick={() => handleRentOptionChange("Appartment", "ForRent")}
          >
            Appartment
          </MenuItem>
          <MenuItem
            onClick={() => handleRentOptionChange("Commercial", "ForRent")}
          >
            Commercial
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Subheader;
