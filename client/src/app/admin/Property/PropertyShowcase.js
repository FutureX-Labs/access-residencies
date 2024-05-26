import { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import Items from "@/app/components/items/Items";
import Swal from "sweetalert2";
import axiosInstance from "@/app/utility/axiosInstance";
import BASE_URL from "../../config";

const PropertyShowcase = ({ allPropertyId, setAllPropertyId }) => {
  const [propertyId, setPropertyId] = useState("");

  const handleAddPropertyId = () => {
    setAllPropertyId((prev) => [...prev, propertyId]);
    setPropertyId("");
  };

  const handleRemovePropertyId = (indexToRemove) => {
    setAllPropertyId((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitPropertyId = async () => {
    try {
      const propertyIds = { propertyIds: allPropertyId };
      const response = await axiosInstance.post(`${BASE_URL}/api/customize/propertyid/add`, propertyIds);
      Swal.fire({
        title: "PropertyIds Added Successfully",
        icon: "success",
        timer: 1500,
      });
      console.log(response);
    } catch (error) {
      Swal.fire({
        title: "Unable to add propertyIds",
        icon: "error",
        timer: 1500,
      });
      console.log(error);
    }
  };

  return (
    <Box>
      <Typography
        sx={{
          color: "white",
          fontWeight: "700",
          fontSize: "32px",
          lineHeight: "37px",
        }}
      >
        Showcase Properties
      </Typography>
      <Box sx={{ margin: "10px  0px 10px 10px" }}>
        <Typography
          sx={{
            color: "white",
            margin: "14px 0px",
            fontWeight: "500",
            fontSize: "16px",
            lineHeight: "20px",
          }}
        >
          Property IDs to Showcase:
        </Typography>
        <Box
          sx={{
            display: "flex",
            margin: "20px 0px",
            alignItems: "center",
          }}
        >
          <TextField
            InputProps={{
              style: {
                color: "white",
                border: "1px solid white",
              },
            }}
            size="small"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
          />
          <Button
            sx={{
              color: "white",
              backgroundColor: "#8C1C40",
              marginLeft: "20px",
              borderRadius: "5px",
            }}
            onClick={handleAddPropertyId}
          >
            Add Property Ids
          </Button>
        </Box>
        <Items data={allPropertyId} deleteData={handleRemovePropertyId} />
        {allPropertyId.length > 0 && (
          <Button
            sx={{
              color: "white",
              backgroundColor: "#8C1C40",
              borderRadius: "5px",
            }}
            onClick={handleSubmitPropertyId}
          >
            Save Property Ids
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default PropertyShowcase;
