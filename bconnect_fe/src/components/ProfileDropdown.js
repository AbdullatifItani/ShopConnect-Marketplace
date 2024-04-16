import { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { AuthContext } from '../AuthContext';
import { fetchProfilePic } from '../apis/fetch_profile_pic_api';
import { ProfileView } from './ProfileView';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

function ProfileDropdown({ onLogout }) {
  const { token, user_id } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  
  let [initialProfilePic, setProfilePic] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    onLogout();
    handleClose();
    toast.success("Logged Out Successfully!");
  };

  const handleViewProfile = () => {
    setViewingProfile(true);
  }

  useEffect(() => {
    fetchProfilePic(user_id, setProfilePic);
  }, [user_id])

  return (
    <div>
      <Avatar alt="Profile Picture" src={initialProfilePic ? initialProfilePic : "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"} onClick={handleClick} />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleViewProfile}>View Profile Info</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        
      </Menu>

      <ProfileView
        viewing = {viewingProfile}
        setViewing = {setViewingProfile}
        profile_pic = {initialProfilePic}
        setPic = {setProfilePic}
      />
    </div>
  );
}

export default ProfileDropdown;