import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Snackbar, TextField, Button } from '@mui/material';
import './ResetPass.css'; // Create a ResetPass.css file with similar styles to Login.css

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { reset_pass_api } from '../apis/reset_pass_api';
toast.configure();

function ResetPass() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  let navigate = useNavigate();

  const handleSubmit = () => {
    // Password validation logic
    if (password !== confirmPassword) {
      toast("Passwords do not match!")
      return;
    }
    // Further submission logic here
    reset_pass_api(token, password)
    .then((response) => {
        if (!response.ok) {
            toast.error(`Err. ${response.status}: Unable to reset password`);
            return null;
        }
        toast(`Success!`);
        setTimeout(()=>{navigate("/home");}, 500)
        return response.json();
    });
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
