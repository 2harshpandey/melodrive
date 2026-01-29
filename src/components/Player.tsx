
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  styled,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeDown,
  Loop,
  FastForward,
  FastRewind,
} from '@mui/icons-material';
import { usePlayer } from '../context/PlayerContext';

const PlayerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar + 1,
}));

const Player: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    loop,
    togglePlay,
    setVolume,
    toggleLoop,
  } = usePlayer();
  const playerRef = useRef<any>(null);

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + seconds);
    }
  };

  if (!currentSong) {
    return null;
  }

  const playerProps = {
    ref: playerRef,
    url: currentSong.url,
    playing: isPlaying,
    volume: volume,
    loop: loop,
    onPlay: !isPlaying ? togglePlay : undefined,
    onPause: isPlaying ? togglePlay : undefined,
    style: { display: 'none' },
  };

  return (
    <PlayerContainer>
      <ReactPlayer {...playerProps} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="subtitle1">{currentSong.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {currentSong.artist}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleSeek(-10)}>
            <FastRewind />
          </IconButton>
          <IconButton onClick={togglePlay}>
            {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
          </IconButton>
          <IconButton onClick={() => handleSeek(10)}>
            <FastForward />
          </IconButton>
          <IconButton onClick={toggleLoop} color={loop ? 'primary' : 'inherit'}>
            <Loop />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" width={150}>
          <VolumeDown />
          <Slider
            aria-label="Volume"
            value={volume}
            onChange={(e, newValue) => setVolume(newValue as number)}
            min={0}
            max={1}
            step={0.01}
          />
          <VolumeUp />
        </Box>
      </Box>
    </PlayerContainer>
  );
};

export default Player;
