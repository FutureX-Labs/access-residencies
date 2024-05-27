// Items.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";
import BASE_URL from "../../config";

const Items = ({ data, deleteData }) => {
  const [propertyDetails, setPropertyDetails] = useState([]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/api/properties/find`, {
          propertyIds: data,
        });
        setPropertyDetails(response.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    if (data.length > 0) {
      fetchPropertyDetails();
    }
  }, [data]);

  return (
    <Box>
      {propertyDetails.map((property, index) => (
        <Box key={property.id} sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
          <Typography sx={{ color: "white", marginRight: "10px" }}>
            {property.name} (ID: {property.id})
          </Typography>
          <Button
            sx={{ color: "white", backgroundColor: "#8C1C40", borderRadius: "5px" }}
            onClick={() => deleteData(index)}
          >
            Delete
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default Items;
