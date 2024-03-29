import { useState, useEffect } from 'react';
import './App.css';
import { AppBar, Toolbar, Typography, Button, Snackbar, Alert, TextField, Select, MenuItem,Menu, IconButton} from '@mui/material';
import { getUserToken,saveUserToken, clearUserToken } from "./localStorage";
import LoginUserCredentialsDialog from './components/UserCredentialsDialog/LoginUserCredentialsDialog.js';
import SignupUserCredentialsDialog from './components/UserCredentialsDialog/SignupUserCredentialsDialog.js';
import ProfileViewerDialog from './components/ProfileViewerDialog.js';
import Avatar from "@mui/material/Avatar";

var SERVER_URL_USER = "http://127.0.0.1:8082";
var SERVER_URL_AUTH = "http://127.0.0.1:8080";

const States = {
  PENDING: "PENDING",
  USER_CREATION: "USER_CREATION",
  USER_LOG_IN: "USER_LOG_IN",
  USER_AUTHENTICATED: "USER_AUTHENTICATED",
  VIEWING_PROFILE: "VIEWING_PROFILE"
  };

  function App(){
    let [authState, setAuthState] = useState(States.PENDING);
    let [userToken, setUserToken] = useState(getUserToken());
    let [initialUsername, setUsername] = useState("");
    let [initialProfilePic, setProfilePic] = useState(null);
    let [initialBioDesc, setBio] = useState("");
    let [userExists, setUserExists] = useState(false);
    let [invalidSignIn, setInvalidSignIn] = useState(false);
    let [menu, setmenu] = useState(null);
    let [editing, setEditing] = useState(false);

    function getInfo() {
      fetch(`${SERVER_URL_USER}/getUserInfo`, {method: 'GET',
      headers: {
          'Authorization': `Bearer ${userToken}`
      }}
      )
      .then(response => response.json())
      .then(data => {
          setUsername(data["username"] !== null ? data["username"] : "");
          setBio(data["bio"] !== null ? data["bio"] : "");
          setProfilePic(data["profilePic"] !== null ? data["profilePic"] : null)
          setAuthState(States.VIEWING_PROFILE); });
}

    function updateBio(initialBioDesc){
      return fetch(`${SERVER_URL_USER}/editBio`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
            bio: initialBioDesc,
            }),
        })
        .then(()=>{setBio(initialBioDesc);
        getInfo()});
    }

    function login(username, password) {
      return fetch(`${SERVER_URL_AUTH}/login`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          user_name: username,
          password: password,
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
          if (!body) {return;}
          setAuthState(States.USER_AUTHENTICATED);
          setUserToken(body.token);
          saveUserToken(body.token);
      })
    }

    function createUser(username, password,email) {
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
            open={authState === States.USER_AUTHENTICATED}
            autoHideDuration={2000}
            onClose={() => setAuthState(States.PENDING)}
            >
            <Alert severity="success">Success</Alert>
        </Snackbar>


        <AppBar position="static">
            <Toolbar classes={{ root: "nav" }}>
                <Typography variant="h5">Bconnect</Typography>
                <div>
                {userToken !== null ? (
                    <div>
                    <Avatar
                      alt={initialUsername}
                      src={initialProfilePic}
                      onClick={() => setmenu(true)}
                      style={{ marginRight: '15px' }}
                    />
                    <Menu
                      menu={menu}
                      open={Boolean(menu)}
                      onClose={() => setmenu(null)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={getInfo}>Profile</MenuItem>
                      <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                  </div>)
                 :
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

        <LoginUserCredentialsDialog
            open={authState === States.USER_LOG_IN}
            title="Login"
            submitText="Login"
            onClose={() => setAuthState(States.PENDING)}
            onSubmit={login}
        />

        <SignupUserCredentialsDialog
            open={authState === States.USER_CREATION}
            title="Sign up"
            submitText="Register"
            onClose={() => setAuthState(States.PENDING)}
            onSubmit={createUser}
        />

        <ProfileViewerDialog
            open={authState === States.VIEWING_PROFILE}
            title="Profile"
            onClose={() => {setAuthState(States.PENDING); setEditing(false)}}
            onSubmit={updateBio}
            initialUsername={initialUsername}
            initialBioDesc={initialBioDesc}
            initialProfilePic={initialProfilePic}
        />

    </div>
  );

  }

export default App;
