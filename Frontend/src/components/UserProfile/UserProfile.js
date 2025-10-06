import React from "react";
import "./userProfile.css";

const UserProfile = React.memo(({ user }) => {
  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <img
          src="../../../../backend/uploads/Poli/Polinaidu_Photo.png"
          alt="profile"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
          }}
        />
        <div>
          <h3>{user.name || "Unknown User"}</h3>
          <p>Online</p>
        </div>
      </div>

      <div className="user-profile-details">
        <span>Email</span>
        <span>{user.email || "No email provided"}</span>
      </div>

      <div className="user-status-dot"></div>
    </div>
  );
});

export default UserProfile;
