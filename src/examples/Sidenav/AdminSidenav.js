import React, { useState, useEffect } from "react";
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
import AssignmentsPage from "../../layouts/assignmentList";
// import EmployeeList from "../../layouts/profile";
import AddEmployee from "../../layouts/addEmployee";
import ScheduleRequest from "../../layouts/schedulePost";
import ApproveScheduleRequest from "../../layouts/scheduleApproval";
import ViewCourses from "../../layouts/courseList";
import KitchenIcon from "@mui/icons-material/Kitchen";
import UploadCourse from "../../layouts/courseUpload";
import UploadAnnouncement from "../../layouts/announcements";
import UploadAssignment from "../../layouts/assignmentUpload";
import AddCourseMaterial from "../../layouts/courseMaterial";
import CourseMaterialsPage from "../../layouts/CourseMaterialList";
import SubmitAssignment from "../../layouts/submitAssignment";
import ViewAssignments from "../../layouts/assignmentView";
import ViewAnnouncement from "../../layouts/viewAnnouncement";
import DisplaySchedule from "../../layouts/scheduleView";
import SubmittedAssignments from "../../layouts/viewSubmittedAssignment";
import EmployeeList from "../../layouts/employeeList";

import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Icon } from "semantic-ui-react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
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

function AdminSidenav({ brand, brandName, selectedMenu, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const collapseName = location.pathname.replace("/", "");
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };
  const handleLogout = async () => {
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
      name: "Add-employee",
      key: "Add-employee",
      icon: <AddIcon fontSize="small" />,
      route: "/addEmployee",
      component: <AddEmployee />,
    },
    {
      type: "collapse",
      name: "view-employee",
      key: "view-employee",
      icon: <AddIcon fontSize="small" />,
      route: "/viewEmployee",
      component: <EmployeeList />,
    },
    // {
    //   type: "collapse",
    //   name: "employee list",
    //   key: "profile",
    //   icon: <PersonIcon fontSize="small" />,
    //   route: "/profile",
    //   component: <EmployeeList />,
    // },
    //
    {
      type: "collapse",
      name: "Display Schedule",
      key: "stock_Approval",
      icon: <AssignmentTurnedInIcon fontSize="small" />,
      route: "/scheduleView",
      component: <DisplaySchedule />,
    },
    {
      type: "collapse",
      name: "Announcement View",
      key: "Announcement_view",
      icon: <AttachMoneyIcon fontSize="small" />,
      route: "/viewAnnouncement",
      component: <ViewAnnouncement />,
    },
    {
      type: "collapse",
      name: "Announcement post",
      key: "Announcement_post",
      icon: <AttachMoneyIcon fontSize="small" />,
      route: "/announcements",
      component: <UploadAnnouncement />,
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
        <MDBox
          component={NavLink}
          to="/mainDashboard"
          display="flex"
          alignItems="center"
        >
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
        </MDBox>
      </MDBox>
      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <MDTypography>Are you sure you want to logout?</MDTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <List>{renderRoutes}</List>
      <Link to="/" onClick={handleOpenLogoutDialog}>
        <SidenavCollapse
          name="Logout"
          icon={<LogoutIcon fontSize="small">person</LogoutIcon>}
        />
      </Link>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
AdminSidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
AdminSidenav.propTypes = {
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

export default AdminSidenav;
