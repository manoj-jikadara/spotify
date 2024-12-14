import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

const PlaylistForm = ({
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  buttonText,
}) => (
  <Box mb={3}>
    <TextField
      fullWidth
      label="Playlist Name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      margin="normal"
    />
    {description !== undefined && (
      <TextField
        fullWidth
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
    )}
    <Button variant="contained" color="primary" onClick={onSubmit}>
      {buttonText}
    </Button>
  </Box>
);

const PlaylistItem = ({ playlist, onDelete }) => (
  <ListItem
    secondaryAction={
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => onDelete(playlist.id)}
      >
        <DeleteIcon />
      </IconButton>
    }
  >
    <ListItemText
      primary={
        <Link
          to={playlist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {playlist.name}
        </Link>
      }
    />
  </ListItem>
);

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const { data } = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPlaylists(data.items);
      } catch (err) {
        setError("Failed to fetch playlists. Please try again.");
        console.error(err);
      }
    };

    fetchPlaylists();
  }, [token]);

  const handleCreate = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      const userResponse = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = userResponse.data.id;

      const { data } = await axios.post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        { name, description, public: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPlaylists((prevPlaylists) => [...prevPlaylists, data]);
      setName("");
      setDescription("");
    } catch (err) {
      setError("Failed to create playlist. Please try again.");
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!updatedName.trim() || !selectedId) {
      return;
    }

    try {
      await axios.put(
        `https://api.spotify.com/v1/playlists/${selectedId}`,
        { name: updatedName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === selectedId
            ? { ...playlist, name: updatedName }
            : playlist
        )
      );
      setUpdatedName("");
      setSelectedId("");
    } catch (err) {
      setError("Failed to update playlist. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      await axios.delete(
        `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.id !== playlistId)
      );
    } catch (err) {
      setError("Failed to delete playlist. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="spotify-app">
      <Box p={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="h6" gutterBottom>
          Create Playlist
        </Typography>
        <PlaylistForm
          onSubmit={handleCreate}
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          buttonText="Create"
        />

        <Typography variant="h6" gutterBottom>
          Update Playlist
        </Typography>
        <Box mb={3}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="playlist-select-label">
              Select a playlist
            </InputLabel>
            <Select
              labelId="playlist-select-label"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {playlists.map((playlist) => (
                <MenuItem key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="New Playlist Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Box>

        <Typography variant="h6" gutterBottom>
          Playlists
        </Typography>
        <List>
          {playlists.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDelete}
            />
          ))}
        </List>
      </Box>
    </div>
  );
};

export default Playlist;
