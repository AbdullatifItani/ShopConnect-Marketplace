import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import ProfileDropdown from "./ProfileDropdown";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
    let { token, logout } = useContext(AuthContext);
    let navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                SHOPCONNECT
              </Typography>
              { token ?
              <ProfileDropdown onLogout={logout} /> :
              <Button variant="contained" onClick={handleLogin}>Login</Button>
              }
            </Toolbar>
        </AppBar>
    );
}