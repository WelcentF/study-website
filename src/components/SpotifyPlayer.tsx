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

interface LyricLine {
  time: number;
  text: string;
}

// Store lyrics for specific songs (add your own lyrics here)
const LYRICS_DATABASE: Record<string, string> = {
  "Who Knows - Daniel Caesar": `[00:00.03] I'll probably be a waste of your time, but who knows?
[00:08.80] Chances are I'll step out of line, but who knows?
[00:16.55] Lately, you've set up in my mind
[00:19.87] Yeah, girl, you, and I like that
[00:23.63] 
[00:32.87] Lately, I've been thinking that perhaps I am a coward
[00:40.55] Hiding in a disguise of an ever-giving flower
[00:48.55] Incompetent steward of all of that sweet, sweet power
[00:55.24] 
[01:04.27] Yesterday was feeling so good, now it's gone
[01:11.96] I'd feel like that always if I could, is that wrong?
[01:20.43] Tell me 'bout the city you're from
[01:22.92] Is it hot? Does it snow there?
[01:27.84] 
[01:36.11] Lately, I've been thinking 'bout my precarious future
[01:44.12] Will you be there with me by my side, my girl, my shooter?
[01:52.12] Who's to say who calculates? Not me, I'm no computer
[01:58.88] 
[02:07.34] Is it a crime to be unsure?
[02:13.94] In time, we'll find if it's sustainable
[02:23.07] You're pure, you're kind, mature, divine
[02:30.99] You might be too good for me, unattainable
[02:37.27] 
[03:11.41] Maybe we get married one day, but who knows?
[03:18.83] Think I'll take that thought to the grave, but who knows?
[03:27.19] I know that I'll love you always
[03:30.35] Yeah, girl, you, and I like that
[03:34.99] `,
  // Add songs by track name and artist
  // "Who Knows - Daniel Caesar": `your LRC format lyrics here`,
};

const SpotifyPlayer = () => {
  const [token, setToken] = useState<string | null>(null);
  const [inputs, setInputs] = useState({ clientId: "", clientSecret: "" });
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLyric, setCurrentLyric] = useState<string>("");
  const [parsedLyrics, setParsedLyrics] = useState<LyricLine[]>([]);
  const [lyricKey, setLyricKey] = useState(0);

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

  // Parse LRC format lyrics
  const parseLyrics = (lrcString: string): LyricLine[] => {
    const lines = lrcString.split("\n");
    const parsed: LyricLine[] = [];

    lines.forEach((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\]\s*(.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseFloat(match[2]);
        const timeInMs = (minutes * 60 + seconds) * 1000;
        const text = match[3].trim();
        if (text) {
          parsed.push({ time: timeInMs, text });
        }
      }
    });

    return parsed.sort((a, b) => a.time - b.time);
  };

  // Load lyrics when track changes
  useEffect(() => {
    if (currentTrack) {
      const trackKey = `${currentTrack.name} - ${currentTrack.artists[0].name}`;
      const lrcData = LYRICS_DATABASE[trackKey];

      if (lrcData) {
        const lyrics = parseLyrics(lrcData);
        setParsedLyrics(lyrics);
      } else {
        setParsedLyrics([]);
        setCurrentLyric("");
      }
    }
  }, [currentTrack]);

  // Update current lyric based on progress
  useEffect(() => {
    if (parsedLyrics.length === 0) return;

    // Add 800ms offset to show lyrics slightly earlier
    const adjustedProgress = progress + 800;

    let currentIndex = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
      if (adjustedProgress >= parsedLyrics[i].time) {
        currentIndex = i;
      } else {
        break;
      }
    }

    if (currentIndex >= 0) {
      const newLyric = parsedLyrics[currentIndex].text;
      if (newLyric !== currentLyric) {
        setCurrentLyric(newLyric);
        setLyricKey((prev) => prev + 1);
      }
    } else {
      setCurrentLyric("");
    }
  }, [progress, parsedLyrics, currentLyric]);

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
        <div className="spotify-auth-title">Connect to Spotify</div>
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
          </div>
          {currentLyric && (
            <div key={lyricKey} className="lyrics-display">
              {currentLyric}
            </div>
          )}
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
