import React, { useState, useRef } from "react";
import { FaUser, FaEdit, FaCamera, FaSpinner } from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import { useAuth } from "../../../context/AuthContext";

const ProfileTab = ({ user, updateProfile }) => {
  const { updateUserProfile } = useAuth();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: user.name || "",
    email: user.email || "",
    profileImage: user.profileImage || "",
    monthlyBudget: user.monthlyBudget || "",
  });
  
  const fileInputRef = useRef(null);

  function capitalizeFirstLetter(string) {
    if (!string || string.length === 0) {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Handle profile picture upload
  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    await uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      const response = await api.post('/auth/uploadprofilepic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success('Profile picture updated successfully');
        if (response.data.user) {
          updateUserProfile(response.data.user);
        }
        setPreviewImage(null);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.response?.data?.error || 'Failed to upload profile picture');
      setPreviewImage(null);
    } finally {
      setUploadingImage(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      name: profileForm.name,
      email: profileForm.email,
      monthlyBudget: profileForm.monthlyBudget,
    };

    if (profileForm.password) {
      updateData.password = profileForm.password;
    }

    const result = await updateProfile(updateData);

    if (result.success) {
      toast.success("Profile updated successfully");
      setShowProfileForm(false);
      setProfileForm(prev => ({ ...prev, password: "" }));
    } else {
      toast.error(result.message);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current && !uploadingImage) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profile-section">
       <title>Profile - ExpenseTracker</title>
      <h1>User Profile</h1>

      <div className="profile-card">
        {/* Profile Header with Picture */}
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar-wrapper" onClick={triggerFileInput}>
              {uploadingImage ? (
                <div className="profile-avatar-loading">
                  <FaSpinner className="spinner-icon" />
                </div>
              ) : (
                <>
                  {user?.profileImage || previewImage ? (
                    <img
                      src={previewImage || user?.profileImage}
                      alt={user?.name}
                      className="profile-avatar-img"
                    />
                  ) : (
                    <div className="profile-avatar-icon">
                      <FaUser />
                    </div>
                  )}
                  <div className="profile-avatar-edit">
                    <FaCamera />
                  </div>
                </>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePictureChange}
              disabled={uploadingImage}
            />
            
            {uploadingImage && (
              <div className="uploading-text">
                Uploading...
              </div>
            )}
          </div>
          
          <div className="profile-info">
            <h2>{capitalizeFirstLetter(user?.name)}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        {!showProfileForm ? (
          <div className="profile-details">
            <div className="detail-item">
              <label>Monthly Budget</label>
              <p>Rs: {user?.monthlyBudget || 0}/-</p>
            </div>
            <div className="detail-item">
              <label>Member Since</label>
              <p>
                {format(new Date(user?.createdAt || Date.now()), "MMMM yyyy")}
              </p>
            </div>
            <button
              className="btn-edit-profile"
              onClick={() => setShowProfileForm(true)}
            >
              <FaEdit /> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Monthly Budget</label>
              <input
                type="number"
                step="0.01"
                value={profileForm.monthlyBudget}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    monthlyBudget: e.target.value,
                  })
                }
                placeholder="Enter monthly budget"
              />
            </div>

          
            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Save Changes
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowProfileForm(false);
                  setProfileForm({
                    name: user.name || "",
                    email: user.email || "",
                    monthlyBudget: user.monthlyBudget || "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
