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
import StockRequest from "../../layouts/stockRequest";
import Approval from "../../layouts/stockApproval";
import IngredientRequest from "../../layouts/ingredientRequest";
import IngredientApproval from "../../layouts/ingredientApproval";
import Constraint from "../../layouts/constraints";
import Deposit from "../../layouts/deposit";
import InventoryList from "../../layouts/showInventory";
import CafeManagerDashboard from "../../layouts/dashboard/cafeManagerDashboard";
import { Icon } from "semantic-ui-react";
// import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
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
// import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ShowApproval from "../../layouts/showIngredientApproval";
import colors from "../../assets/theme/base/colors"; 
import StockApproval from "../../layouts/showApprovedStock";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "../../context";
import ReportList from "../../layouts/report";
import CommetteDashboard from "../../layouts/dashboard/cafeCommetteDashboard";
import DepartmentBilling from "../../layouts/billing/DepartmentBilling";
import MDButton from "../../components/MDButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

function CafeManagerSidenav({ brand, brandName, selectedMenu, ...rest }) {
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
      name: "ትዕዛዞች",
      key: "tables",
      icon: <TableViewOutlinedIcon fontSize="small" style={iconStyle} />,
      route: "/tables",
      component: <Tables />,
    },
    {
      type: "collapse",
      name: "የሜኑ ምግቦች ዝርዝር",
      key: "food_menu",
      icon: <FastfoodIcon fontSize="small" style={iconStyle}/>,
      route: "/food_menu",
      component: <FoodMenu />,
    },
    // {
    //   type: "collapse",
    //   name: "Menu Entry",
    //   key: "add_food",
    //   icon: <RestaurantMenuIcon fontSize="small" />,
    //   route: "/addfood",
    //   component: <AddMenuItem />,
    // },
    {
      type: "collapse",
      name: "ከስቶር ማውጫ ፎርም",
      key: "stockRequest",
      icon: <ShoppingCartIcon fontSize="small" style={iconStyle}/>,
      route: "/stockRequest",
      component: <StockRequest />,
    },
    // {
    //   type: "collapse",
    //   name: "Stock Approval",
    //   key: "stock_Approval",
    //   icon: <AssignmentTurnedInIcon fontSize="small" />,
    //   route: "/stockApproval",
    //   component: <Approval />,
    // },
    // {
    //   type: "collapse",
    //   name: "Ingredient Request",
    //   key: "ingredient_Request",
    //   icon: <KitchenIcon fontSize="small" />,
    //   route: "/ingredientRequest",
    //   component: <IngredientRequest />,
    // },
    {
      type: "collapse",
      name: "ለእንግዳ ደረሰኝ",
      key: "billingManager",
      icon: <ReceiptLongIcon fontSize="small" style={iconStyle}/>,
      route: "/billingManager",
      component: <Billing showEditColumn={true} />,
    },
    
    {
      type: "collapse",
      name: "ለዲፓርትመንት ደረሰኝ",
      key: "departmentBilling",
      icon: <ReceiptLongIcon fontSize="small" style={iconStyle}/>,
      route: "/departmentBilling",
      component: <DepartmentBilling />,
    },
    {
      type: "collapse",
      name: "የመተግበሪያ ገጽታ",
      key: "stock_Approval",
      icon: <AssignmentTurnedInIcon fontSize="small" style={iconStyle}/>,
      route: "/showApprovedStock",
      component: <StockApproval />,
    },
    // {
    //   type: "collapse",
    //   name: "Report",
    //   key: "report",
    //   icon: <AssessmentIcon fontSize="small" />,
    //   route: "/report",
    //   component: <ReportList />,
    // },
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
          <MDButton onClick={handleLogoutConfirmed} color="error"  style={{borderRadius: "15%"}}>
            ውጣ
          </MDButton>
        </DialogActions>
      </Dialog>
    </SidenavRoot>
  );
}

CafeManagerSidenav.defaultProps = {
  color: "info",
  brand: "",
};

CafeManagerSidenav.propTypes = {
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

export default CafeManagerSidenav;
