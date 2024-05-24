import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PropTypes from "prop-types";
import Breadcrumbs from "../../../examples/Breadcrumbs";
import NotificationItem from "../../../examples/Items/NotificationItem";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "../../../examples/Navbars/DashboardNavbar/styles";
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context";
import MDButton from "../../../components/MDButton";
import MDTypography from "../../../components/MDTypography";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import routes from "../../../routes";
import axios from "axios";
import MDBox from "../../../components/MDBox";
import MDInput from "../../../components/MDInput";

function AdminNavbar({ absolute, light, isMini }) {
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const location = useLocation();
  let routeName = "";

  routes.forEach((route) => {
    if (useLocation().pathname === route.route) {
      routeName = route.name;
    }
  });
  const navigate = useNavigate();
  const [openCommentDialog, setOpenCommentDialog] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
    }

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleLogout = async () => {
    try {
      await ipcRenderer.invoke("clear-user");
      navigate("/authentication/sign-in");
    } catch (error) {}
  };

  const handleOpenCommentDialog = () => {
    setOpenCommentDialog(true);
  };

  const handleCloseCommentDialog = () => {
    setOpenCommentDialog(false);
  };

  const handleSendComment = async () => {
    try {
      const response = await axios.post("your-backend-endpoint-url", {
        comment: comment,
      });

      if (response.status === 200) {
        console.log("Comment sent successfully");
        handleCloseCommentDialog();
      } else {
        console.error(
          "Failed to send comment. Response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error sending comment:", error.message);
    }
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
        onClick={handleLogout}
        icon={<ExitToAppIcon>Logout</ExitToAppIcon>}
        title="Log out"
      />
    </Menu>
  );

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

  let routeName = "";
  routes.forEach((route) => {
    if (location.pathname === route.route) {
      routeName = route.name;
    }
  });

  return (
    <AppBar position={absolute ? "absolute" : navbarType} color="inherit">
      <Toolbar>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }}>
          <Breadcrumbs
            icon="home"
            title={routeName}
            route={route}
            light={light}
          />
        </MDBox>
        {!isMini && (
          <MDBox>
            <MDBox pr={1}>
              <MDButton
                color="secondary"
                onClick={async () => {
                  const currentRoute = location.pathname;
                  sessionStorage.setItem("previousRoute", currentRoute);
                  navigate("/searchForAdmin");
                }}
              >
                ፈልግ
              </MDButton>
            </MDBox>
            <MDBox color={light ? "white" : "dark"} textAlign="center">
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
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
      <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog}>
        <DialogTitle>Send Comment</DialogTitle>
        <DialogContent>
          <MDInput
            label="Your Comment"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseCommentDialog}>Cancel</MDButton>
          <MDButton
            onClick={handleSendComment}
            color="primary"
            variant="contained"
          >
            Send
          </MDButton>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

AdminNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

AdminNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default AdminNavbar;
