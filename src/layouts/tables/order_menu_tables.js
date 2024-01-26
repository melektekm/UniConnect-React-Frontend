import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../appconfig";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

const TodayOrders = ({ timeRange }) => {
  const [menuItems, setMenuItems] = useState({});
  const electron = window.require("electron");
  const ipcRenderer = electron.ipcRenderer;
  const userData = ipcRenderer.sendSync("get-user");
  const accessToken = userData.accessToken;

  useEffect(() => {
    const fetchTodayOrders = async () => {
      const response = await axios.get(`${BASE_URL}/menu-items/today`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: timeRange,
        },
      });
      setMenuItems(response.data);
    };

    fetchTodayOrders();
  }, [timeRange]);

  return (

      <TableContainer component={Paper} sx={{ display: "block", margin: "0 auto", border: "3px solid #206A5D", width: "80%", align: "center" }}>
        <div align="center" style={{backgroundColor: "#158467",  fontSize: '24px',}}>
          {" "}
          {timeRange === "today"
              ? "የዛሬው"
              : timeRange === "this_week"
                  ? "የዚህ ሳምንት":
                  timeRange === "this_month"
                      ? "የዚህ ወር"
                  : "የሁሉም"}{" "}
          የትዕዛዝ ብዛት
        </div>
        <Table >
          <TableBody>
            <TableRow sx={{backgroundColor: "#158467"}} style={{    borderBottom: '2px solid #000',}}>
              <TableCell align="center"  style={{  fontSize: '18px',
                fontWeight: 'bold', }}> ሜኑ ምግቦች</TableCell>
              <TableCell align="center" style={{  fontSize: '18px',
                fontWeight: 'bold', }}>የትዕዛዝ ብዛት</TableCell>
            </TableRow>
            {Object.entries(menuItems).map(([name, count]) => (
                <TableRow key={name}>
                  <TableCell align="center" component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell align="center">{count}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

  );
};

export default TodayOrders;
