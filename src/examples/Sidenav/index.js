import React, { useEffect } from "react";
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
import InventoryList from "../../layouts/showInventory";
import StockRequest from "../../layouts/stockRequest";
import Approval from "../../layouts/stockApproval";
import IngredientRequest from "../../layouts/ingredientRequest";
import IngredientApproval from "../../layouts/ingredientApproval";
import Constraint from "../../layouts/constraints";
import Deposit from "../../layouts/deposit";
import InventoryList from "../../layouts/showInventory";
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
import ReportList from "../../layouts/report";

function Sidenav({ brand, brandName, selectedMenu, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } =
    controller;
  const location = useLocation();
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const collapseName = location.pathname.replace("/", "");
  const handleLogout = async () => {
    try {
      await ipcRenderer.invoke("clear-user");
      navigate("/authentication/sign-in");
    } catch (error) {
      console.error("Failed to clear token:", error);
    }
  };
  const routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: <DashboardIcon fontSize="small" />,
      route: "/dashboard",
      component: <Dashboard />,
    },
    {
      type: "collapse",
      name: "Orders",
      key: "orders",
      icon: <TableViewOutlinedIcon fontSize="small" />,
      route: "/tables",
      component: <Tables />,
    },

    {
      type: "collapse",
      name: "Food Menu",
      key: "food_menu",
      icon: <FastfoodIcon fontSize="small" />,
      route: "/foodMenu",
      component: <FoodMenu />,
    },
    {
      type: "collapse",
      name: "Menu Entry",
      key: "add_food",
      icon: <RestaurantMenuIcon fontSize="small" />,
      route: "/addfood",
      component: <AddMenuItem />,
    },
    {
      type: "collapse",
      name: "Buy Food",
      key: "buy_food",
      icon: <ShoppingCartIcon fontSize="small" />,
      route: "/buyFood",
      component: <BuyFood />,
    },
    {
      type: "collapse",
      name: "Inventory",
      key: "inventory",
      icon: <InventoryIcon fontSize="small" />,
      route: "/inventory",
      component: <InventoryEntry />,
    },
    {
      type: "collapse",
      name: "Inventory list",
      key: "list",
      icon: <ShoppingCartIcon fontSize="small" />,
      route: "/showInventory",
      component: <InventoryList />,
    },
    {
      type: "collapse",
      name: "Stock Request",
      key: "stock_request",
      icon: <Icon fontSize="small" />,
      route: "/stockRequest",
      component: <StockRequest />,
    },
    {
      type: "collapse",
      name: "Stock Approval",
      key: "stock_Approval",
      icon: <Icon fontSize="small"/>,
      route: "/stockApproval",
      component: <Approval />,
    },
    {
      type: "collapse",
      name: "Ingredient Request",
      key: "ingredient_Request",
      icon: <Icon fontSize="small"/>,
      route: "/ingredientRequest",
      component: <IngredientRequest />,
    },
    {
      type: "collapse",
      name: "Ingredient Approval",
      key: "ingredient_Approval",
      icon: <Icon fontSize="small"/>,
      route: "/ingredientApproval",
      component: <IngredientApproval />,
    },
    {
      type: "collapse",
      name: "Add Employee",
      key: "Add-employee",
      icon: <AddIcon fontSize="small" />,
      route: "/addEmployee",
      component: <AddEmployee />,
    },
    {
      type: "collapse",
      name: "Billing",
      key: "billing",
      icon: <ReceiptLongIcon fontSize="small" />,
      route: "/billing",
      component: <Billing />,
    },
    {
      type: "collapse",
      name: "Employee list",
      key: "profile",
      icon: <PersonIcon fontSize="small" />,
      route: "/profile",
      component: <EmployeeList />,
    },
    {
      type: "collapse",
      name: "Report",
      key: "report",
      icon: <AssessmentIcon fontSize="small" />,
      route: "/report",
      component: <ReportList />,
    },
    {
      type: "collapse",
      name: "Constraint",
      key: "constraint",
      icon: <ManageAccountsIcon fontSize="small" />,
      route: "/constraint",
      component: <Constraint />,
    },
    {
      type: "collapse",
      name: "Deposit",
      key: "deposit",
      icon: <AttachMoneyIcon fontSize="small" />,
      route: "/deposit",
      component: <Deposit />,
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
          name="Logout"
          icon={<LogoutIcon fontSize="small">person</LogoutIcon>}
        />
      </Link>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
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

export default Sidenav;
