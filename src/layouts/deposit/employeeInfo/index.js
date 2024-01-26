import React from "react";
import colors from "../../../assets/theme/base/colors"; 

export default function EmployeeInfo({ info, isSearching }) {
if (isSearching) {
  return <p style={{ fontSize: '16px', color: colors.dark.main, fontFamily: 'Arial' }}>በመፈለግ ላይ ...</p>;
}

if (!info) {
  return <p style={{ fontSize: '16px', color: colors.error.main, fontFamily: 'Arial' }}>ምንም ሰራተኛ አልተገኘም</p>;
}

  return (
    <div>
      <p>
        <strong>የሰራተኛ ስም</strong>: {info.name}
      </p>
     
      <p>
        <strong>ቀሪ ሂሳብ</strong>: {info.balance}
      </p>
    </div>
  );
}
