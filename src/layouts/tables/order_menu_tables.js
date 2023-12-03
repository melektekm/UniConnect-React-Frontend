import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {BASE_URL} from "../../appconfig";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const TodayOrders = () => {
    const [menuItems, setMenuItems] = useState({});
    const electron = window.require("electron");
    const ipcRenderer = electron.ipcRenderer;
    const userData = ipcRenderer.sendSync("get-user");
    const accessToken = userData.accessToken

    useEffect(() => {
        const fetchTodayOrders = async () => {
            const response = await axios.get(`${BASE_URL}/menu-items/today`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setMenuItems(response.data);
        };

        fetchTodayOrders();
    }, []);

    return (
        <Paper elevation={3} sx={{ marginTop: 2, padding: 2 }}>
        <TableContainer component={Paper}>
            <div align="center"> Todays order count</div>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Menu Item</TableCell>
                        <TableCell align="right">Order Count</TableCell>
                    </TableRow>
                    {Object.entries(menuItems).map(([name, count]) => (
                        <TableRow key={name}>
                            <TableCell component="th" scope="row">
                                {name}
                            </TableCell>
                            <TableCell align="right">{count}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Paper>
    );
};

export default TodayOrders;
