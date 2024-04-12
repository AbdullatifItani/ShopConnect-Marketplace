import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { validateToken } from '../apis/validate_token_api';
import { NavBar } from '../components/NavBar';

function Home() {
  const { token, logout} = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };
  
  useEffect(() => {
    validateToken(token).then((valid) => {
      if (valid === false)
        handleLogout();
    });
  }, []);

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
