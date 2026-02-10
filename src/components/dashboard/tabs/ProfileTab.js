import React, { useState } from 'react';
import { FaUser, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const ProfileTab = ({ user, updateProfile }) => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    monthlyBudget: user?.monthlyBudget || '',
  });

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
      toast.success('Profile updated successfully');
      setShowProfileForm(false);
      setProfileForm({ ...profileForm, password: '' });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="profile-section">
      <h1>User Profile</h1>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <div className="profile-info">
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        {!showProfileForm ? (
          <div className="profile-details">
            <div className="detail-item">
              <label>Monthly Budget</label>
              <p>${user?.monthlyBudget || 0}</p>
            </div>
            <div className="detail-item">
              <label>Member Since</label>
              <p>{format(new Date(user?.createdAt || Date.now()), 'MMMM yyyy')}</p>
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
                  setProfileForm({ ...profileForm, monthlyBudget: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={profileForm.password}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, password: e.target.value })
                }
                placeholder="Enter new password"
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
                    name: user?.name || '',
                    email: user?.email || '',
                    password: '',
                    monthlyBudget: user?.monthlyBudget || '',
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