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
  "Man I Need - Olivia Dean": `[00:01.01] Talk to me, talk to me
[00:04.62] Talk to me, talk to me
[00:07.89] Hm
[00:09.63] Looks like we're making up for lost time
[00:13.71] Need you to spell it out for me
[00:17.47] Bossa Nova on all night
[00:21.63] It's like a type of alchemy
[00:25.47] Introduce me to your best friend
[00:29.71] I can come and slot right in
[00:33.83] A satellite ain't even that far
[00:37.59] I, I kinda wonder where you are
[00:41.07] Already know I can't leave it alone
[00:43.71] You're on my mind, mm
[00:48.23] Already gave you the time and the place
[00:51.79] So, don't be shy
[00:54.35] Just come be the man I need
[00:56.47] Tell me you got something to give, I want it
[01:00.88] I kinda like it when you call me wonderful
[01:05.11] Whatever the type of talk it is, come on then
[01:08.83] I gotta know you're meant to be the man I need
[01:13.47] Talk to me
[01:14.95] Talk to me
[01:16.79] Mm, talk to me, talk to me
[01:18.79] Be the man that I need, baby
[01:20.83] Talk to me, talk to me
[01:22.68] Be the man that I need, need, need
[01:25.15] Mm, talk to me, talk to me
[01:26.67] Be the man that I need, baby
[01:29.03] Talk to me, talk to me
[01:30.67] Be the man, man, man, man, man
[01:34.55] I'd like to think you feel the same way
[01:37.99] But I can't tell with you sometimes
[01:42.27] So, baby, let's get on the same page
[01:46.32] Stop making me read between the lines
[01:49.35] Already know I can't leave it alone
[01:52.15] You're on my mind, mm
[01:55.43] Already gave you the time and the place
[01:59.79] So, don't be shy
[02:02.67] Just come be the man I need
[02:05.03] Tell me you got something to give, I want it
[02:09.39] I kinda like it when you call me wonderful
[02:13.35] Whatever the type of talk it is, come on then
[02:17.31] I gotta know you're meant to be the man I need
[02:21.95] Talk to me, talk to me
[02:25.00] Talk to me, talk to me
[02:29.43] Mm, talk to me, talk to me
[02:31.44] Be the man that I need, baby (be the man)
[02:33.95] Talk to me, talk to me
[02:35.28] Be the man that I need, need, need
[02:37.40] Mm, talk to me, talk to me
[02:39.28] Be the man that I need, baby (be the man)
[02:41.67] Talk to me, talk to me
[02:43.23] Be the man, man, man, man, man
[02:45.83] Mm
[02:49.59] Mm-mm, mm-mm, mm
[02:53.35] Mm-mm, mm
[02:55.71] Mm-mm, mm-mm, mm-mm, mm-mm, mm
[03:01.71] 
`,
  "So Easy (To Fall In Love) - Olivia Dean": `[00:05.74] I could be the twist, the one to make you stop
[00:08.97] The icing on your cake, the cherry on the top
[00:12.47] It's heaven in my heart, and we could find you some space, mm
[00:19.39] I could be the world to you, the missing piece
[00:22.53] That extra sentimental kind of chemistry
[00:25.93] Some people make it hard, with me, that isn't the case
[00:30.68] 'Cause I make it so easy to fall in love
[00:37.36] So come give me a call, and we'll fall into us
[00:44.12] I'm the perfect mix of Saturday night and the rest of your life
[00:49.47] Anyone with a heart would agree
[00:53.22] It's so easy to fall in love with
[00:58.66] The way I do my hair, the way I make you laugh
[01:02.00] The way we like to share, a walk in Central Park
[01:05.67] I could be fresh air, might be the girl of your dreams (dream, dream)
[01:12.03] There's no need to hide if you're into me
[01:15.36] 'Cause I'm into you quite intimately
[01:18.86] And maybe one night could turn into three
[01:22.01] Well, I'm down to see
[01:23.79] 'Cause I make it so easy to fall in love
[01:30.53] So come give me a call, and we'll fall into us
[01:37.22] I'm the perfect mix of Saturday night and the rest of your life
[01:42.67] Anyone with a heart would agree
[01:46.42] It's so easy to fall in love with me (me, me)
[01:55.54] (Me, me, me, me, me, me)
[02:04.94] It's so easy (me, me)
[02:08.64] It's so easy (me, me)
[02:12.19] It's so easy (me, me)
[02:14.99] Hey, yeah, hey (me, me)
[02:18.19] It's so easy to fall in love
[02:23.66] So come give me a call, and we'll fall into us
[02:30.46] I'm the perfect mix of Saturday night and the rest of your life
[02:35.83] Anyone with a heart would agree
[02:39.54] It's so easy to fall in love with me
[02:45.08] 

`,
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
