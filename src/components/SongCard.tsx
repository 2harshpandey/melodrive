
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import { usePlayer } from '../context/PlayerContext';

interface Song {
  url: string;
  title: string;
  artist: string;
  albumArt?: string;
}

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const { playSong } = usePlayer();

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <CardMedia
        component="img"
        sx={{ width: 60, height: 60, borderRadius: 1 }}
        image={song.albumArt || 'https://via.placeholder.com/150'}
        alt={song.title}
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography component="div" variant="subtitle1">
          {song.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          {song.artist}
        </Typography>
      </CardContent>
      <IconButton aria-label="play/pause" onClick={() => playSong(song)}>
        <PlayArrow sx={{ height: 38, width: 38 }} />
      </IconButton>
    </Card>
  );
};

export default SongCard;
