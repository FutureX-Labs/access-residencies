"use client";
import React, { useState } from "react";
import Style from "./style.module.css";
import Image from "next/image";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await axios.post("http://localhost:4000/api/auth/login", {
        username,
        password,
      });
      console.log("result", result);
      if (result) {
        Swal.fire({
          title: "Login successfull",
          icon: "success",
        });
        console.log(result.data.isAdmin);
        router.push("/admin/customize");
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

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };
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
