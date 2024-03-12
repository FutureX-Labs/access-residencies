"use client";
import { useState } from "react";
import axios from "axios";

const url = "http://localhost:4000/test";

function Home() {
  const [postImages, setPostImages] = useState([]);

  const createPost = async (newImages) => {
    try {
      const chunkSize = 500000; // Set a chunk size appropriate for your use case
      const chunks = [];
      for (let i = 0; i < newImages.length; i += chunkSize) {
        chunks.push(newImages.slice(i, i + chunkSize));
      }
      for (const chunk of chunks) {
        await axios.post(url, chunk);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost(postImages);
    console.log("Uploaded");
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await convertToBase64(file);
      newImages.push(base64);
    }
    setPostImages([...postImages, ...newImages]);
  };
  console.log("postImages", postImages);
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="custom-file-upload">
          {postImages.map((image, index) => (
            <img key={index} src={image?.myFile} alt="" />
          ))}
        </label>

        <input
          type="file"
          lable="Image"
          name="myFile"
          id="file-upload"
          accept=".jpeg, .png, .jpg"
          onChange={(e) => handleFileUpload(e)}
          multiple // Allow multiple file selection
        />

        <h3>Doris Wilder</h3>
        <span>Designer</span>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Home;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
