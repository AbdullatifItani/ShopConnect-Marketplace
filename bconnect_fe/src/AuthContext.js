import React, { createContext, useEffect, useState } from 'react';
import { getUserToken,saveUserToken, clearUserToken } from "./localStorage";
import { login_api } from "./apis/login_api.js";
import { validateToken } from './apis/validate_token_api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getUserToken());
  const [user_id, setUser] = useState(null);

  const login = (username, password, setInvalidSignIn) => {
    // Login logic
    return login_api(username, password).then((response) => {
        if (response.status === 403){
            setInvalidSignIn(true);
            return null;
        }
        else{ return response.json();}
    })
    .then((body) => {
        if (!body) {return false;}
        saveUserToken(body.token);
        setToken(body.token);
        setUser(body.user_id);
        return true;
    });
  };

  const logout = () => {
    // Logout logic
    saveUserToken("");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
      validateToken(token).then((valid) => {
        if (valid === false)
          logout();
        else 
          setUser(valid);
      })
  }, [])

  return (
    <AuthContext.Provider value={{ token, user_id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};