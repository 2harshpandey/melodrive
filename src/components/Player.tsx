
import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  styled,
  Grid,
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
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar + 1,
}));

// Function to format seconds into MM:SS
const formatTime = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const Player: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    loop,
    progress,
    duration,
    togglePlay,
    setVolume,
    toggleLoop,
    handleProgress,
    handleDuration,
  } = usePlayer();
  const playerRef = useRef<any>(null);

  const handleSeekChange = (event: Event, newValue: number | number[]) => {
    if (playerRef.current) {
      playerRef.current.seekTo(newValue as number, 'fraction');
    }
  };

  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + seconds);
    }
  };

  if (!currentSong) {
    return null;
  }

  return (
    <PlayerContainer>
      <ReactPlayer
        ref={playerRef}
        url={currentSong.url}
        playing={isPlaying}
        volume={volume}
        loop={loop}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onPlay={!isPlaying ? togglePlay : undefined}
        onPause={isPlaying ? togglePlay : undefined}
        style={{ display: 'none' }}
      />
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={3}>
          <Typography variant="subtitle1" noWrap>{currentSong.title}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {currentSong.artist}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <IconButton size="small" onClick={() => handleSeek(-10)}>
              <FastRewind />
            </IconButton>
            <IconButton onClick={togglePlay}>
              {isPlaying ? <Pause sx={{ height: 38, width: 38 }} /> : <PlayArrow sx={{ height: 38, width: 38 }} />}
            </IconButton>
            <IconButton size="small" onClick={() => handleSeek(10)}>
              <FastForward />
            </IconButton>
            <IconButton size="small" onClick={toggleLoop} color={loop ? 'primary' : 'inherit'}>
              <Loop />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography variant="caption" sx={{ mr: 1 }}>{formatTime(progress * duration)}</Typography>
            <Slider
              aria-label="time-indicator"
              size="small"
              value={progress}
              min={0}
              step={0.01}
              max={1}
              onChange={handleSeekChange}
            />
            <Typography variant="caption" sx={{ ml: 1 }}>{formatTime(duration)}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <VolumeDown />
            <Slider
              aria-label="Volume"
              size="small"
              value={volume}
              onChange={(e, newValue) => setVolume(newValue as number)}
              min={0}
              max={1}
              step={0.01}
              sx={{ width: 100, ml: 1 }}
            />
            <VolumeUp />
          </Box>
        </Grid>
      </Grid>
    </PlayerContainer>
  );
};

export default Player;
