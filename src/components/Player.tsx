import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import { Box, Typography, IconButton, Slider, styled, useTheme } from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeDown,
  Loop,
  FastForward,
  FastRewind,
  Close,
} from '@mui/icons-material';
import { usePlayer } from '../context/PlayerContext';

const PlayerContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVideoMode',
})<{ isVideoMode?: boolean }>(({ theme, isVideoMode }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  zIndex: theme.zIndex.appBar + 1,
  ...(isVideoMode
    ? {
        top: 0,
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }
    : {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1, 2),
        borderTop: `1px solid ${theme.palette.divider}`,
      }),
}));

const ControlsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isVideoMode',
})<{ isVideoMode?: boolean }>(({ theme, isVideoMode }) => ({
  width: '100%',
  ...(isVideoMode
    ? {
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: theme.spacing(2, 4),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
      }
    : {}),
}));

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
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
  const theme = useTheme();
  const {
    currentSong,
    isPlaying,
    isVideoMode,
    volume,
    loop,
    progress,
    duration,
    playedSeconds,
    togglePlay,
    setVolume,
    toggleLoop,
    exitVideoMode,
    handleProgress,
    handleDuration,
    handleEnded,
  } = usePlayer();
  const playerRef = useRef<ReactPlayer>(null);

  const handleSeekChange = (event: Event, newValue: number | number[]) => {
    playerRef.current?.seekTo(newValue as number, 'fraction');
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

  const controlColor = isVideoMode ? theme.palette.common.white : 'inherit';

  return (
    <PlayerContainer isVideoMode={isVideoMode}>
      {isVideoMode && (
        <IconButton
          aria-label="close"
          onClick={exitVideoMode}
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
        >
          <Close />
        </IconButton>
      )}

      <ReactPlayer
        ref={playerRef}
        url={currentSong.url}
        playing={isPlaying}
        volume={volume}
        loop={loop}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        width={isVideoMode ? '90%' : '0%'}
        height={isVideoMode ? '90%' : '0%'}
        style={isVideoMode ? {} : { display: 'none' }}
      />
      <ControlsContainer isVideoMode={isVideoMode}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {!isVideoMode && (
            <Box sx={{ width: '25%', pr: 2 }}>
              <Typography variant="subtitle1" noWrap>
                {currentSong.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {currentSong.artist}
              </Typography>
            </Box>
          )}

          <Box sx={{ width: isVideoMode ? '100%' : '50%' }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <IconButton size="small" onClick={() => handleSeek(-10)} sx={{ color: controlColor }}>
                <FastRewind />
              </IconButton>
              <IconButton onClick={togglePlay} sx={{ color: controlColor }}>
                {isPlaying ? (
                  <Pause sx={{ height: 38, width: 38 }} />
                ) : (
                  <PlayArrow sx={{ height: 38, width: 38 }} />
                )}
              </IconButton>
              <IconButton size="small" onClick={() => handleSeek(10)} sx={{ color: controlColor }}>
                <FastForward />
              </IconButton>
              <IconButton
                size="small"
                onClick={toggleLoop}
                color={loop ? 'primary' : 'inherit'}
                sx={{ color: loop ? 'primary.main' : controlColor }}
              >
                <Loop />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="caption" sx={{ mr: 1, color: controlColor }}>
                {formatTime(playedSeconds)}
              </Typography>
              <Slider
                aria-label="time-indicator"
                size="small"
                value={progress}
                min={0}
                step={0.01}
                max={1}
                onChange={handleSeekChange}
                sx={{ color: controlColor }}
              />
              <Typography variant="caption" sx={{ ml: 1, color: controlColor }}>
                {formatTime(duration)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: '25%',
              display: isVideoMode ? { xs: 'none', md: 'flex' } : 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <VolumeDown sx={{ color: controlColor }} />
            <Slider
              aria-label="Volume"
              size="small"
              value={volume}
              onChange={(e, newValue) => setVolume(newValue as number)}
              min={0}
              max={1}
              step={0.01}
              sx={{ width: { xs: 70, md: 100 }, ml: 1, color: controlColor }}
            />
            <VolumeUp sx={{ color: controlColor }} />
          </Box>
        </Box>
      </ControlsContainer>
    </PlayerContainer>
  );
};

export default Player;