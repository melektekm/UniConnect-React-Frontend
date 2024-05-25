/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React, { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
import MDButton from "../../../components/MDButton";

// Material Dashboard 2 React components
import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "../../../examples/Breadcrumbs";
import NotificationItem from "../../../examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "../../../examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context";
import MDTypography from "../../../components/MDTypography";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import routes from "../../../routes";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

function StudentNavBar({ absolute, light, isMini }) {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await ipcRenderer.invoke("clear-user");
      navigate("/authentication/sign-in");
    } catch (error) {}
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };
  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem
        onClick={handleOpenLogoutDialog}
        icon={<ExitToAppIcon>Logout</ExitToAppIcon>}
        title="Log out"
      />
    </Menu>
  );
  let routeName = "";

  routes.forEach((route) => {
    if (useLocation().pathname === route.route) {
      routeName = route.name;
    }
  });
  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    /**
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) =>
        navbar(theme, { transparentNavbar, absolute, light, darkMode })
      }
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          <Breadcrumbs
            icon="home"
            title={routeName}
            route={route}
            light={light}
          />
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {userData.user.role == "chief_admin" ?? (
              <MDBox pr={1}>
                <MDButton
                  variant="gradient"
                  color="secondary"
                  onClick={async () => {
                    const currentRoute = location.pathname; // Get the current route

                    sessionStorage.setItem("previousRoute", currentRoute);
                    navigate("/searchForInventory");
                  }}
                >
                  Search
                </MDButton>
              </MDBox>
            )}

            <MDBox color={light ? "white" : "inherit"} textAlign="center">
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <AccountCircleIcon sx={iconsStyle} />
              </IconButton>
              {renderMenu()}

              <MDTypography style={{ fontSize: "0.67em" }}>
                Hello,{userData.user.name}
              </MDTypography>
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">ማረጋገጫ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            እርግጠኛ ነዎት መውጣት ይፈልጋሉ?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <MDButton
            onClick={handleCloseLogoutDialog}
            color="info"
            style={{ borderRadius: "15%" }}
          >
            አይ
          </MDButton>
          <MDButton
            onClick={handleLogout}
            color="error"
            style={{ borderRadius: "15%" }}
          >
            ውጣ
          </MDButton>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
StudentNavBar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
StudentNavBar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default StudentNavBar;
