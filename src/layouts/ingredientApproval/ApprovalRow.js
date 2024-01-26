import React, { useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";

function ApprovalRow({ data, onApproveToggle, approvalType }) {
  const [approvedBy, setApprovedBy] = useState(data.approvedBy || "");
  const [status, setStatus] = useState(data.status);

  const handleToggleApprove = () => {
    // Toggle the status
    const newStatus = status === "Approved" ? "Pending" : "Approved";
    setStatus(newStatus);

    // Call the parent function to update the state in the parent component
    onApproveToggle(data.id, newStatus, approvedBy);
  };

  const handleApprovedByChange = (e) => {
    // Update the approvedBy field based on the user's input
    setApprovedBy(e.target.value);
  };

  return (
    <TableRow key={data.id} >
      <TableCell>{data.name}</TableCell>
      <TableCell>{data.quantity}</TableCell>
      <TableCell>{data.measuredIn}</TableCell>
      {approvalType === "ingredient" && (
        <>
          <TableCell>{data.pricePerItem}</TableCell>
          <TableCell>{data.totalPrice}</TableCell>
          <TableCell>{data.totalPriceInWord}</TableCell>
          <TableCell>{data.requestedBy}</TableCell>
          <TableCell>{data.created_at}</TableCell>
          <TableCell>{data.reccomendation}</TableCell>
          <TableCell>
            <Input
              value={approvedBy}
              onChange={handleApprovedByChange}
              placeholder="Enter your name"
            />
          </TableCell>
        </>
      )}
      <TableCell style={{ textAlign: "center" }}>
        <Button
          onClick={handleToggleApprove}
          variant="contained"
          color={status === "Approved" ? "success" : "info"}
          style={{
            backgroundColor: status === "Approved" ? "#4CAF50" : "#2196F3",
            color: "white",
            fontWeight: "bold",
            borderRadius: "20px",
            padding: "5px 20px",
          }}
        >
          {status === "Approved" ? "Revoke Approval" : "Approve"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default ApprovalRow;
