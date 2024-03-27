import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import "./ProfileViewerDialog.css";

export default function ProfileViewerDialog({
  open,
  onSubmit,
  onClose,
  title,
  submitText,
  initialUsername,
  initialBioDesc

}) {
  let [username, setUsername] = useState(initialUsername);
  let [bioDesc, setBioDesc] = useState(initialBioDesc);
  let [profilePic, setProfilePic] = useState(null);
  let [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    onSubmit(username, bioDesc, profilePic);
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className="profile-dialog-container">
        <DialogTitle>{title}</DialogTitle>
        <div className="profile-info">
          <div className="profile-pic-container">
            <Avatar
              alt={username}
              src={profilePic}
              className="profile-pic"
            />
            {isEditing && (
              <IconButton
                onClick={handleEditClick}
                className="edit-icon"
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
            )}
          </div>
          <div className="profile-details">
            {!isEditing ? (
              <>
                <div className="info-item">
                  <strong>Username:</strong> {username}
                </div>
                <div className="info-item">
                  <strong>Bio Description:</strong> {bioDesc}
                </div>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  
                />
                <TextField
                  fullWidth
                  label="Bio Description"
                  type="text"
                  value={bioDesc}
                  onChange={(e) => setBioDesc(e.target.value)}
                />
              </>
            )}
          </div>
        </div>
        {isEditing && (
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            className="submit-btn"
          >
            {submitText}
          </Button>
        )}
      </div>
    </Dialog>
  );
  
}
