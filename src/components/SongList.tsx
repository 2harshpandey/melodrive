
import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SongCard from './SongCard';

interface Song {
  url: string;
  title: string;
  artist: string;
  albumArt?: string;
}

interface SongListProps {
  songs: Song[];
}

const SongList: React.FC<SongListProps> = ({ songs }) => {
  if (songs.length === 0) {
    return <Typography>No songs found in your library.</Typography>;
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))"
      gap={3}
    >
      {songs.map((song, index) => (
        <SongCard song={song} key={index} />
      ))}
    </Box>
  );
};

export default SongList;
