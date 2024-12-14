import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function App() {
  const CLIENT_ID = "95199216f302425395d8c048fae3f9b8";
  const REDIRECT_URI = "http://localhost:3000/login";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "playlist-modify-private playlist-modify-public";
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      navigate("/playlists");
    }

    setToken(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify App</h1>
        {!token ? (
          <Link
            to={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
          >
            Login to Spotify
          </Link>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </header>
    </div>
  );
}

export default App;
