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
import Billing from "../../layouts/billing";
import EmployeeList from "../../layouts/profile";
import AddEmployee from "../../layouts/addEmployee";
import AddMenuItem from "../../layouts/menuEntry";
import FoodMenu from "../../layouts/foodMenu";
import BuyFood from "../../layouts/buyFood";
import InventoryEntry from "../../layouts/inventory";
import Constraint from "../../layouts/constraints";
import Deposit from "../../layouts/deposit";
import { Icon } from "semantic-ui-react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AddDepartment from "../../layouts/addDepartment";
import Department from "../../layouts/departmentList";
import colors from "../../assets/theme/base/colors"; 
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
import BusinessIcon from "@mui/icons-material/Business";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "../../context";
import ReportList from "../../layouts/report";
import MDButton from "../../components/MDButton";

function AdminSidenav({ brand, brandName, selectedMenu, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const collapseName = location.pathname.replace("/", "");
  const iconStyle = {
    
    color: colors.badgeColors.primary.main, 
  };

  const handleLogout = () => {
    setOpenLogoutDialog(true);
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
    
    }
  };

  const routes = [
    {
      type: "collapse",
      name: "ሰራተኛ ማስገቢያ",
      key: "addEmployee",
      icon: <AddIcon fontSize="small" style={iconStyle}/>,
      route: "/addEmployee",
      component: <AddEmployee />,
    },

    {
      type: "collapse",
      name: "ዲፓርትመንት ማስገቢያ ",
      key: "addDepartment",
      icon: <AddIcon fontSize="small" style={iconStyle}>login</AddIcon>,
      route: "/addDepartment",
      component: <AddDepartment />,
    },

    {
      type: "collapse",
      name: "ዲፓርትመንት ዝርዝር",
      key: "departmentList",
      icon: <BusinessIcon fontSize="small" style={iconStyle}>login</BusinessIcon>,
      route: "/departmentList",
      component: <Department />,
    },

    {
      type: "collapse",
      name: "ሰራተኛ  ዝርዝር",
      key: "profile",
      icon: <PersonIcon fontSize="small" style={iconStyle}/>,
      route: "/profile",
      component: <EmployeeList />,
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
      <List>{renderRoutes}</List>
      <Link to="/" onClick={handleLogout}>
        <SidenavCollapse
          name="ውጣ"
          icon={<LogoutIcon fontSize="small" style={iconStyle}>person</LogoutIcon>}
        />
      </Link>
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { padding: "15px"} }}
      >
        <DialogTitle id="alert-dialog-title">ማረጋገጫ</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            እርግጠኛ ነዎት መውጣት ይፈልጋሉ?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{justifyContent: "space-between"}}>
          <MDButton onClick={handleCloseLogoutDialog} color="info" style={{borderRadius: "15%"}}>
            አይ
          </MDButton>
          <MDButton onClick={handleLogoutConfirmed} color="error" style={{borderRadius: "15%"}}>
            ውጣ
          </MDButton>
        </DialogActions>
      </Dialog>
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
