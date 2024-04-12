import { useContext, useEffect, useState } from "react";
import { updateBio } from "../apis/update_bio_api";
import { getInfo } from "../apis/get_profile_info_api";
import { AuthContext } from "../AuthContext";
import ProfileViewerDialog from "./ProfileViewerDialog";


export function ProfileView({viewing, setViewing, profile_pic, setPic}) {
    let { user_id } = useContext(AuthContext);
    let [username, setUsername] = useState("");
    let [bio_desc, setBio] = useState("");
    
    const fetchInfo = () => {
        console.log(user_id);
        getInfo(user_id)
        .then(data => {
            setUsername(data["username"] !== null ? data["username"] : "");
            setBio(data["bio"] !== null ? data["bio"] : "");
        });
    }

    const updateProfile = (desc, token) => {updateBio(desc, token)
        .then(()=>{setBio(desc);
        fetchInfo()});
    }

    useEffect(() => {
        fetchInfo();
    }, [user_id]);

    return (
        <>
        <ProfileViewerDialog
            open={Boolean(viewing)}
            title="Profile"
            onClose={() => {setViewing(false);}}
            onSubmit={updateProfile}
            initialUsername={username}
            initialBioDesc={bio_desc}
            initialProfilePic={profile_pic}
            onUpdateProfilePic={setPic}
        />
        </>
    );
}