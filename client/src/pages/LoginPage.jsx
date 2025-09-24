import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  // Individual states for each field
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'signup' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    // For signup mode send 'signup', for login send 'login'
    login(mode === 'signup' ? 'signup' : 'login', {
      fullName,
      email,
      password,
      bio,
    });
  };

  // Handle return/back click resets form and switches to login
  const handleReturnClick = () => {
    setIsDataSubmitted(false);
    setMode('login');
    setFullName('');
    setEmail('');
    setPassword('');
    setBio('');
    setAcceptedPolicy(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background blur */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[400px] bg-gradient-to-br from-yellow-600 via-blue-500 to-yellow-900 rounded-full opacity-70 blur-[100px]" />
      </div>

      <div className="z-10 flex flex-row gap-20 items-center">
       {/* Logo & App Name */}
<div className="flex items-center ml-6 gap-2">
  {/* Logo Image */}
  <img src={assets.logo_icon} alt="Ishtay Logo" className="w-12 h-12 rounded-full" />
   {/* App Name */}
  <span className="text-white text-3xl font-semibold">Ishtay</span>
</div>


        {/* Form */}
        <div className="bg-black bg-opacity-60 backdrop-blur-md p-8 rounded-xl w-[350px] shadow-2xl relative">
          {/* Return arrow top right */}
          <button
            onClick={handleReturnClick}
            className="absolute top-3 right-3 text-white text-xl hover:text-yellow-400"
            aria-label="Return"
            type="button"
          >
            &#8592;
          </button>

          <h2 className="text-white text-xl font-semibold mb-4 capitalize">{mode}</h2>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
                required={!isDataSubmitted}
              />
            )}

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500"
              required
            />

            {mode === 'signup' && isDataSubmitted && (
              <textarea
                name="bio"
                placeholder="Your Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full mb-3 px-4 py-2 rounded bg-gray-900 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 resize-none"
                rows={4}
              />
            )}

            {mode === 'signup' && (
              <label className="mt-3 flex items-center text-gray-300 text-xs">
                <input
                  name="acceptedPolicy"
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="accent-yellow-500 mr-2"
                  required
                />
                Agree to the terms of use & privacy policy
              </label>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold mt-3 transition"
              disabled={mode === 'signup' && !acceptedPolicy}
            >
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {/* Switch prompt */}
          <div className="mt-4 text-gray-400 text-center text-xs">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button
                  className="text-yellow-400 underline hover:text-yellow-300"
                  onClick={() => {
                    setMode('login');
                    setIsDataSubmitted(false);
                  }}
                  type="button"
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  className="text-yellow-400 underline hover:text-yellow-300"
                  onClick={() => {
                    setMode('signup');
                    setIsDataSubmitted(false);
                  }}
                  type="button"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
