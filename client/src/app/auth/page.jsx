"use client";
import React, { useState, useContext, useEffect } from "react";
import Style from "./style.module.css";
import Image from "next/image";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import { KoHo, Sonsie_One } from "next/font/google";
import { OneK } from "@mui/icons-material";

import BASE_URL from "./config";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const result = await axios.post(`${BASE_URL}/api/auth/login`, {
        username,
        password,
      });
      console.log("result", result);
      if (result) {
        sessionStorage.setItem("contact_user", true);
        setUser(true);
        Swal.fire({
          title: "Login successful",
          icon: "success",
        });
        router.replace("/admin/view/House/ForSale");
      }
    } catch (error) {
      Swal.fire({
        title: "Incorrect username or password",
        icon: "error",
        confirmButtonText: "Cancel",
      });
      console.log(error);
    }
  };

  // clear session storage it willclear storage whenever we visit to /auth so user will be logged out automatically

  useEffect(() => {
    sessionStorage.clear();
  }, []);
  return (
    <div className={Style.root}>
      <div className={Style.loginBox}>
        <div className={Style.inputField}>
          <Box sx={{ margin: "20px auto" }}>
            <Image
              src="/logo.png"
              width={100}
              height={50}
              alt="Picture of the author"
            />
          </Box>

          <Box
            sx={{
              margin: "10px auto",
              fontSize: "xx-large",
              fontFamily: "sans-serif",
            }}
          >
            Welcome
          </Box>
          <Box
            sx={{
              margin: "10px auto",
              fontSize: "medium",
              fontFamily: "sans-serif",
            }}
          >
            Enter the Username and Password to login
          </Box>
          <TextField
            label="Username"
            variant="outlined"
            className={Style.textField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size={"small"}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            className={Style.textField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size={"small"}
          />
          <Button
            variant="contained"
            color="error"
            sx={{ margin: "10px 0px" }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
