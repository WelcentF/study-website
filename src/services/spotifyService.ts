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
};
