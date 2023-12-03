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

/**
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav.
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import React from "react";
import Dashboard from "./layouts/dashboard";
import Tables from "./layouts/tables";
import Billing from "./layouts/billing";
import Notifications from "./layouts/notifications";
import EmployeeList from "./layouts/profile";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import MainDashboard from "./layouts/MainDashboard";
import AddEmployee from "./layouts/addEmployee";
import AddMenuItem from "./layouts/menuEntry";
import FoodMenu from "./layouts/foodMenu";
import BuyFood from "./layouts/buyFood";
import InventoryEntry from "./layouts/inventory";
import Constraint from "./layouts/constraints";
import Deposit from "./layouts/deposit";
import CashierDashboard from "./layouts/CashierDashboard";
import CafeCommetteDashboard from "./layouts/CafeCommetteDashboard";
import CommetteDashboard from "./layouts/dashboard/cafeCommetteDashboard";
import StockRequest from "./layouts/stockRequest";
import Approval from "./layouts/stockApproval";
import InventoryList from "./layouts/showInventory";

// @mui icons
import Icon from "@mui/material/Icon";
import SearchMenu from "./layouts/search";
import ReportList from "./layouts/report";
import IngredientRequest from "./layouts/ingredientRequest";
import IngredientApproval from "./layouts/ingredientApproval";

const routes = [
  {
    type: "collapse",
    name: "Main Dashboard",
    key: "mainDashboard",
    icon: <Icon fontSize="small">Main dashboard</Icon>,
    route: "/mainDashboard",
    component: <MainDashboard />,
  },
  {
    type: "collapse",
    name: "Food Menu",
    key: "food_menu",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/foodMenu",
    component: <FoodMenu />,
  },
  {
    type: "collapse",
    name: "Constraint",
    key: "constraint",
    icon: <Icon fontSize="small" />,
    route: "/constraint",
    component: <Constraint />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/commetteDashboard",
    component: <CommetteDashboard />,
  },
  {
    type: "collapse",
    name: "CashierDashboard",
    key: "cashierDashboard",
    icon: <Icon fontSize="small">Cashier dashboard</Icon>,
    route: "/cashierdashboard",
    component: <CashierDashboard />,
  },
  {
    type: "collapse",
    name: "CafeCommetteDashboard",
    key: "cafeCommetteDashboard",
    icon: <Icon fontSize="small">Cashier dashboard</Icon>,
    route: "/cafeCommetteDashboard",
    component: <CafeCommetteDashboard />,
  },
  {
    type: "collapse",
    name: "Menu Entry",
    key: "add_food",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addFood",
    component: <AddMenuItem />,
  },
  {
    type: "collapse",
    name: "Orders",
    key: "orders",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Add Employee",
    key: "Add-employee",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/addEmployee",
    component: <AddEmployee />,
  },
  {
    type: "collapse",
    name: "Buy Food",
    key: "buy_food",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/buyFood",
    component: <BuyFood />,
  },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventory",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/inventory",
    component: <InventoryEntry />,
  },
  {
    type: "collapse",
    name: "Stock Request",
    key: "stock_request",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/stockRequest",
    component: <StockRequest />,
  },
  {
    type: "collapse",
    name: "Stock Approval",
    key: "stock_Approval",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/stockApproval",
    component: <Approval />,
  },
  {
    type: "collapse",
    name: "Ingredient Request",
    key: "ingredient_Request",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/ingredientRequest",
    component: <IngredientRequest />,
  },
  {
    type: "collapse",
    name: "Ingredient Approval",
    key: "ingredient_Approval",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/ingredientApproval",
    component: <IngredientApproval />,
  },
  {
    type: "collapse",
    name: "Inventory list",
    key: "list",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/showInventory",
    component: <InventoryList />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <EmployeeList />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },

  {
    type: "collapse",
    name: "Sign In",
    key: "sign",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Search",
    key: "search",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/search",
    component: <SearchMenu />,
  },
  {
    type: "collapse",
    name: "Report",
    key: "report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/report",
    component: <ReportList />,
  },
  {
    type: "collapse",
    name: "Deposit",
    key: "deposit",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/deposit",
    component: <Deposit />,
  },
  {
    type: "collapse",
    name: "Inventory list",
    key: "list",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/showInventory",
    component: <InventoryList />,
  },
];

export default routes;
