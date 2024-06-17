import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";

const AnnouncementItemCard = ({ item, onDelete, onEdit, onViewFile }) => {
  const handleViewFile = () => {
    onViewFile(item.file_url);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  const handleEdit = () => {
    onEdit(item.id, item.title);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {item.title}
        </Typography>
        <Typography variant="body2" component="p">
          {item.content}
        </Typography>
        <Typography color="textSecondary">Date: {item.date}</Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewFile}
            >
              View File
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Grid>
          <Grid item>
            <Button
              component={Link}
              to={`/announcements/edit/${item.id}/${encodeURIComponent(
                item.title
              )}`}
              variant="contained"
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AnnouncementItemCard;
