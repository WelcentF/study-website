const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
export const REDIRECT_URI = "http://127.0.0.1:5173/";

export const spotifyApi = {
  // Step 1: Redirect to Spotify
  requestAuthorization(clientId: string) {
    localStorage.setItem("client_id", clientId);

    let url = AUTH_ENDPOINT;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURIComponent(REDIRECT_URI);
    url += "&show_dialog=true";
    url +=
      "&scope=user-read-private user-read-email user-modify-playback-state streaming user-read-playback-state";

    window.location.href = url;
  },

  // Step 2: Exchange Code for Token
  async fetchAccessToken(code: string, clientSecret: string) {
    const clientId = localStorage.getItem("client_id");

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("client_id", clientId!);
    params.append("client_secret", clientSecret);

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    return response.json();
  },

  // Search for tracks
  async searchTracks(query: string, token: string) {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.json();
  },

  // Play a track
  async playTrack(trackUri: string, token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [trackUri],
      }),
    });
    return response;
  },

  // Pause playback
  async pausePlayback(token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // Resume playback
  async resumePlayback(token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player/play", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // Get current playback state
  async getCurrentPlayback(token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 204) return null;
    return response.json();
  },

  // Skip to next track
  async skipToNext(token: string) {
    const response = await fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // Skip to previous track
  async skipToPrevious(token: string) {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/previous",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response;
  },
};
