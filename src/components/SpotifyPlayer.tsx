import React, { useEffect, useState } from "react";
import { spotifyApi, REDIRECT_URI } from "../services/spotifyService";
import "./SpotifyPlayer.css";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  uri: string;
  album: {
    images: { url: string }[];
  };
  duration_ms: number;
}

const SpotifyPlayer = () => {
  const [token, setToken] = useState<string | null>(null);
  const [inputs, setInputs] = useState({ clientId: "", clientSecret: "" });
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

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

  // Fetch current playback when connected
  useEffect(() => {
    if (!token) return;

    const fetchCurrentPlayback = async () => {
      try {
        const playback = await spotifyApi.getCurrentPlayback(token);
        if (playback && playback.item) {
          setCurrentTrack(playback.item);
          setIsPlaying(playback.is_playing);
          setProgress(playback.progress_ms || 0);
          setDuration(playback.item.duration_ms || 0);
        }
      } catch (error) {
        console.error("Failed to fetch playback:", error);
      }
    };

    fetchCurrentPlayback();
    // Poll every 1 second to update playback state
    const interval = setInterval(fetchCurrentPlayback, 1000);

    return () => clearInterval(interval);
  }, [token]);

  const handleLogin = () => {
    localStorage.setItem("client_secret", inputs.clientSecret);
    spotifyApi.requestAuthorization(inputs.clientId);
  };

  const handlePause = async () => {
    if (!token) return;

    try {
      await spotifyApi.pausePlayback(token);
      setIsPlaying(false);
    } catch (error) {
      console.error("Pause failed:", error);
    }
  };

  const handleResume = async () => {
    if (!token) return;

    try {
      await spotifyApi.resumePlayback(token);
      setIsPlaying(true);
    } catch (error) {
      console.error("Resume failed:", error);
    }
  };

  const handleSkip = async () => {
    if (!token) return;

    try {
      await spotifyApi.skipToNext(token);
      // Immediately fetch the new track
      setTimeout(async () => {
        const playback = await spotifyApi.getCurrentPlayback(token);
        if (playback && playback.item) {
          setCurrentTrack(playback.item);
          setIsPlaying(playback.is_playing);
          setProgress(playback.progress_ms || 0);
          setDuration(playback.item.duration_ms || 0);
        }
      }, 500);
    } catch (error) {
      console.error("Skip failed:", error);
    }
  };

  const handlePrevious = async () => {
    if (!token) return;

    try {
      await spotifyApi.skipToPrevious(token);
      // Immediately fetch the new track
      setTimeout(async () => {
        const playback = await spotifyApi.getCurrentPlayback(token);
        if (playback && playback.item) {
          setCurrentTrack(playback.item);
          setIsPlaying(playback.is_playing);
          setProgress(playback.progress_ms || 0);
          setDuration(playback.item.duration_ms || 0);
        }
      }, 500);
    } catch (error) {
      console.error("Previous failed:", error);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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
        <span className="spotify-connected-icon"></span>
        Currently Playing:
      </div>

      {currentTrack ? (
        <>
          <div className="now-playing">
            <img
              src={currentTrack.album.images[0]?.url}
              alt={currentTrack.name}
            />
            <div className="now-playing-info">
              <div className="track-name">{currentTrack.name}</div>
              <div className="track-artist">
                {currentTrack.artists.map((a) => a.name).join(", ")}
              </div>
              <div className="progress-container">
                <span className="progress-time">{formatTime(progress)}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(progress / duration) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-time">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          <div className="controls">
            <button onClick={handlePrevious} className="previous-btn">
              ⏮
            </button>
            <button
              onClick={isPlaying ? handlePause : handleResume}
              className="play-pause-btn"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button onClick={handleSkip} className="skip-btn">
              ⏭
            </button>
          </div>
        </>
      ) : (
        <p className="spotify-subtitle">
          No song currently playing. Start playing on Spotify!
        </p>
      )}
    </div>
  );
};

export default SpotifyPlayer;
