import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";

const drawerWidth = 240;

function Navbar(props) {
  const { window, type } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showProperty, setShowProperty] = React.useState(false);
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const adminNavItems = [
    { title: "Customize", path: "/admin/customize" },
    { title: "Property View", path: "/admin/view/House/ForSale" },
    { title: "Property Add", path: "/admin/add" },
    { title: "Logout", path: "" },
  ];

  const userNavItems = [
    { title: "Home", path: "https://accessresidencies.com/" },
    { title: "About us", path: "https://accessresidencies.com/?page_id=4099" },
    { title: "Gallery", path: "https://accessresidencies.com/?page_id=1659" },
    { title: "Contact Us", path: "https://accessresidencies.com/?page_id=1665" },
  ];

  const navItems = type === "admin" ? adminNavItems : userNavItems;

  const drawer = (
    <Box
      sx={{
        textAlign: "center",
        backgroundColor: "black",
        height: "100vh",
        p: { xs: "10px 5px", md: "10px 60px" },
      }}
    >
      <Box sx={{ display: " flex", m: "10px" }}>
        <Box
          variant="h6"
          ml={6}
          sx={{
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <Image
            component="div"
            src="/logo.png"
            alt="logo"
            width={147}
            height={64}
            sx={{ flexGrow: 1 }}
            variant="h6"
          />
        </Box>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" }, my: "auto" }}
        >
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {navItems.map((item) => (
          <ListItem
            key={item.title}
            sx={{
              gap: "20px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {item.title === "Logout" ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  sessionStorage.removeItem("contact_user");
                }}
              >
                {item.title}
              </Button>
            ) : (
              <Link
                href={item.path}
              >
                <ListItemText
                  primary={item.title}
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    fontFamily: "Roboto Condensed",
                    fontWeight: "800",
                    fontSize: "30px",
                    lineHeight: "28.13px",
                  }}
                />
              </Link>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", height: "90px" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "#000000",
          p: { xs: "10px 5px", md: "10px 60px" },
        }}
      >
        <Toolbar>
          <Box
            variant="h6"
            sx={{ flexGrow: 1, alignItems: "center" }}
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={147}
                height={64}
                sx={{ flexGrow: 1 }}
                variant="h6"
              />
            </Link>
          </Box>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: "20px" }}>
            {navItems.map((item) => (
              item.title === "Logout" ? (
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "#8c1b3f",
                    color: "white",
                    fontSize: "15px",
                    fontFamily: "Roboto Condensed",
                  }}
                  onClick={() => {
                    sessionStorage.removeItem("contact_user");
                  }}
                >
                  {item.title}
                </Button>
              ) : (
                <Link key={item.title} href={item.path}>
                  <Button sx={{
                    color: "white",
                    fontFamily: "Roboto Condensed",
                    fontSize: "15px",
                  }}
                  >
                    {item.title}
                  </Button>
                </Link>
              )
            ))}
          </Box>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: "100%",
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
  type: PropTypes.oneOf(["admin", "user"]).isRequired,
};

export default Navbar;
