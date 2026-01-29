import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import Header from '../components/Header';
import Player from '../components/Player';
import SongList from '../components/SongList';
import { getSongs } from '../services/songService';
import users from '../data/users.json';
import useCloudinaryUpload from '../hooks/useCloudinaryUpload';

const LibraryPage: React.FC = () => {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // In a real app, user would be from auth context
  const user = users[0];

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      if (user) {
        const fetchedSongs = await getSongs(user.cloudinaryTag);
        setSongs(fetchedSongs);
      }
    } catch (err) {
      setError('Failed to fetch songs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const { open } = useCloudinaryUpload({
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || '',
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '',
    tags: [user.cloudinaryTag],
    cropping: false,
    onSuccess: () => {
      fetchSongs(); // Refetch songs after successful upload
    },
  });

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Header />
      <Box sx={{ pb: 15 }}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h4" component="h1">
              Your Library
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                id="search-bar"
                label="Search for a song"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="contained" onClick={open}>
                Upload Song
              </Button>
            </Box>
          </Box>
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && <SongList songs={filteredSongs} />}
        </Container>
      </Box>
      <Player />
    </>
  );
};

export default LibraryPage;