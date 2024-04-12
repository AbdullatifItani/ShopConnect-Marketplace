import { SERVER_URL_USER } from "../config";

export const sendProfilePicData = (file, user_id, token) => {
    // Prepare the data to send (e.g., user ID, image data as base64)
    const formData = new FormData();
    formData.append("profile_pic", file);
    formData.append("user_id", user_id); // Replace with your way to get user ID
  
    try {
      const response = fetch(`${SERVER_URL_USER}/uploadProfilePic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        console.log("Profile picture updated successfully!");
        // You can show a success message to the user here
      } else {
        console.error("Failed to update profile picture:", response.text());
        // Handle errors appropriately, e.g., show an error message to the user
      }
    } catch (error) {
      console.error("Error sending profile picture data:", error);
      // Handle errors appropriately, e.g., show an error message to the user
    }
  };