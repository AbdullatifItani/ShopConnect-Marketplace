import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { validateToken } from '../apis/validate_token_api';
import { NavBar } from '../components/NavBar';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function Home() {
  const { token, logout} = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };
  
  setTimeout(useEffect(() => {
    validateToken(token).then((valid) => {
      if (valid === false)
        handleLogout();
    });
  }, []), 100);

  return (
    <>
        <div>
          <NavBar/>

          <div className="main-content" style={{"display":"flex", "flexDirection":"column", "justifyContent":"center", "alignItems":"center"}}>
            <h2>Home</h2>
            SOME CONTENT
          </div>
        </div>
      
    </>
  );
}

export default Home;
