import './App.css';
import { useState, useEffect, useCallback } from "react";
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert, TextField, Select, MenuItem} from '@mui/material';
import { Menu, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserToken,saveUserToken, clearUserToken } from "./localStorage";
import LoginUserCredentialsDialog from './components/UserCredentialsDialog/LoginUserCredentialsDialog.js';
import SignupUserCredentialsDialog from './components/UserCredentialsDialog/SignupUserCredentialsDialog.js';
import ProfileViewer from './components/ProfileViewerDialog.js'


var SERVER_URL_USER = "http://127.0.0.1:8082";
var SERVER_URL_AUTH = "http://127.0.0.1:8080";

const States = {
    PENDING: "PENDING",
    USER_CREATION: "USER_CREATION",
    USER_LOG_IN: "USER_LOG_IN",
    USER_AUTHENTICATED: "USER_AUTHENTICATED",
    };

function App() {
  let [authState, setAuthState] = useState(States.PENDING);
  let [userToken, setUserToken] = useState(getUserToken());
  let [invalidSignIn, setInvalidSignIn] = useState(false);
  let [userExists, setUserExists] = useState(false);
  let [anchorEl, setAnchorEl] = useState(null);
  let [viewingProfile, setViewingProfile] = useState(false);

  let [userName, setUserName] = useState("");
  let [profilePic, setProfilePic] = useState(null);
  let [bioDesc, setBioDesc] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function editProfile(bio_desc, profile_pic) {
    
  }

  function login(username, password) {
    return fetch(`${SERVER_URL_AUTH}/login`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        user_name: username,
        password: password
        }),
    })
    .then((response) => {
        if (response.status === 403){
            setInvalidSignIn(true);
            return null;
        }
        else{ return response.json();}
    })
    .then((body) => {
      setUserToken(body.token);
      saveUserToken(body.token);

      const token = body.token ? `Bearer ${body.token}` : {};

      return fetch(`${SERVER_URL_USER}/getUserInfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
      return response.json();
    })
    .then((userInfo) => {
      console.log(userInfo);
      setAuthState(States.USER_AUTHENTICATED);
      setUserName(username);
      setProfilePic(userInfo["profile_pic"]);
      setBioDesc(userInfo["bio_desc"]);
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
  };
function createUser(username, password, email) {
  return fetch(`${SERVER_URL_AUTH}/createuser`, {
  method: "POST",
  headers: {
      "Content-Type": "application/json",
  },
  body: JSON.stringify({
      user_name: username,
      email: email,
      password: password,
  }),
  }).then((response) => {
      if (response.status === 400){
          setUserExists(true);
      }
      else{login(username, password)}
  }) ;
  }

function logout() {
  setUserToken(null);
  clearUserToken();
}


  return (
    <div>
       <Snackbar
            elevation={6}
            variant="filled"
            open={invalidSignIn}
            autoHideDuration={2000}
            onClose={() => setInvalidSignIn(false)}
            message="Wrong username or password!"
            >
        </Snackbar>

        <Snackbar
            elevation={6}
            variant="filled"
            open={userExists}
            autoHideDuration={2000}
            onClose={() => setUserExists(false)}
            message="Username already exists!"
            >
        </Snackbar>

        <AppBar position="static">
            <Toolbar classes={{ root: "nav" }}>
                <Typography variant="h5">Bconnect</Typography>
                <div>
                {userToken !== null ? (
                  <div>
                    <IconButton
                      color="inherit"
                      onClick={handleMenuOpen}
                      edge="end"
                    >
                      <AccountCircleIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          maxHeight: 200,
                          width: '15ch',
                          display: 'flex',
                          flexDirection: 'column',
                        },
                      }}
                    >
                      <Button
                            color="inherit"
                            onClick={() => setViewingProfile(true)}
                        >View Profile</Button>
                      <Button color="inherit" onClick={logout}>Logout</Button>
                    </Menu>
                    </div>
                    ) :
                        (<div>
                        <Button
                            color="inherit"
                            onClick={() => setAuthState(States.USER_CREATION)}
                        >Register</Button>

                        <Button
                            color="inherit"
                            onClick={() => setAuthState(States.USER_LOG_IN)}
                        >Login</Button>
                        </div>)
                }
                </div>
            </Toolbar>
        </AppBar>

        <SignupUserCredentialsDialog
            open={authState === States.USER_CREATION}
            title="User Registration"
            submitText="Register"
            onClose={() => setAuthState(States.PENDING)}
            onSubmit={createUser}
        />

        <LoginUserCredentialsDialog
            open={authState === States.USER_LOG_IN}
            title="User Sign in"
            submitText="Sign in"
            onClose={() => setAuthState(States.PENDING)}
            onSubmit={login}
        />
        
        <ProfileViewer
            open={viewingProfile}
            title="Profile"
            submitText="View Profile"
            onClose={() => setViewingProfile(false)}
            onSubmit={editProfile}
            initialUsername = {userName}
            initialBioDesc = {bioDesc}
            initialProfilePic = {profilePic}
        />

        <Snackbar
            elevation={6}
            variant="filled"
            open={authState === States.USER_AUTHENTICATED}
            autoHideDuration={2000}
            onClose={() => setAuthState(States.PENDING)}
            >
            <Alert severity="success">Success</Alert>
        </Snackbar>
        
        

    </div>
  );
}

export default App;
