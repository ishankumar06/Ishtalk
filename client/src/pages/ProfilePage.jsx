import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [profileImage, setProfileImage] = useState(authUser.profilePic || null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleAction = async (e) => {
    if (e.type === 'change' && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setSelectedImg(file);
        setProfileImage(URL.createObjectURL(file));
      }
      return;
    }

    if (e.type === 'submit') {
      e.preventDefault();
      setIsSaved(true);

      if (!selectedImg) {
        await updateProfile({ fullName, bio });
        setIsSaved(false);
        navigate('/');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImg);
      reader.onload = async () => {
        await updateProfile({ profilePic: reader.result, fullName, bio });
        setIsSaved(false);
        navigate('/');
      };
      reader.onerror = () => {
        setIsSaved(false);
        // Handle error if needed
      };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[650px] h-[400px] bg-gradient-to-br from-yellow-600 via-blue-400 to-yellow-900 rounded-full opacity-60 blur-[100px]" />
      </div>
      <div className="relative z-10 flex items-center justify-center w-full">
        <div className="bg-black bg-opacity-50 backdrop-blur-2xl rounded-xl border border-gray-400/25 w-[480px] p-8 flex flex-row items-center gap-12 shadow-2xl">
          <form className="flex-1" onSubmit={handleAction}>
            <h2 className="text-white text-lg font-medium mb-7">Profile details</h2>
            <div
              className="flex items-center gap-4 mb-5 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="profile" className="rounded-full w-12 h-12 object-cover" />
                ) : (
                  <svg fill="currentColor" className="text-gray-400 w-7 h-7" viewBox="0 0 20 20">
                    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM2 18a8 8 0 1116 0H2z" />
                  </svg>
                )}
              </div>
              <span className="text-gray-300 text-sm">upload profile image</span>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleAction}
              />
            </div>
            <input
              type="text"
              placeholder="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
            />
            <textarea
              placeholder="Hi Everyone, I am Using QuickChat"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full mb-6 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 resize-none h-16 focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className={`w-full py-2 rounded bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-white font-semibold ${
                isSaved ? 'opacity-70' : ''
              } transition`}
              disabled={isSaved}
            >
              {isSaved ? 'Saved!' : 'Save'}
            </button>
          </form>

          <div className="flex flex-col justify-center items-center w-36 h-36 bg-black bg-opacity-30 rounded-xl">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-36 h-36 rounded-xl object-cover shadow-lg"
              />
            ) : (
              <div className="bg-yellow-600 rounded-full p-9 flex items-center justify-center shadow-xl">
                <span className="text-white text-5xl font-bold">•••</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
