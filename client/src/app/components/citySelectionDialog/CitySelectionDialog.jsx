import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { Cities } from "@/app/list/city";

export function CitySelectionDialog({ open, onClose, onSelect }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubheading, setSelectedSubheading] = useState("");

  const handleCitySelect = (city) => {
    setSelectedCity(city.label);

    setSelectedSubheading(""); // Reset subheading selection when a new city is selected
  };

  const handleSubheadingSelect = (subheading) => {
    setSelectedSubheading(subheading.value);
    onSelect({
      group: selectedCity,
      title: subheading.value,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Select a Area</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              sx={{ color: "grey", fontSize: "medium" }}
            >
              Select a District
            </Typography>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {Cities.map((city, i) => (
                <li
                  key={i}
                  onClick={() => handleCitySelect(city)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "8px 16px",
                    backgroundColor:
                      selectedCity === city.label ? "#e0e0e0" : "transparent",
                    marginBottom: "4px",
                    borderRadius: "4px",
                  }}
                >
                  <div>{city.label}</div>
                  <ArrowForwardIos
                    fontSize="small"
                    style={{
                      visibility:
                        selectedCity === city.label ? "visible" : "hidden",
                    }}
                  />
                </li>
              ))}
            </ul>
          </Grid>
          {selectedCity && (
            <Grid item xs={6}>
              <Typography
                variant="subtitle1"
                sx={{ color: "grey", fontSize: "medium" }}
              >
                Select a Area within {selectedCity}
              </Typography>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {Cities.find(
                  (city) => city.label === selectedCity
                )?.subheadings.map((subheading, i) => (
                  <li
                    key={i}
                    onClick={() => handleSubheadingSelect(subheading)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      padding: "8px 16px",
                      backgroundColor:
                        selectedSubheading === subheading.value
                          ? "#e0e0e0"
                          : "transparent",
                      marginBottom: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    <div>{subheading.label}</div>
                    <ArrowForwardIos
                      fontSize="small"
                      style={{
                        visibility:
                          selectedSubheading === subheading.value
                            ? "visible"
                            : "hidden",
                      }}
                    />
                  </li>
                ))}
              </ul>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
