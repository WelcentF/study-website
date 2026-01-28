import React, { useEffect, useState } from "react";
import { spotifyApi, REDIRECT_URI } from "../services/spotifyService";
import "./SpotifyPlayer.css";

const SpotifyPlayer = () => {
  const [token, setToken] = useState<string | null>(null);
  const [inputs, setInputs] = useState({ clientId: "", clientSecret: "" });

  useEffect(() => {
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      const code = urlParams.get("code");

      if (code) {
        const storedSecret = localStorage.getItem("client_secret") || "";
        spotifyApi.fetchAccessToken(code, storedSecret).then((data) => {
          if (data.access_token) {
            setToken(data.access_token);
            localStorage.setItem("access_token", data.access_token);
            window.history.pushState("", "", REDIRECT_URI);
          }
        });
      }
    } else {
      // Check if we already have a token in storage
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) setToken(storedToken);
    }
  }, []);

  const handleLogin = () => {
    spotifyApi.requestAuthorization(inputs.clientId);
  };

  if (!token) {
    return (
      <div className="spotify-auth">
        <div className="spotify-auth-title">
          <span className="spotify-icon">🎵</span>
          Connect to Spotify
        </div>
        <input
          placeholder="Client ID"
          value={inputs.clientId}
          onChange={(e) => setInputs({ ...inputs, clientId: e.target.value })}
        />
        <input
          placeholder="Client Secret"
          type="password"
          value={inputs.clientSecret}
          onChange={(e) =>
            setInputs({ ...inputs, clientSecret: e.target.value })
          }
        />
        <button className="spotify-connect-btn" onClick={handleLogin}>
          Connect Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="spotify-container">
      <div className="spotify-connected">
        <span className="spotify-connected-icon">✓</span>
        Spotify Connected!
      </div>
      <p className="spotify-subtitle">Ready to play music</p>
    </div>
  );
};

export default SpotifyPlayer;
