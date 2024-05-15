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

const drawerWidth = 900;

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
    { title: user ? "Logout" : "Login", path: "/auth" },
  ];

  const userNavItems = [
    { title: "Home", path: "/" },
    { title: "About us", path: "#about" },
    { title: "Gallery", path: "#gallery" },
    { title: "Contact Us", path: "#contact" },
  ];

  const navItems = type === "admin" ? adminNavItems : userNavItems;

  const handleLogoClick = () => {
    router.push("/");
  };

  const drawer = (
    <Box
      sx={{
        textAlign: "left",
        backgroundColor: "black",
        height: "100vh",
        p: { xs: "10px 5px", md: "10px 60px" },
      }}
    >
      <Box sx={{ display: " flex", m: "10px" }}>
        <Box
          variant="h6"
          sx={{
            flexGrow: 1,
            alignItems: "center",
          }}
          onClick={handleLogoClick}
        >
          {/* Wrap the Image component inside a Link */}

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
      <List>
        {navItems.map((item) => (
          <>
            {item.title !== "Property Management" ? (
              <ListItem key={item.title} disablePadding>
                <Link
                  sx={{
                    textAlign: "left",
                    textDecoration: "none",
                  }}
                  // component="a"
                  href={item.path}
                >
                  <ListItemText
                    primary={item.title}
                    sx={{
                      color: "white",
                      textDecoration: "none",
                      fontFamily: "Roboto Condensed",
                      fontWeight: "800",
                      fontSize: "24px",
                      lingHeight: " 28.13px",
                    }}
                  />
                </Link>
              </ListItem>
            ) : (
              <></>
            )}
          </>
        ))}
        {type === "user" && (
          <React.Fragment>
            <ListItem disablePadding>
              <ListItemButton
                sx={{ textAlign: "left" }}
                component="a"
                href={userNavItems[3].path}
              >
                <ListItemText
                  sx={{
                    color: "white",
                    fontFamily: "Roboto Condensed",
                    fontWeight: "800",
                    fontSize: "24px",
                    lingHeight: " 28.13px",
                  }}
                  onClick={() => setShowProperty((prev) => !prev)}
                />
              </ListItemButton>
            </ListItem>
          </React.Fragment>
        )}
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
            onClick={handleLogoClick}
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
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {navItems.map((item) => (
              <Link key={item.title} href={item.path}>
                <Button sx={{ color: "white" }}>{item.title}</Button>
              </Link>
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
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
  type: PropTypes.oneOf(["admin", "user"]).isRequired,
};

export default Navbar;
