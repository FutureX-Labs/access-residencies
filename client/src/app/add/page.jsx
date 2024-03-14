"use client";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar/Navbar";

const url = "http://localhost:4000/api/appartmentForRent/add";

function Add() {
  const [postImage, setPostImage] = useState(null);
  const [formData, setFormData] = useState(new FormData());

  const createPost = async () => {
    try {
      const additionalData = {
        propertyId: "5wfdfwe",
        title: "house beautifyll",
        price: 4324,
        description: "dsfsdfdsfsdfsd",
        size: 2,
        bedrooms: 4,
        bathrooms: 5,
        town: "dfgfdgd",
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
      <Navbar type={"user"} />
      <div className="App" style={{ marginTop: "95px" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="file-upload" className="custom-file-upload">
            {postImage && <img src={URL.createObjectURL(postImage)} alt="" />}
          </label>

          <input
            type="file"
            label="Image"
            name="myFile"
            id="file-upload"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => handleFileUpload(e)}
          />

          <hr />
          <hr />
          <hr />
          <hr />
          <hr />

          <input
            type="file"
            label="Image"
            name="myFiles"
            id="file-uploads"
            accept=".jpeg, .png, .jpg"
            onChange={(e) => handleMultipleFileUpload(e)}
            multiple
          />

          <button type="submit">Submit</button>
        </form>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
        <div>fdsfsdf</div>
      </div>
    </>
  );
}

export default Add;
