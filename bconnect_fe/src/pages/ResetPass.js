import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Snackbar, TextField, Button } from '@mui/material';
import './ResetPass.css'; // Create a ResetPass.css file with similar styles to Login.css

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ResetPass() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    // Password validation logic
    if (password !== confirmPassword) {
      toast("Passwords do not match!")
      return;
    }
    // Further submission logic here

  };

  useEffect(() => {
    setToken(searchParams.get("reset_token"));
  }, [searchParams]);

  return (
    <div className="reset-pass-container">
        <h1>SHOP CONNECT</h1>
      <div className="reset-pass-form">
        <h2>Reset Password</h2>
        <div className="form-item">
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </div>
        <div className="form-item">
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={({ target: { value } }) => setConfirmPassword(value)}
          />
        </div>
        <Button
          className="reset-pass-button"
          variant="contained"
          onClick={handleSubmit}
        >
          Reset Password
        </Button>
      </div>
    </div>
  );
}

export default ResetPass;
