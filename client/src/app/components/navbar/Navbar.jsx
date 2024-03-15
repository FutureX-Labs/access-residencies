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

const drawerWidth = 900;

function Navbar(props) {
  const { window, type } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showProperty, setShowProperty] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const adminNavItems = [
    { title: "Property View", path: "/property/view" },
    { title: "Property Add", path: "/property/add" },
  ];

  const userNavItems = [
    { title: "Home", path: "/" },
    { title: "About us", path: "/about" },
    { title: "Gallery", path: "/gallery" },

    {
      title: "Property Management",
      dropdown: true,
      subItems: [
        { title: "House For Sale", path: "/Property Management/project1" },
        { title: "House For Rent", path: "/Property Management/project2" },
        { title: "Land For Sale", path: "/Property Management/project3" },
        { title: "Commercial For Sale", path: "/Property Management/project5" },
        { title: "Commercial For Rent", path: "/Property Management/project6" },
        { title: "Appartment For Sale", path: "/Property Management/project6" },
        { title: "Appartment For Rent", path: "/Property Management/project6" },
      ],
    },
    { title: "Contact Us", path: "/contact" },
  ];

  const navItems = type === "admin" ? adminNavItems : userNavItems;

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
      <List>
        {navItems.map((item) => (
          <>
            {item.title !== "Property Management" ? (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  sx={{
                    textAlign: "left",
                  }}
                  // component="a"
                  href={item.path}
                >
                  <ListItemText
                    primary={item.title}
                    sx={{
                      color: "white",
                      fontFamily: "Roboto Condensed",
                      fontWeight: "800",
                      fontSize: "24px",
                      lingHeight: " 28.13px",
                    }}
                  />
                </ListItemButton>
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
                  primary={userNavItems[3].title}
                  sx={{
                    color: "white",
                    fontFamily: "Roboto Condensed",
                    fontWeight: "800",
                    fontSize: "24px",
                    lingHeight: " 28.13px",
                  }}
                  onClick={() => setShowProperty((prev) => !prev)}
                />

                {showProperty ? (
                  <FaAngleUp style={{ marginLeft: 5 }} color="white" />
                ) : (
                  <FaAngleDown style={{ marginLeft: 5 }} color="white" />
                )}
              </ListItemButton>
            </ListItem>
            <List>
              {userNavItems
                .find((item) => item.title === "Property Management")
                .subItems.map((subItem) =>
                  showProperty ? (
                    <ListItem
                      key={subItem.title}
                      disablePadding
                      sx={{ ml: "15px", width: "200px" }}
                    >
                      <ListItemButton
                        sx={{ textAlign: "left" }}
                        component="a"
                        href={subItem.path}
                      >
                        <ListItemText
                          primary={subItem.title}
                          sx={{
                            color: "white",
                            fontFamily: "Roboto Condensed",
                            fontWeight: "800",
                            fontSize: "24px",
                            lingHeight: " 28.13px",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    <></>
                  )
                )}
            </List>
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
          <Box variant="h6" sx={{ flexGrow: 1, alignItems: "center" }}>
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
          <Box
            sx={{ display: { xs: "none", md: "block" }, position: "relative" }}
          >
            {navItems.map((item) => (
              <>
                <Button
                  key={item.title}
                  sx={{ color: "#fff" }}
                  href={item.path}
                  onClick={
                    item.title === "Property Management"
                      ? () => setShowProperty((prev) => !prev)
                      : null
                  }
                >
                  {item.title === "Property Management" ? (
                    <>
                      <span>{item.title}</span>
                      {showProperty ? (
                        <FaAngleUp style={{ marginLeft: 5 }} />
                      ) : (
                        <FaAngleDown style={{ marginLeft: 5 }} />
                      )}
                    </>
                  ) : (
                    <>{item.title}</>
                  )}
                </Button>
                <Box
                  sx={{
                    position: "absolute",
                    top: "62px",
                    right: "112px",
                    borderRadius: "5px",
                  }}
                >
                  {showProperty &&
                    item?.subItems?.map((subItem, index) => (
                      <div
                        key={subItem.title}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          background: "grey",
                          padding: "0px",
                          margin: "0px",
                        }}
                      >
                        <ListItem
                          sx={{
                            width: "100%",
                          }}
                        >
                          <ListItemButton
                            sx={{
                              textAlign: "left",
                              "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                              },
                            }}
                            component="a"
                            href={subItem.path}
                          >
                            <ListItemText
                              primary={subItem.title}
                              sx={{
                                color: "white",
                                textAlign: "center",
                                fontFamily: "Roboto Condensed",
                                fontWeight: "800",
                                fontSize: "24px",
                                lingHeight: " 28.13px",
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      </div>
                    ))}
                </Box>
              </>
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
