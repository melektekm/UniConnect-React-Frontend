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
import AssignmentsPage from "./layouts/tables";
import Billing from "./layouts/billing";
import Notifications from "./layouts/notifications";
import EmployeeList from "./layouts/profile";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import MainDashboard from "./layouts/MainDashboard";
import AddEmployee from "./layouts/addEmployee";
import CourseUpload from "./layouts/menuEntry";
import FoodMenu from "./layouts/foodMenu";
import BuyFood from "./layouts/buyFood";
import Constraint from "./layouts/constraints";
import Deposit from "./layouts/deposit";
import CashierDashboard from "./layouts/CashierDashboard";
import CafeCommetteDashboard from "./layouts/CafeCommetteDashboard";
import CommetteDashboard from "./layouts/dashboard/cafeCommetteDashboard";
import AddDepartment from "./layouts/addDepartment";
import SearchMenuForInvnetory from "./layouts/search/searchForCafeCommette";
import SearchMenuForAdmin from "./layouts/search/searchForAdmin";
import StockRequest from "./layouts/stockRequest";
import Approval from "./layouts/stockApproval";
import UploadAnnouncement from "./layouts/announcements";
import ViewAnnouncement from "./layouts/viewAnnouncement";
import ViewAssignments from "./layouts/showInventory";
import ShowApproval from "./layouts/showIngredientApproval";
import StockApproval from "./layouts/showApprovedStock";
import AssignmentUpload from "./layouts/buyFood/buyFoodDepartment";
import Department from "./layouts/departmentList";
// import Billing from "./layouts/billing";
// @mui icons
import Icon from "@mui/material/Icon";
import SearchMenu from "./layouts/search/searchForCafeManager";
import ViewCourses from "./layouts/report";
import ScheduleRequest from "./layouts/schedulePost";
import IngredientApproval from "./layouts/ingredientApproval";
import DepartmentBilling from "./layouts/billing/DepartmentBilling";
import CafeManagerDashboard from "./layouts/dashboard/cafeManagerDashboard";
import SearchMenuForCashier from "./layouts/search/searchForCashier";
import CashierOrder from "./layouts/tables/CashierOrderView";
import storeKeeperDashboard from "./layouts/dashboard/storeKeeperDashboard";
import StockAmountTable from "./layouts/stokeAmount";
import InventoryEntry from "./layouts/inventory";
import UploadAssignment from "./layouts/assignmentUpload";
import AddCourseMaterial from "./layouts/courseMaterial";
const routes = [
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "mainDashboard",
    icon: <Icon fontSize="small">Main dashboard</Icon>,
    route: "/mainDashboard",
    component: <MainDashboard />,
  },
  {
    type: "collapse",
    name: "የምግብ ዝርዝር",
    key: "food_menu",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/food_menu",
    component: <FoodMenu />,
  },

  // {
  //   type: "collapse",
  //   name: " guest billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small" />,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  {
    type: "collapse",
    name: "Inventory",
    key: "inventory",
    icon: <Icon fontSize="small" />,
    route: "/inventory",
    component: <InventoryEntry />,
  },
  // {
  //   type: "collapse",
  //   name: "ገደብ",
  //   key: "constraint",
  //   icon: <Icon fontSize="small" />,
  //   route: "/constraint",
  //   component: <Constraint />,
  // },
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/commetteDashboard",
    component: <CommetteDashboard />,
  },
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "cashierDashboard",
    icon: <Icon fontSize="small">Cashier dashboard</Icon>,
    route: "/cashierdashboard",
    component: <CashierDashboard />,
  },
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "storeKeeperDashboard",
    icon: <Icon fontSize="small">Cashier dashboard</Icon>,
    route: "/storeKeeperdashboard",
    component: <storeKeeperDashboard />,
  },
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "cafeCommetteDashboard",
    icon: <Icon fontSize="small">Cashier dashboard</Icon>,
    route: "/cafeCommetteDashboard",
    component: <CafeCommetteDashboard />,
  },
  {
    type: "collapse",
    name: "ዳሽቦርድ",
    key: "cafeMangerDashboard",
    icon: <Icon fontSize="small" />,
    route: "/cafeManagerDashboard",
    component: <CafeManagerDashboard />,
  },
  {
    type: "collapse",
    name: "Announcement post",
    key: "Announcement_post",
    icon: <Icon fontSize="small">Announcement </Icon>,
    route: "/announcements",
    component: <UploadAnnouncement />,
  },
  {
    type: "collapse",
    name: "Announcement View",
    key: "Announcement_view",
    icon: <Icon fontSize="small">Announcement </Icon>,
    route: "/viewAnnouncement",
    component: <ViewAnnouncement />,
  },
  {
    type: "collapse",
    name: "Upload Courses",
    key: "add_food",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/addFood",
    component: <CourseUpload />,
  },
  {
    type: "collapse",
    name: "Assignment List",
    key: "orders",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <AssignmentsPage />,
  },
  {
    type: "collapse",
    name: "ሰራተኛ ማስገቢያ",
    key: "Add-employee",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/addEmployee",
    component: <AddEmployee />,
  },
  {
    type: "collapse",
    name: "Course upload ",
    key: "Add-department",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/addDepartment",
    component: <AddDepartment />,
  },
  {
    type: "collapse",
    name: "ዲፓርትመንት ዝርዝር",
    key: "Department-List",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/departmentList",
    component: <Department />,
  },
  {
    type: "collapse",
    name: "ምግብ መግዣ",
    key: "buyFood",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/buyFood",
    component: <BuyFood />,
  },
  {
    type: "collapse",
    name: "Upload Assignments",
    key: "buy_food_department",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/buyFoodDepartment",
    component: <AssignmentUpload />,
  },
  {
    type: "collapse",
    name: "ከስቶር ማውጫ ፎርም",
    key: "stock_request",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/stockRequest",
    component: <StockRequest />,
  },
  {
    type: "collapse",
    name: "ከስቶረ ማውጫ መፍቀጃ",
    key: "stock_Approval",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/stockApproval",
    component: <Approval />,
  },
  {
    type: "collapse",
    name: "ግዢ መፍቀጃ",
    key: "Ingredient_Approval",
    icon: <Icon fontSize="small">AssignmentTurnedInIcon</Icon>,
    route: "/showIngredientApproval",
    component: <ShowApproval />,
  },
  {
    type: "collapse",
    name: "ከስቶረ ማውጫ መፍቀጃ",
    key: "stock_Approval",
    icon: (
      <Icon fontSize="small" color="primary">
        AssignmentTurnedInIcon
      </Icon>
    ),
    route: "/showApprovedStock",
    component: <StockApproval />,
  },
  {
    type: "collapse",
    name: "Schedule Post",
    key: "ingredient_Request",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/schedulePost",
    component: <ScheduleRequest />,
  },
  {
    type: "collapse",
    name: "ግዢ መፍቀጃ ",
    key: "ingredient_Approval",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/ingredientApproval",
    component: <IngredientApproval />,
  },
  {
    type: "collapse",
    name: "View Assignment",
    key: "list",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/showInventory",
    component: <ViewAssignments />,
  },
  {
    type: "collapse",
    name: "ለእንግዳ ደረሰኝ",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billingCashier",
    component: <Billing showEditColumn={false} />,
  },

  {
    type: "collapse",
    name: "ስቶረ ውስጥ የቀረ እቃ",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/stokeAmount",
    component: <StockAmountTable />,
  },
  {
    type: "collapse",
    name: "ለዲፓርትመንት ደረሰኝ",
    key: "Department_billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/departmentBilling",
    component: <DepartmentBilling />,
  },
  {
    type: "collapse",
    name: "ለእንግዳ ደረሰኝ",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billingManager",
    component: <Billing showEditColumn={true} />,
  },

  {
    type: "collapse",
    name: "ማስታወቂያ",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },
  {
    type: "collapse",
    name: "ሰራተኛ  ዝርዝር",
    key: "ሰራተኛ  ዝርዝር",
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
    name: "ፈልግ",
    key: "search",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/search",
    component: <SearchMenu />,
  },
  {
    type: "collapse",
    name: "ፈልግ",
    key: "searchInventory",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/searchForInventory",
    component: <SearchMenuForInvnetory />,
  },
  {
    type: "collapse",
    name: "ፈልግ",
    key: "search_For_cashier",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/searchForCashier",
    component: <SearchMenuForCashier />,
  },
  {
    type: "collapse",
    name: "ፈልግ",
    key: "searchAdmin",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/searchForAdmin",
    component: <SearchMenuForAdmin />,
  },
  {
    type: "collapse",
    name: "Course List",
    key: "report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/report",
    component: <ViewCourses />,
  },
  {
    type: "collapse",
    name: "የገንዘብ አያያዝ",
    key: "deposit",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/deposit",
    component: <Deposit />,
  },
  {
    type: "collapse",
    name: "ትዕዛዞች",
    key: "cashierOrder",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/cashierOrder",
    component: <CashierOrder />,
  },
  {
    type: "collapse",
    name: "ለእንግዳ ደረሰኝ",
    key: "billingCashier",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billingCashier",
    component: <Billing showEditColumn={false} />,
  },
  {
    type: "collapse",
    name: "Upload Assignment",
    key: "assignmentUpload",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/assignmentUpload",
    component: <UploadAssignment />,
  },
  {
    type: "collapse",
    name: "Upload Course Material",
    key: "courseMaterial",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/courseMaterial",
    component: <AddCourseMaterial />,
  },
];

export default routes;
