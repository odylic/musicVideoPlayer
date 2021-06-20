import React from 'react';

export default function Login() {
  return (
    <div className="wrapper">
      <div className="grid">
        <div className="login-container">
          <h1>Login</h1>
        </div>
        <div className="login-button login-button-spotify">
          {/* /auth/spotify for passport */}
          {/* /spotify/login for spotifyController*/}
          <a href="/spotify/login">Login with Spotify</a>
        </div>
        <div className="login-button login-button-google">
          <a href="/auth/google">Login with Google</a>
        </div>
        <div className="login-button login-button-youtube">
          <a href="/auth/youtube">Login with Youtube</a>
        </div>
      </div>
    </div>
  );
}
