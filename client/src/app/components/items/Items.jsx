import React from "react";
import { ImCross } from "react-icons/im";
import { Box, Typography } from "@mui/material";

const Items = ({ data, deleteData, disableDelete }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "5px",
        marginBottom: "20px",
        maxWidth: "100%",
        height: "auto",
        flexWrap: "wrap",
        overflowX: "auto",
      }}
    >
      {data &&
        data?.map((propertyId, index) => (
          <Box
            key={index}
            sx={{
              width: "auto",
              borderRadius: "30px",
              border: "1px solid #71838f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px 10px",
            }}
          >
            <Typography
              sx={{
                color: "white",

                fontSize: "medium",
              }}
            >
              {propertyId}
            </Typography>
            {disableDelete ? (
              <></>
            ) : (
              <ImCross
                style={{ margin: "0px 10px", cursor: "pointer" }}
                color="grey"
                onClick={() => deleteData(index)}
              />
            )}
          </Box>
        ))}
    </Box>
  );
};

export default Items;
