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
import Tables from "../../layouts/tables";

import ScheduleRequest from "../../layouts/schedulePost";
import ApproveScheduleRequest from "../../layouts/scheduleApproval";

import InventoryList from "../../layouts/assignmentView";
import { Icon } from "semantic-ui-react";
import StudentDashboard from "../../layouts/StudentDashboard";
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
  CheckCircle as CheckCircleIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import KitchenIcon from "@mui/icons-material/Kitchen";

import DisplaySchedule from "../../layouts/scheduleView";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "../../context";
import ReportList from "../../layouts/courseList";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import colors from "../../assets/theme/base/colors";

import MDButton from "../../components/MDButton";

function StudentSidenav({ brand, brandName, selectedMenu, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const collapseName = location.pathname.replace("/", "");

  const handleLogout = () => {
    setOpenLogoutDialog(true);
  };
  const iconStyle = {
    color: colors.badgeColors.primary.main,
  };

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogoutConfirmed = async () => {
    try {
      await ipcRenderer.invoke("clear-user");
      navigate("/authentication/sign-in");
    } catch (error) {
    } finally {
      setOpenLogoutDialog(false);
    }
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
    // {
    //   type: "collapse",
    //   name: "orders",
    //   key: "orders",
    //   icon: <TableViewOutlinedIcon fontSize="small" />,
    //   route: "/tables",
    //   component: <Tables />,
    // },
    //
    {
      type: "collapse",
      name: "stock_Approval",
      key: "stock_Approval",
      icon: <AssignmentTurnedInIcon fontSize="small" />,
      route: "/scheduleView",
      component: <DisplaySchedule />,
    },
    {
      type: "collapse",
      name: "assignmentView",
      key: "list",
      icon: <ShoppingCartIcon fontSize="small" />,
      route: "/assignmentView",
      component: <InventoryList />,
    },

    {
      type: "collapse",
      name: "schedule_post",
      key: "schedule_post",
      icon: <KitchenIcon fontSize="small" />,
      route: "/schedulePost",
      component: <ScheduleRequest />,
    },
    {
      type: "collapse",
      name: "schedule_Approval",
      key: "ingredient_Approval",
      icon: <AssignmentTurnedInIcon fontSize="small" />,
      route: "/scheduleApproval",
      component: <ApproveScheduleRequest />,
    },
    // {
    //   type: "collapse",
    //   name: "Add-employee",
    //   key: "Add-employee",
    //   icon: <AddIcon fontSize="small" />,
    //   route: "/addEmployee",
    //   component: <AddEmployee />,
    // },
    // {
    //   type: "collapse",
    //   name: "report",
    //   key: "report",
    //   icon: <AssessmentIcon fontSize="small" />,
    //   route: "/report",
    //   component: <ReportList />,
    // },

    {
      type: "collapse",
      name: "Display Schedule",
      key: "stock_Approval",
      icon: <AssignmentTurnedInIcon fontSize="small" />,
      route: "/scheduleView",
      component: <DisplaySchedule />,
    },
  ];

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  useEffect(() => {
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
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

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
        position: "fixed",
        top: 0,
        bottom: 0,
      }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox component="text" display="flex" alignItems="center">
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
      <List>{renderRoutes}</List>
      <Link to="#" onClick={handleOpenLogoutDialog}>
        <SidenavCollapse
          name="ውጣ"
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
            onClick={handleLogoutConfirmed}
            color="error"
            style={{ borderRadius: "15%" }}
          >
            ውጣ
          </MDButton>
        </DialogActions>
      </Dialog>
    </SidenavRoot>
  );
}

StudentSidenav.defaultProps = {
  color: "info",
  brand: "",
};

StudentSidenav.propTypes = {
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

export default StudentSidenav;
