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
import AssignmentsPage from "./layouts/assignmentList";
import SignIn from "./layouts/authentication/sign-in";
import SignUp from "./layouts/authentication/sign-up";
import MainDashboard from "./layouts/MainDashboard";
import AddEmployee from "./layouts/addEmployee";
import CoordinatorDashboard from "./layouts/CoordinatorDashboard";
import StudentDashboard from "./layouts/StudentDashboard";
import UploadCourse from "./layouts/courseUpload";
import SearchMenuForInvnetory from "./layouts/search/searchForCafeCommette";
import SearchMenuForAdmin from "./layouts/search/searchForAdmin";
import SubmitAssignment from "./layouts/submitAssignment";
import UploadAnnouncement from "./layouts/announcements";
import ViewAnnouncement from "./layouts/viewAnnouncement";
import ViewAssignments from "./layouts/assignmentView";
import DisplaySchedule from "./layouts/scheduleView";
import NotifyStudents from "./layouts/notifyStudents";
import InstructorDashboard from "./layouts/dashboard/instructorDashboard";
// @mui icons
import Icon from "@mui/material/Icon";
import SearchMenu from "./layouts/search/searchForCafeManager";
import ViewCourses from "./layouts/courseList";
// import ScheduleRequest from "./layouts/schedulePost";
import ApproveScheduleRequest from "./layouts/scheduleApproval";
// import DepartmentBilling from "./layouts/billing/DepartmentBilling";
import DeanDashboard from "./layouts/dashboard/deanDashboard";
import SearchMenuForCashier from "./layouts/search/searchForCashier";
import UploadAssignment from "./layouts/assignmentUpload";
import AddCourseMaterial from "./layouts/courseMaterial";
import CourseMaterialsPage from "./layouts/CourseMaterialList";
import CourseMaterialsList from "./layouts/courseMaterialStudent";
// import SubmitAssignment from "./layouts/submitAssignment";
import SubmittedAssignments from "./layouts/viewSubmittedAssignment";
import ScheduleRequest from "./layouts/schedulePost";
import EmployeeList from "./layouts/employeeList";
import ViewCoursesStudent from "./layouts/courseListstudent";
import ViewCoursesInstructor from "./layouts/courseListInstructor";
const routes = [
  {
    type: "collapse",
    name: "dashboard",
    key: "mainDashboard",
    icon: <Icon fontSize="small">Main dashboard</Icon>,
    route: "/mainDashboard",
    component: <MainDashboard />,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/StudentDashboard",
    component: <StudentDashboard />,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "CoordinatorDashboard",
    icon: <Icon fontSize="small">coordinator dashboard</Icon>,
    route: "/CoordinatorDashboard",
    component: <CoordinatorDashboard />,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "instructorDashboard",
    icon: <Icon fontSize="small">coordinator dashboard</Icon>,
    route: "/instructorDashboard",
    component: <InstructorDashboard />,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "StudentDashboard",
    icon: <Icon fontSize="small">coordinator dashboard</Icon>,
    route: "/StudentDashboard",
    component: <StudentDashboard />,
  },
  {
    type: "collapse",
    name: "dashboard",
    key: "cafeMangerDashboard",
    icon: <Icon fontSize="small" />,
    route: "/deanDashboard",
    component: <DeanDashboard />,
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
    component: <UploadCourse />,
  },
  {
    type: "collapse",
    name: "Assignment List",
    key: "assignment-list",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/assignmentList",
    component: <AssignmentsPage />,
  },
  {
    type: "collapse",
    name: "add user",
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
    route: "/addFood",
    component: <UploadCourse />,
  },
  {
    type: "collapse",
    name: "display Schedule",
    key: "stock_Approval",
    icon: <Icon fontSize="small">AssignmentTurnedInIcon</Icon>,
    route: "/scheduleView",
    component: <DisplaySchedule />,
  },
  {
    type: "collapse",
    name: "Schedule Post",
    key: "schedule_post",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/schedulePost",
    component: <ScheduleRequest />,
  },
  {
    type: "collapse",
    name: "Schedule Approval ",
    key: "ingredient_Approval",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/scheduleApproval",
    component: <ApproveScheduleRequest />,
  },
  {
    type: "collapse",
    name: "View Assignment",
    key: "assignmentView",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/assignmentView",
    component: <ViewAssignments />,
  },
  {
    type: "collapse",
    name: "Submitted Assignment",
    key: "list",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/submit-assignment",
    component: <SubmitAssignment />,
  },

  {
    type: "collapse",
    name: "Notify students",
    key: "list",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/notify-students",
    component: <NotifyStudents />,
  },
  // {
  //   type: "collapse",
  //   name: "ሰራተኛ  ዝርዝር",
  //   key: "ሰራተኛ  ዝርዝር",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <EmployeeList />,
  // },
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
    name: "Search",
    key: "searchInventory",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/searchForInventory",
    component: <SearchMenuForInvnetory />,
  },
  {
    type: "collapse",
    name: "Search",
    key: "search_For_cashier",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/searchForCashier",
    component: <SearchMenuForCashier />,
  },
  {
    type: "collapse",
    name: "Search",
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
    name: "Course List",
    key: "report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/courseListInstructor",
    component: <ViewCoursesInstructor />,
  },
  {
    type: "collapse",
    name: "Course List",
    key: "report",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/courseListstudent",
    component: <ViewCoursesStudent />,
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
  {
    type: "collapse",
    name: "Course Material List",
    key: "courseMaterialList",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/CourseMaterialList",
    component: <CourseMaterialsPage />,
  },
  {
    type: "collapse",
    name: "Course Material List",
    key: "courseMaterialList",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/courseMaterialStudent",
    component: <CourseMaterialsList />,
  },
  {
    type: "collapse",
    name: "Submit Assignment",
    key: "submitAssignment",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/submitAssignment",
    component: <SubmitAssignment />,
  },
  {
    type: "collapse",
    name: "Submitted Assignment",
    key: "submittedAssignment",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/viewSubmittedAssignment",
    component: <SubmittedAssignments />,
  },
  {
    type: "collapse",
    name: "view-employee",
    key: "view-employee",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/viewEmployee",
    component: <EmployeeList />,
  },
];

export default routes;
