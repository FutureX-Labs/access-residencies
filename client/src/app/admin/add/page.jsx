"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbar/Navbar";
import Image from "next/image";
 
import {
  Box,
  Item,
  Grid,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import Container from "@mui/material/Container";

const url = "http://localhost:4000/api/appartmentForRent/add";
const Input = ( {label, value, onChange} )=>{
  return               <Grid item md={12}>
  <TextField
    id="outlined-password-input"
    label={label}
    value={value}
    onChange={e=> onChange(e.target.value)}
    fullWidth 
    required
  />
</Grid>
}

function Add() {
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());
  const [propertyType, setPropertyType] = useState("ForSale");
  const [property, setProperty] = useState("House");
  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [rent, setRend] = useState("");
  const [size, setSize] = useState("");
  const [town, setTown] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [bathroom, setBathroom] = useState("");

  
  console.log("propertyType", propertyType); 
  const createPost = async () => {
    try {
      const additionalData = {
        propertyId:propertyId,
        title: title,
        price: price,
        description: description,
        size: size,
        bedrooms: bedroom,
        bathrooms: bathroom,
        town: town,
      };
      formData.append("additionalData", JSON.stringify(additionalData));
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost();
    if (postImage) {
      //   formData.append("myFile", postImage);
    } else {
      console.log("No image selected");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
  };
  console.log(postImage);
  const handleMultipleFileUpload = (e) => {
    const files = e.target.files;
    console.log("before Files", files);

    // Convert postImage to an array if it's not already
    const postImagesArray = postImage ? [postImage] : [];
    console.log("postImagesArray", postImagesArray);
    // Concatenate postImage with files
    const allFiles = [...files, ...postImagesArray];

    for (let i = 0; i < allFiles.length; i++) {
      formData.append("myFiles", allFiles[i]);
    }
    console.log("files", allFiles);
  };
  

  return (
    <>
      <Navbar type={"admin"} />
      <div>
        <Box style={{ width: "100vw", minheight: "550px",   overflow: "hidden" }}>
          <Image
            src="/images/AdminAdd.png"
            alt="Admin Add"
            layout="responsive"
            width={100}
            height={55}
            quality={100}
            style={{ objectFit: "cover" }}
          />
        </Box>
        <Container maxWidth="lg" sx={{ mt: "50px", py:5, mb:5, background:"white" }}>
          <Typography
            sx={{
              fontFamily: "Roboto",
              fontWeight: "900",
              fontSize: "32px",
              lineHeight: "37.5px",
              color: "white",
            }}
          >
            Add New Properties
          </Typography>
          <Typography
            sx={{
              fontFamily: "Roboto",
              fontWeight: "400",
              fontSize: "22px",
              lineHeight: "33.5px",
              color: "white",
              mt: "30px",
            }}
          >
            Type
          </Typography>
          <Box sx={{ display: "flex", ml: "20px", my: "10px" }}>
            <Box sx={{ display: "flex", ml: "20px", my: "10px" }}>
              <Select
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                sx={{
                  minWidth: 320,
                  mr: "10px",
                  border: "1px solid grey",
                  color: "white",
                }}
                size="small"
                displayEmpty
                placeholder="Select Property"
              >
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
              </Select>

              <Select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                sx={{
                  minWidth: 320,
                  border: "1px solid grey",
                  color: "white",
                }}
                size="small"
                displayEmpty
                placeholder="Select Property Type"
              >
                <MenuItem value="ForSale">For Sale</MenuItem>
                <MenuItem value="ForRent">For Rent</MenuItem>
              </Select>
            </Box>
          </Box>
          <form onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {postImage && <img src={URL.createObjectURL(postImage)} alt="" />}
            </label>
            <Grid container gap={3}>
                <Input label="Property ID" value={propertyId} onChange={(e)=>setPropertyId(e)}  />
                <Input label="Title" value={title} onChange={(e)=>setTitle(e)}  />
            
              <Grid item md={12}>
                <TextField
                  id="outlined-password-input"
                  label="Images"
                  fullWidth 
                />
              </Grid>
              <Input label="Description" value={description} onChange={(e)=>setDescription(e)}  />
              {
                propertyType === "ForSale" ? 
                 <>
                  <Input label="Price" value={price} onChange={(e)=>setPrice(e)}  />
                 </>
                           :
                 <>
                 <Input label="Rent" value={rent} onChange={(e)=>setRent(e)}  />
                 </>

              }
              <Input label="size" value={size} onChange={(e)=>setSize(e)}  />
              <Input label="Bedrooms" value={bedroom} onChange={(e)=>setBedroom(e)}  />
              <Input label="Bathrooms" value={bathroom} onChange={(e)=>setBathroom(e)}  />
              <Input label="Town" value={town} onChange={(e)=>setTown(e)}  />
  
            </Grid>

<Grid item md={12}>
<input
              type="file"
              label="Image"
              name="myFile"
              id="file-upload"
              accept=".jpeg, .png, .jpg"
              onChange={(e) => handleFileUpload(e)}
            /> 

            <input
              type="file"
              label="Image"
              name="myFiles"
              id="file-uploads"
              accept=".jpeg, .png, .jpg"
              onChange={(e) => handleMultipleFileUpload(e)}
              multiple
            />
  </Grid>
            <Grid item md={12}>
            <Button     variant="contained" type="submit">Submit</Button>

              </Grid>
          </form>
        </Container>
      </div>
    </>
  );
}

export default Add;
