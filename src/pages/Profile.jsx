import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getAdminProfile, uploadAdminAvatar } from '../api/admin'; // Import your API functions

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    profileImage: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Fetch admin profile on component mount
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getAdminProfile();
      setUser({
        name: profileData.name,
        email: profileData.email,
        profileImage: profileData.avatar
      });
      setError('');
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditedUser({...user});
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleSave = () => {
    // In a real implementation, you would call an update API here
    setUser({...editedUser});
    setIsEditing(false);
    setSuccess('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser({...user});
    setIsEditing(false);
    setError('');
  };

  const handleChange = (field, value) => {
    setEditedUser(prev => ({...prev, [field]: value}));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }
    
    try {
      setLoading(true);
      const response = await uploadAdminAvatar(file);
      
      // Update both user and editedUser with the new avatar
      const newAvatarUrl = response.avatar;
      setUser(prev => ({...prev, profileImage: newAvatarUrl}));
      setEditedUser(prev => ({...prev, profileImage: newAvatarUrl}));
      
      setSuccess('Avatar updated successfully!');
      setError('');
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      setError(err.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading && !user.name) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center p-6">
        {/* Profile Card - Centered with better layout */}
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
          
          {/* Profile Header - Centered */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <img 
                src={isEditing ? editedUser.profileImage : user.profileImage} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" 
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
              
              {isEditing && (
                <button
                  onClick={triggerFileInput}
                  disabled={loading}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                disabled={loading}
              />
            </div>
            
            <div className="text-center mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-2xl font-bold text-center border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-6"></div>

          {/* Profile Details - Centered */}
          <div className="space-y-6">
            <div className="text-center">
              <label className="text-sm text-gray-500 block mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              ) : (
                <p className="font-medium text-gray-800">{user.email}</p>
              )}
            </div>
          </div>

          {/* Action Buttons - Centered */}
          <div className="mt-8 flex justify-center">
            {!isEditing ? (
              <button 
                onClick={handleEdit}
                className="flex items-center px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md disabled:opacity-50"
                disabled={loading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-3">
                <button 
                  onClick={handleSave}
                  className="flex items-center px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex items-center px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;