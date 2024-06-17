import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import SidenavCollapse from "./SidenavCollapse";
import SidenavRoot from "./SidenavRoot";
import sidenavLogoLabel from "./styles/sidenav";
import Dashboard from "../../layouts/dashboard";
import colors from "../../assets/theme/base/colors";
import ScheduleRequest from "../../layouts/schedulePost";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AssignmentsPage from "../../layouts/assignmentList";
// import EmployeeList from "../../layouts/profile";
import AddEmployee from "../../layouts/addEmployee";
import ViewCourses from "../../layouts/courseList";

import ViewCoursesInstructor from "../../layouts/courseListInstructor";
import UploadCourse from "../../layouts/courseUpload";
import UploadAnnouncement from "../../layouts/announcements";
import UploadAssignment from "../../layouts/assignmentUpload";
import AddCourseMaterial from "../../layouts/courseMaterial";
import CourseMaterialsPage from "../../layouts/CourseMaterialList";
import SubmitAssignment from "../../layouts/submitAssignment";
import ViewAssignments from "../../layouts/assignmentView";
import ViewAnnouncement from "../../layouts/viewAnnouncement";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  Dashboard as DashboardIcon,
  Add as AddIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  ReceiptLong as ReceiptLongIcon,
  Logout as LogoutIcon,
  TableViewOutlined as TableViewOutlinedIcon,
  RestaurantMenu as RestaurantMenuIcon,
  Fastfood as FastfoodIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "../../context";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import KitchenIcon from "@mui/icons-material/Kitchen";
import MDButton from "../../components/MDButton";

function CoordinatorSidenav({ brand, brandName, selectedMenu, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const collapseName = location.pathname.replace("/", "");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };
  const iconStyle = {
    color: colors.badgeColors.primary.main,
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };
  const handleLogoutConfirmed = async () => {
    try {
      await ipcRenderer.invoke("clear-user");
      navigate("/authentication/sign-in");
    } catch (error) {}
  };
  const routes = [
    {
      type: "collapse",
      name: "dashboard",
      key: "dashboard",
      icon: <DashboardIcon fontSize="small" />,
      route: "/dashboard",
      component: <Dashboard />,
    },
    {
      type: "collapse",
      name: "Upload Courses",
      key: "add_food",
      icon: <RestaurantMenuIcon fontSize="small" />,
      route: "/addFood",
      component: <UploadCourse />,
    },
    {
      type: "collapse",
      name: "Schedule Post",
      key: "schedule_post",
      icon: <KitchenIcon fontSize="small" />,
      route: "/schedulePost",
      component: <ScheduleRequest />,
    },
    {
      type: "collapse",
      name: "Course List",
      key: "report",
      icon: <AssessmentIcon fontSize="small" />,
      route: "/report",
      component: <ViewCourses />,
    },
    {
      type: "collapse",
      name: "Course List",
      key: "report",
      icon: <AssessmentIcon fontSize="small" />,
      route: "/courseListInstructor",
      component: <ViewCoursesInstructor />,
    },
  ];

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(
    ({ type, name, icon, title, noCollapse, key, href, route, onClick }) => {
      let returnValue;

      if (type === "collapse") {
        if (onClick) {
          returnValue = (
            <SidenavCollapse
              onClick={onClick}
              name={name}
              icon={icon}
              active={key === collapseName}
            />
          );
        } else {
          returnValue = href ? (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          ) : (
            <NavLink key={key} to={route}>
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
              />
            </NavLink>
          );
        }
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }

      return returnValue;
    }
  );

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
      sx={{
        position: "fixed", // Make the sidebar fixed
        top: 0,
        bottom: 0,
      }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDTypography component="h4" display="flex" alignItems="center">
          {brand && (
            <MDBox component="img" src={brand} alt="Brand" width="2rem" />
          )}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography
              component="h6"
              variant="button"
              fontWeight="medium"
              color={textColor}
            >
              {brandName}
            </MDTypography>
          </MDBox>
        </MDTypography>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <List>{renderRoutes}</List>
      <Link to="#" onClick={handleOpenLogoutDialog}>
        <SidenavCollapse
          name="Logout"
          icon={
            <LogoutIcon fontSize="small" style={iconStyle}>
              person
            </LogoutIcon>
          }
        />
      </Link>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px" } }}
      >
        <DialogTitle id="alert-dialog-title">Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            እርግጠኛ ነዎት መLogoutት ይፈልጋሉ?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-between" }}>
          <MDButton
            onClick={handleCloseLogoutDialog}
            color="info"
            style={{ borderRadius: "15%" }}
          >
            No
          </MDButton>
          <MDButton
            onClick={handleLogoutConfirmed}
            color="error"
            style={{ borderRadius: "15%" }}
          >
            Logout
          </MDButton>
        </DialogActions>
      </Dialog>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
CoordinatorSidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
CoordinatorSidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
};

export default CoordinatorSidenav;
