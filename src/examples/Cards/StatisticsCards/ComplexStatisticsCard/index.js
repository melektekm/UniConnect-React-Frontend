import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import axios from "axios";
import { BASE_URL } from "../../../../appconfig";
import StoreIcon from "@mui/icons-material/Store";
import TableChartIcon from "@mui/icons-material/TableChart";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const iconMap = {
  store: <StoreIcon />,
  table_view: <TableChartIcon />,
  monetization: <MonetizationOnIcon />,
  order: <ReceiptIcon />,
  deposit: <AccountBalanceIcon />,
  // Add more mappings as needed
};

function ComplexStatisticsCard({ customStyle, title, icon, count }) {
  const selectedIcon = iconMap[icon] || null;
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          style={customStyle}
          variant="gradient"
          bgColor={customStyle.backgroundColor}
          color={customStyle.color}
          coloredShadow={customStyle.backgroundColor}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          {selectedIcon}
        </MDBox>
        <MDBox textAlign="right" lineHeight={1.25}>
          <MDTypography variant="button" fontWeight="light" color="text">
            {title}
          </MDTypography>
          <MDTypography variant="h4">{count}</MDTypography>
        </MDBox>
      </MDBox>
      <Divider color={customStyle.backgroundColor} />
    </Card>
  );
}

ComplexStatisticsCard.propTypes = {
  customStyle: PropTypes.object,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default ComplexStatisticsCard;
