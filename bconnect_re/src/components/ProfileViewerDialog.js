import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
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
  initialBioDesc,
  initialProfilePic,
}) {
  let [modifiedBio, setBio2] = useState("");
  let [editing, setEditing] = useState(false);

  
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <div className="dialog-container">
        <DialogTitle>{title}</DialogTitle>
        <div className="form-item">
          <Typography>
            Username: {initialUsername}
          </Typography>
        </div>

        <div className="form-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? (
            <>
              <TextField
                fullWidth
                type = "text"
                onChange={({target: {value}})=>setBio2(value)}
              />
              <Button
                color="primary"
                variant="contained"
                onClick={() => {onSubmit(modifiedBio);
                                setEditing(false);}}
            >
                Save
              </Button>
            </>
          ) : (
            <>
              <Typography>
                Description: {initialBioDesc}
              </Typography>
              <Button onClick={() => setEditing(true)}>
                <EditIcon />
              </Button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
